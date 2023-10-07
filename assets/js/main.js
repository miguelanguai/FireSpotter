// Crear un mapa
var map = L.map('map').setView([40.41831, -3.70275], 6);


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
    [39.692678, -0.468424],
    [39.702761, -0.479010],
    [39.723044, -0.455240]
];

// Función para agregar marcadores rojos en las coordenadas especificadas
function addRedMarkers() {
    for (var i = 0; i < redPoints.length; i++) {
        var redMarker = L.marker(redPoints[i], { icon: redIcon }).addTo(map);
    }
}

//Funcion para añadir las lineas a los marcadores con la orientacion que se nos de (45º hacia cada lado)
function addRedMarkersWithLines(orientationDegrees, lengthInMeters) {
    for (var i = 0; i < redPoints.length; i++) {
        var redMarker = L.marker(redPoints[i], { icon: redIcon }).addTo(map);

        // Dibujar una línea desde el marcador rojo
        drawLines(redPoints[i], orientationDegrees, lengthInMeters);
    }
}
function drawLines(startPoint, orientationDegrees, lengthInMeters) {
    // Convertir la orientación de grados a radianes
    var orientationRadians = (orientationDegrees * Math.PI) / 180;

    // Calcular las coordenadas finales de la línea
    var endLat = startPoint[0] + (lengthInMeters / 111320) * Math.cos(orientationRadians);
    var endLng = startPoint[1] + (lengthInMeters / (111320 * Math.cos(startPoint[0] * (Math.PI / 180)))) * Math.sin(orientationRadians);

    // Crear un arreglo con las coordenadas de inicio y fin
    var lineCoordinates = [startPoint, [endLat, endLng]];

    // Dibujar la línea principal en el mapa (orientación original)
    var line = L.polyline(lineCoordinates, { color: 'purple' }).addTo(map);

    // Dibujar una línea 45 grados menor
    var orientationDegreesSideA = orientationDegrees - 45;
    var orientationRadiansSideA = (orientationDegreesSideA * Math.PI) / 180;
    var endLatSideA = startPoint[0] + (lengthInMeters / 111320) * Math.cos(orientationRadiansSideA);
    var endLngSideA = startPoint[1] + (lengthInMeters / (111320 * Math.cos(startPoint[0] * (Math.PI / 180)))) * Math.sin(orientationRadiansSideA);
    var lineCoordinatesSideA = [startPoint, [endLatSideA, endLngSideA]];
    var lineSideA = L.polyline(lineCoordinatesSideA, { color: 'black' }).addTo(map);

    // Dibujar una línea 45 grados mayor
    var orientationDegreesSideB = orientationDegrees + 45;
    var orientationRadiansSideB = (orientationDegreesSideB * Math.PI) / 180;
    var endLatSideB = startPoint[0] + (lengthInMeters / 111320) * Math.cos(orientationRadiansSideB);
    var endLngSideB = startPoint[1] + (lengthInMeters / (111320 * Math.cos(startPoint[0] * (Math.PI / 180)))) * Math.sin(orientationRadiansSideB);
    var lineCoordinatesSideB = [startPoint, [endLatSideB, endLngSideB]];
    var lineSideB = L.polyline(lineCoordinatesSideB, { color: 'black' }).addTo(map);


    //9 lineas hacia grados MAYORES
    //hacer bucle limite 10

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