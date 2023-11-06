/** Retrieves CSV data from the NASA FIRMS API
 * for a specific source and country */
async function fetchFirmsData(source, countryAbbreviation) {
  const apiPath = "https://firms.modaps.eosdis.nasa.gov/api/country/csv";
  const apiKey = "8b8845657503cd8c75f8b4a0a7f8b177";
  const apiUrl = apiPath + `/${apiKey}/${source}/${countryAbbreviation}/1`;

  const csvResponse = await fetch(apiUrl);
  const txtResponse = await csvResponse.text();
  let data = txtResponse.trim().split("\n").slice(1);
  
  let firmsData = [];
  if (data.length > 0)
    firmsData = formatFirmsData(data);
  
  return firmsData;
};

/** Filter useful data from FIRMS */
function formatFirmsData(firmsData) {
  return firmsData.map(data => {
    const point = data.split(",");

    const latitude = parseFloat(point[1]);
    const longitude = parseFloat(point[2]);
    const hour = parseInt(point[7].padStart(4, "0").substring(0, 2));

    /** Fire Radiative Power */
    const frp = parseFloat(point[13]);

    return {latitude, longitude, hour, frp};
  });
};

/** Retrieves weather data based on latitude and longitude coordinates
 * from OPEN WEATHER API. */
async function fetchOpenWeatherData(latitude, longitude) {
  const apiPath = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "efd53a1ca3bae9d1aae362ddf19cbbeb";
  const apiUrl = apiPath + `?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  const openWeatherData = await response.json();

  const windDeg = openWeatherData.wind.deg;
  const windSpeed = openWeatherData.wind.speed;
  const windGust = openWeatherData.wind.gust !== undefined ? true : false;
  const { temp, humidity } = openWeatherData.main;
  const nearbyCity = openWeatherData.name;

  return { windDeg, windSpeed, windGust, temp, humidity, nearbyCity };
};

function propagationAlgorithm(temp, humidity, windDeg, windSpeed, hour) {
  /** 0 = North, 1 = South, 2 = West, 3 = East */
  const flammability = [
    [1.1, 1.1, 1.1, 1.1],
    [1.1, 1.1, 1.1, 1.2],
    [1.1, 1.1, 1.1, 1.3],
    [1.2, 1.1, 1.1, 1.4],
    [1.26, 1.25, 1.2, 1.25],
    [1.1, 1.5, 1.3, 1.15],
    [1.15, 1.85, 1.4, 1.1],
    [1.18, 2, 1.5, 1.26],
    [1.2, 1.85, 1.6, 1.2],
    [1.1, 1.5, 1.7, 1.1],
    [1.1, 1.25, 1.8, 1.1],
    [1.1, 1.1, 1.7, 1.1],
    [1.1, 1.1, 1.5, 1.1],
    [1.1, 1.1, 1.3, 1.1],
  ];
  
  const temp_min = 173.15,
    temp_max = 373.15;

  /** Temperature-dependent constant in base unit */
  const kTemp = (((temp - temp_min) / (temp_max - temp_min)) * (1 - 0.1)) + 0.1;

  /** Inverse humidity factor. If humidity is 100%, kHum = 0 */
  const kHum = (100 - humidity) / 100;

  /** Rural land factor */
  const kTerr = 0.5;

  let kFuelIndex = -1; if (hour >= 6 && hour <= 19) kFuelIndex = hour - 6;

  const kFcPrima = (deflectionAngle = 0) => {
    let trueAngle = (windDeg - deflectionAngle - 45) * 0.0111 + 0.5;

    if (windDeg < 45 || windDeg > 90) trueAngle = 1 - trueAngle;

    return trueAngle;
  };

  let kFc; 
  if (windDeg > 0 && windDeg < 90) kFc = kFcPrima(); 
  else if (windDeg > 90 && windDeg < 180) kFc = kFcPrima(90); 
  else if (windDeg > 180 && windDeg < 270) kFc  = kFcPrima(180); 
  else if (windDeg > 270 && windDeg < 360) kFc = kFcPrima(270);
  else if (windDeg === 45 || windDeg === 135 || windDeg === 225 || windDeg === 315)
    kFc = 0.5;
  else kFc = 1;

  const kFuelPrima = (cardinalPoint) =>
    kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][cardinalPoint]);

  /** kFuel = kFc * flammability */
  let kFuel;
  if (windDeg > 45 && windDeg < 135) kFuel = kFuelPrima(2);
  else if (windDeg > 135 && windDeg < 225) kFuel = kFuelPrima(0);
  else if (windDeg > 225 && windDeg < 315) kFuel = kFuelPrima(3);
  else if (windDeg > 315 && windDeg < 45) kFuel = kFuelPrima(1);
  else kFuel = kFc;

  return (windSpeed * 3600 * kFc * kHum * kTerr * kTemp * kFuel);
};

async function getForecastData(points) {
  return Promise.all(points.map(async point => {
    // Data from FIRMS
    const { latitude, longitude } = point;

    /** Get weather from OpenWeather API for each location */
    const openWeatherData = await fetchOpenWeatherData(latitude, longitude);

    return { ...point, ...openWeatherData};
  }));
};

/** Points are wrapped by near locations
 * and filtered by the following conditions:
 * - A group of points with at least 1 fire, is considered as a group of fires
 *    - Fire propagation is calculated for each one
 * - Other points are considered as hot spots
*/
function wrapPoints(points) {
  points.sort((a, b) => a.nearbyCity.localeCompare(b.nearbyCity));

  let hotSpotCount = 0;
  let fireCount = 0;
  let hotSpots = [];
  let fires = [];
  let cityWrap = [];
  let lastKey = "";
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const nearbyCity = point.nearbyCity;
    
    if (lastKey !== nearbyCity) {
      if (lastKey) {
        if (areFires(cityWrap))
          // Calculate Fire Propagation before pushing to `Fires`
          fires[fireCount++] = cityWrap.map(fire => {
            const {temp, humidity, windDeg, windSpeed, hour} = fire;
  
            fire.propagation = propagationAlgorithm(
              temp, humidity, windDeg, windSpeed, hour
            );
  
            return fire;
          });
        else hotSpots[hotSpotCount++] = cityWrap;
        
        cityWrap = [];
      };
      lastKey = nearbyCity;
    };
    
    cityWrap.push(point);
  };
  
  return {fires, hotSpots};
};

/** 
 * A group of points with at least 1 point
 * which FRP is higher than 10 are fires
*/
function areFires(points) {
  let areFires = false;

  for (let i = 0; !areFires && i < points.length; i++) {
    const {frp} = points[i];

    if (frp > 10) areFires = true;
  };

  return areFires;
};

export async function pointsTracker(source, countryAbbreviation) {
  /** Gets points from FIRMS API */
  const firmsPoints = await fetchFirmsData(source, countryAbbreviation);

  /** Adding weather info for each FIRMS point */
  const forecastData = await getForecastData(firmsPoints);

  /** Group points by nearby city and type */
  const points = wrapPoints(forecastData);

  return points;
};
