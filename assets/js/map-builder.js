import { getData } from './wildfire-tracker.js';

// Crear un mapa
const map = L.map('map', {
  zoomControl: false
}).setView([40.41831, -3.70275], 6);

// Agregar una capa de mapa físico
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let currentLocationIsShown = false;
function showCurrentLocation() {
  if ("geolocation" in navigator && currentLocationIsShown == false) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Crear un marcador en la ubicación actual
      L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 15); // Centrar el mapa en la ubicación actual
      currentLocationIsShown = true;
    });
  } else if (currentLocationIsShown == true) {
    map.setView([40.41831, -3.70275], 6);
    currentLocationIsShown = false;
  }
  else {
    alert("Tu navegador no admite la geolocalización.");
  }
};

// Crear un icono rojo personalizado para los marcadores
const redIcon = L.icon({
  iconUrl: 'assets/img/fueguito.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Agregar un controlador de eventos al botón
const getLocationButton = document.getElementById("getLocationButton");
getLocationButton.addEventListener("click", showCurrentLocation);

// Añadir escala al mapa
const customScale = L.control.scale();
customScale.addTo(map);

// Obtener el contenedor "scale" por su ID y agregar el control de escala
const scaleContainer = document.getElementById("scale");
scaleContainer.appendChild(customScale.getContainer());

// Función para añadir los marcadores rojos con líneas
async function addFireMarkersAndLines() {
  const data = await getData();

  for (let i = 0; i < data.length; i++) {
    const { latitud, longitud, windDeg, firePropagation, nearbyCity } = data[i];

    const toolTip = `
      <h4>${nearbyCity}</h4>
      <hr>
      <p>Latitud: ${latitud}</p>
      <p>Longitud: ${longitud}</p>
      <p>Ángulo del viento: ${windDeg} grados</p>
      <p>Propagacion del fuego: ${Math.round(firePropagation)} metros</p>
    `;

    L.marker([latitud, longitud], { icon: redIcon })
      .addTo(map)
      .bindTooltip(toolTip);

    // Dibujar líneas desde el marcador rojo
    drawLinesWithSecondaryLines(latitud, longitud, windDeg, firePropagation);
  }
}

// Función para dibujar líneas desde el marcador rojo
function drawLinesWithSecondaryLines(latitud, longitud, windDeg, firePropagation) {

  const iniValue = () => windDeg + 180;
  windDeg = iniValue();

  const startPoint = [latitud, longitud];
  const orientationRadians = (windDeg * Math.PI) / 180;

  // Calcular las coordenadas finales de la línea principal
  const endLat =
    latitud + (firePropagation / 111320) * Math.cos(orientationRadians);

  const endLng =
    longitud + (firePropagation / (111320 * Math.cos(latitud * (Math.PI / 180)))) * Math.sin(orientationRadians);

  // Crear un arreglo con las coordenadas de inicio y fin de la línea principal
  const lineCoordinates = [startPoint, [endLat, endLng]];

  // Dibujar la línea principal en el mapa
  L.polyline(lineCoordinates, { color: 'purple' }).addTo(map);

  // Grado de inclinación
  const inclinationDegree = 0.45;

  // Dibujar 100 líneas hacia grados MAYORES (anti-horario)
  for (let i = 1; i <= 100; i++) {
    const lineColor = getColorForLine(i);
    const windDegSideA = windDeg + (i * inclinationDegree);
    const orientationRadiansSideA = (windDegSideA * Math.PI) / 180;
    const endLatSideA =
      latitud + (firePropagation / 111320) * Math.cos(orientationRadiansSideA);
    const endLngSideA =
      longitud + (firePropagation / (111320 * Math.cos(latitud * (Math.PI / 180)))) * Math.sin(orientationRadiansSideA);
    const lineCoordinatesSideA = [startPoint, [endLatSideA, endLngSideA]];
    L.polyline(lineCoordinatesSideA, { color: lineColor, weight: 0.25 }).addTo(map);
  }

  // Dibujar 10 líneas hacia grados MENORES (anti-horario)
  for (let j = 1; j <= 100; j++) {
    const lineColor = getColorForLine(j);
    const windDegSideB = windDeg - (j * inclinationDegree);
    const orientationRadiansSideB = (windDegSideB * Math.PI) / 180;
    const endLatSideB =
      latitud + (firePropagation / 111320) * Math.cos(orientationRadiansSideB);
    const endLngSideB =
      longitud + (firePropagation / (111320 * Math.cos(latitud * (Math.PI / 180)))) * Math.sin(orientationRadiansSideB);
    const lineCoordinatesSideB = [startPoint, [endLatSideB, endLngSideB]];
    L.polyline(lineCoordinatesSideB, { color: lineColor, weight: 0.25 }).addTo(map);
  }
}

// Función para obtener el color de la línea según el índice
function getColorForLine(index) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'brown'];
  return colors[Math.floor(index / 20)] || 'black';
}

addFireMarkersAndLines();
