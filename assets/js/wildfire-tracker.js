/**
 * URL for retrieving CSV data from the NASA FIRMS API for a specific date.
 * @param [date] - "YYYY-MM-DD". If none is provided, it will be the current day.
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

/** URL for retrieving weather data based on latitude and longitude coordinates from OPEN WEATHER API. */
const openWeatherURL = (lat, lon) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=efd53a1ca3bae9d1aae362ddf19cbbeb`;

/**
 * 0 = North,
 * 1 = South,
 * 2 = West,
 * 3 = East
 */
const flammability =[
    1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.01, 1, 1, 1.036],
    [1.01, 1, 1, 1.072],
    [1.02, 1, 1, 1.108],
    [1.02, 1, 1, 1.144],
    [1.03, 1, 1, 1.18],
    [1.03, 1, 1, 1.216],
    [1.04, 1, 1, 1.252],
    [1.05, 1, 1, 1.288],
    [1.05, 1, 1, 1.324],
    [1.06, 1, 1, 1.36],
    [1.06, 1, 1, 1.396],
    [1.07, 1, 1, 1.4],
    [1.07, 1, 1, 1.39],
    [1.08, 1, 1, 1.38],
    [1.09, 1, 1, 1.36593],
    [1.09, 1, 1, 1.35186],
    [1.10, 1, 1, 1.33779],
    [1.10, 1, 1, 1.32372],
    [1.11, 1, 1, 1.30965],
    [1.11, 1, 1, 1.29558],
    [1.12, 1, 1, 1.28151],
    [1.13, 1, 1, 1.26744],
    [1.13, 1, 1, 1.25337],
    [1.14, 1, 1.021052, 1.2393],
    [1.14, 1.09, 1.042104, 1.22523],
    [1.15, 1.18, 1.063156, 1.21116],
    [1.15, 1.27, 1.084208, 1.19709],
    [1.16, 1.36, 1.10526, 1.18302],
    [1.17, 1.45, 1.126312, 1.16895],
    [1.17, 1.54, 1.147364, 1.15488],
    [1.18, 1.63, 1.168416, 1.14081],
    [1.18, 1.72, 1.189468, 1.12674],
    [1.19, 1.81, 1.21052, 1.11267],
    [1.19, 1.9, 1.231572, 1.0986],
    [1.20, 1.99, 1.252624, 1.08453],
    [1.20, 2, 1.273676, 1.07046],
    [1.19, 1.99, 1.294728, 1.05639],
    [1.18, 1.9, 1.31578, 1.04232],
    [1.17, 1.81, 1.336832, 1.02825],
    [1.15, 1.72, 1.357884, 1.01418],
    [1.13, 1.63, 1.378936, 1.00011],
    [1.12, 1.54, 1.399988, 1],
    [1.10, 1.45, 1.42104, 1],
    [1.08, 1.36, 1.442092, 1],
    [1.06, 1.27, 1.463144, 1],
    [1.05, 1.18, 1.484196, 1],
    [1.03, 1.09, 1.505248, 1],
    [1.01, 1, 1.5263, 1],
    [1.00, 1, 1.54, 1],
    [1.00, 1, 1.57, 1],
    [1.00, 1, 1.59, 1],
    [1.00, 1, 1.62, 1],
    [1.00, 1, 1.65, 1],
    [1.00, 1, 1.67, 1],
    [1.00, 1, 1.69, 1],
    [1.00, 1, 1.71, 1],
    [1.00, 1, 1.73, 1],
    [1.00, 1, 1.76, 1],
    [1.00, 1, 1.76, 1],
    [1.00, 1, 1.76, 1],
    [1.00, 1, 1.75, 1],
    [1.00, 1, 1.74, 1],
    [1.00, 1, 1.652, 1],
    [1.00, 1, 1.564, 1],
    [1.00, 1, 1.476, 1],
    [1.00, 1, 1.388, 1],
    [1.00, 1, 1.3, 1],
    [1.00, 1, 1.212, 1],
    [1.00, 1, 1.124, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1],
    [1.00, 1, 1, 1]
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

            const main = openWeatherData.main;
            const temp = main.temp;
            const humidity = main.humidity;

            // Algoritmo Propagacion
            /**
             * 0.02146 = Constante porcentual historico España.
             * 273.15 = Cte de transformacion K-> C.
             */
            const kTemp = 0.02146 * (temp - 273.15);

            /** Factor inverso de la humedad. Si la humendad es 100%, kHum = 0. */
            const kHum = (100 - humidity) / 100;

            /** Porcentaje de terreno rural en España */
            const kTerr = 0.7;

            let kFuelIndex = -1;
            if (hour >= 6 && hour <= 19) kFuelIndex = hour - 6;

            const deg = wind.deg;
            let kFc;
            if (deg > 0 && deg < 90) kFc = deg * 0.0111;
            else if (deg > 90 && deg < 180) kFc = (deg - 90) * 0.0111;
            else if (deg > 180 && deg < 270) kFc = (deg - 180) * 0.0111;
            else if (deg > 270 && deg < 360) kFc = (deg - 270) * 0.0111;
            else if (deg === 45 || deg === 135 || deg === 225 || deg === 315)
                kFc = 0.5;
            else kFc = 1;

            let kFuel;
            if (deg > 45 && deg < 135)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][2]);
            else if (deg > 135 && deg < 225)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][1]);
            else if (deg > 225 && deg < 315)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][3]);
            else if (deg > 315 && deg < 45)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][0]);
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
