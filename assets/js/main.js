// Crear un mapa
var map = L.map('map', {
    zoomControl: false
}).setView([40.41831, -3.70275], 6);

// Agregar una capa de mapa físico
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var currentLocationIsShown = false;

function showCurrentLocation() {
    if ("geolocation" in navigator&&currentLocationIsShown==false) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // Crear un marcador en la ubicación actual
            var marker = L.marker([lat, lng]).addTo(map);
            map.setView([lat, lng], 15); // Centrar el mapa en la ubicación actual
            currentLocationIsShown=true;
        });
    } else if(currentLocationIsShown==true){
        map.setView([40.41831, -3.70275], 6);
        currentLocationIsShown=false;
    }
    else {
        alert("Tu navegador no admite la geolocalización.");
    }
}

// Crear un icono rojo personalizado para los marcadores
var redIcon = L.icon({
    iconUrl: 'assets/img/fueguito.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Agregar un controlador de eventos al botón
var getLocationButton = document.getElementById("getLocationButton");
getLocationButton.addEventListener("click", showCurrentLocation);

// Añadir escala al mapa
var customScale = L.control.scale();
customScale.addTo(map);

// Obtener el contenedor "scale" por su ID y agregar el control de escala
var scaleContainer = document.getElementById("scale");
scaleContainer.appendChild(customScale.getContainer());

/*
    CODIGO API
*/
let fecha = new Date();
let year = fecha.getFullYear();
let month = String(fecha.getMonth() + 1).padStart(2, "0");
let day = String(fecha.getDate()).padStart(2, "0");
let today = `${year}-${month}-${7}`;
const firmsURL = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/8b8845657503cd8c75f8b4a0a7f8b177/MODIS_NRT/-21,30,-4,43/1/${today}`;
const openWeatherURL = (lat, lon) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=efd53a1ca3bae9d1aae362ddf19cbbeb`;

/**
 * 0 = North,
 * 1 = South,
 * 2 = West,
 * 3 = East
 */
const flammability = [
    [0.01, 0.01, 0.01, 0.1],
    [0.01, 0.01, 0.01, 0.2],
    [0.01, 0.01, 0.01, 0.3],
    [0.02, 0.01, 0.1, 0.4],
    [10.06, 0.25, 0.2, 0.25],
    [10.1, 0.5, 0.3, 0.15],
    [10.15, 0.85, 0.4, 0.1],
    [10.18, 1, 0.5, 0.06],
    [10.2, 0.85, 0.6, 0.02],
    [10.1, 0.5, 0.7, 0.01],
    [10.01, 0.25, 0.8, 0.01],
    [10.01, 0.01, 0.7, 0.01],
    [10.01, 0.01, 0.5, 0.01],
    [10.01, 0.01, 0.3, 0.01],
];

async function getfirms() {
    try {
        const response = await fetch(firmsURL);
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
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][0]);
            else if (deg > 135 && deg < 225)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][2]);
            else if (deg > 225 && deg < 315)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][1]);
            else if (deg > 315 && deg < 45)
                kFuel = kFc * (kFuelIndex === -1 ? 1 : flammability[kFuelIndex][3]);
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

let redPoints = [
    {
        latitud: 42.49564,
        longitud: -8.40572,
        windDeg: 117,
        firePropagation: 57.278930162282585
    },
    {
        latitud: 41.24447,
        longitud: -8.13209,
        windDeg: 91,
        firePropagation: 1.5993208823230984
    },
    {
        latitud: 39.93742,
        longitud: -4.11343,
        windDeg: 93,
        firePropagation: 18.041942652413482
    },
    {
        latitud: 41.29595,
        longitud: -8.57903,
        windDeg: 140,
        firePropagation: 177.2957689207814
    },
    {
        latitud: 41.29778,
        longitud: -8.56003,
        windDeg: 140,
        firePropagation: 181.792400741236
    },
    {
        latitud: 39.13458,
        longitud: -6.85553,
        windDeg: 48,
        firePropagation: 264.8938911033144
    },
    {
        latitud: 41.49329,
        longitud: -8.10431,
        windDeg: 89,
        firePropagation: 1283.6012205625782
    },
    {
        latitud: 41.49518,
        longitud: -8.0922,
        windDeg: 88,
        firePropagation: 1281.1499063684598
    }
];

