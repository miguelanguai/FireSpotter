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

// Coordenadas correspondientes a los puntos a añadir
var redPoints = [
    //probando con los datos de Tenerife
    [28.383562, -16.597461]
];

// Función para agregar marcadores rojos en las coordenadas especificadas
function addRedMarkers() {
    for (var i = 0; i < redPoints.length; i++) {
        var redMarker = L.marker(redPoints[i], { icon: redIcon }).addTo(map);
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

//Llamar a la funcion que añade puntos en el mapa
addRedMarkers();

// Añadir escala al mapa
var customScale = L.control.scale();
customScale.addTo(map);

// Obtener el contenedor "scale" por su ID y agregar el control de escala
var scaleContainer = document.getElementById("scale");
scaleContainer.appendChild(customScale.getContainer());