// Crear un mapa
var map = L.map('map', {
    zoomControl: false
}).setView([40.41831, -3.70275], 6);


// Agregar una capa de mapa físico
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


function showCurrentLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // Crear un marcador en la ubicación actual
            var marker = L.marker([lat, lng]).addTo(map);
            map.setView([lat, lng], 15); // Centrar el mapa en la ubicación actual
        });
    } else {
        alert("Tu navegador no admite la geolocalización.");
    }
}

// Crear un icono rojo personalizado para los marcadores
var redIcon = L.icon({
    iconUrl: '/assets/img/fueguito.png',
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

