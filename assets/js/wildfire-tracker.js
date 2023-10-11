/**
 * URL for retrieving CSV data from the NASA FIRMS API for a specific date.
 * @param [date] - "YYYY-MM-DD". If none is provided, it will be the current
 * day.
*/
const firmsURL = (date) => {
  if (date === undefined) {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    date = `${year}-${month}-${day}`;
  };

  return `https://firms.modaps.eosdis.nasa.gov/api/area/csv/8b8845657503cd8c75f8b4a0a7f8b177/MODIS_NRT/-21,30,-4,43/1/${date}`;
};

/** URL for retrieving weather data based on latitude and longitude coordinates
 * from OPEN WEATHER API. */
const openWeatherURL = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=efd53a1ca3bae9d1aae362ddf19cbbeb`;

/**
 * 0 = North, 1 = South, 2 = West, 3 = East
 */
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

async function getfirms() {
  try {
    const response = await fetch(firmsURL());
    return await response.text();
  } catch (error) {
    console.log("Firms API Error: ", error);
  }
}

async function getData() {
  const firmsData = await getfirms();

  const lineas = firmsData.trim().split("\n");
  const coordenadas = await Promise.all(
    lineas.slice(1).map(async (linea) => {
      const valores = linea.split(",");

      const latitud = parseFloat(valores[0]);
      const longitud = parseFloat(valores[1]);
      const hour = parseInt(valores[6].padStart(4, "0").substring(0, 2));

      let openWeatherData;
      await fetch(openWeatherURL(latitud, longitud))
        .then((response) => response.json())
        .then((data) => (openWeatherData = data))
        .catch((error) => {
          console.log("Open Weather Error: ", error);
        });

      const wind = openWeatherData.wind;

      const { temp, temp_min, temp_max, humidity } = openWeatherData.main;

      // Algoritmo Propagacion

      /** Constante en base 1 de la temperatura */
      const kTemp = (temp - temp_min)/(temp_max - temp_min);

      /** Factor inverso de la humedad. Si la humendad es 100%, kHum = 0.
       * */
      const kHum = (100 - humidity) / 100;

      /** Porcentaje de terreno rural en España */
      const kTerr = 0.5;

      let kFuelIndex = -1;
      if (hour >= 6 && hour <= 19) kFuelIndex = hour - 6;

      const deg = wind.deg;

      const kFcPrima = (deflectionAngle = 0) => {
        let trueAngle = (deg - deflectionAngle - 45) * 0.0111 + 0.5;
      
        if (deg < 45 || deg > 90) trueAngle = 1 - trueAngle;
      
        return trueAngle;
      };

      let kFc;
      if (deg > 0 && deg < 90) kFc = kFcPrima();
      else if (deg > 90 && deg < 180) kFc = kFcPrima(90);
      else if (deg > 180 && deg < 270) kFc = kFcPrima(180);
      else if (deg > 270 && deg < 360) kFc = kFcPrima(270);
      else if (deg === 45 || deg === 135 || deg === 225 || deg === 315)
        kFc = 0.5;
      else kFc = 1;

      const kFuelPrima = (cardinalPoint) => 
        kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][cardinalPoint]);

      /** kFuel = kFc * flammability */
      let kFuel;
      if (deg > 45 && deg < 135) kFuel = kFuelPrima(2);
      else if (deg > 135 && deg < 225) kFuel = kFuelPrima(0);
      else if (deg > 225 && deg < 315) kFuel = kFuelPrima(3);
      else if (deg > 315 && deg < 45) kFuel = kFuelPrima(1);
      else kFuel = kFc;

      const firePropagation =
        wind.speed * 3600 * kFc * kHum * kTerr * kTemp * kFuel;

      return {
        latitud,
        longitud,
        windDeg: wind.deg,
        firePropagation,
      };
    }),
  );

  return coordenadas;
}
