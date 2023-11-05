import { redIcon, map, drawLinesWithSecondaryLines } from './map-builder.js';

/**
 * URL for retrieving CSV data from the NASA FIRMS API for a specific date.
 * @param [date] - "YYYY-MM-DD". If none is provided, it will be the current
 * day.
*/
const firmsURL = (source, country, date) => {
  if (date === undefined) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    date = `${year}-${month}-${day}`;
  };

  const apiPath = "https://firms.modaps.eosdis.nasa.gov/api/country/csv";
  const apiKey = "8b8845657503cd8c75f8b4a0a7f8b177";

  return apiPath + `/${apiKey}/${source}/${country}/1/${date}`;
};

/** URL for retrieving weather data based on latitude and longitude coordinates
 * from OPEN WEATHER API. */
const openWeatherURL = (lat, lon) => {
  const apiPath = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "efd53a1ca3bae9d1aae362ddf19cbbeb";
  
  return apiPath + `?lat=${lat}&lon=${lon}&appid=${apiKey}`;
};

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

export async function fetchFirmsData(source, country) {
  let firmsData = {};

  const csvResponse = await fetch(firmsURL(source, country));
  const txtResponse = await csvResponse.text();
  let data = txtResponse.trim().split("\n").slice(1);

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

function sortFirmsPoints(firmsPoints) {
  let count = 0;
  let hotSpotCount = 0;
  let fireCount = 0;
  let hotSpots = [];
  let fires = [];
  let wrap = [];
  let lastKey = "";

  /**
   * Checks if there is any point with a FRP greater than 10.
   * @returns Boolean value indicating if the wrapped points are fires.
   */
  function isFire() {
    let isFire = false;

    for (let i = 0; !isFire && i < wrap.length; i++)
      if (wrap[i].frp > 10) isFire = true;
      
    return isFire;
  }

  firmsPoints.sort((a, b) => a.latitude - b.latitude).map(point => {
    const { latitude, longitude } = point;

    const roundedLat = Math.floor(latitude * 10) / 10;
    const roundedLong = Math.floor(longitude * 10) / 10;
    
    // Unique key
    const key = `${roundedLat},${roundedLong}`;

    if (key !== lastKey) {
      if (count > 0) {
        const checkState = isFire();

        if ((wrap.length >= 4 && checkState) || checkState)
          fires[fireCount++] = wrap;
        else hotSpots[hotSpotCount++] = wrap;
        
        wrap = [];
        count = 0;
      };

      count++;
      lastKey = key;
    };

    // Adds a new entry to the group
    wrap.push(point);
  });

  return { hotSpots, fires };
};

export async function fetchOpenWeatherData(latitude, longitude) {
  const response = await fetch(openWeatherURL(latitude, longitude));
  const openWeatherData = await response.json();

  const windDeg = openWeatherData.wind.deg;
  const windSpeed = openWeatherData.wind.speed;
  const windGust = openWeatherData.wind.gust !== undefined ? true : false;
  const { temp, humidity } = openWeatherData.main;
  const nearbyCity = openWeatherData.name;

  return { windDeg, windSpeed, windGust, temp, humidity, nearbyCity };
};

export function propagationAlgorithm(temp, humidity, windDeg, windSpeed, hour) {
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

export async function pointsPrinter(source, country) {
  // Gets all properties of `country`
  const { abbreviation, name, coordinates } = country;

  // Moves map focus to the coordinates of the country
  map.setView(coordinates, 5);

  /** Gets points from FIRMS API */
  const firmsPoints = await fetchFirmsData(source, abbreviation);

  /** Adding weather info for each FIRMS point */
  const forecastData = await Promise.all(firmsPoints.map(async point => {
    // Data from FIRMS
    const { latitude, longitude } = point;

    /** Get weather from OpenWeather API for each location */
    const openWeatherData = await fetchOpenWeatherData(latitude, longitude);

    return { ...point, ...openWeatherData};
  }));

  console.log(forecastData);
}