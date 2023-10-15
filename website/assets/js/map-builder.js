// Crear un mapa
export const map = L.map('map', {
  zoomControl: false
}).setView([40.41831, -3.70275], 6);

// Definir límites del mapa
const southWest = L.latLng(-85, -180);
const northEast = L.latLng(85, 180);
const bounds = L.latLngBounds(southWest, northEast);

// Agregar una capa de mapa físico
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  bounds,
  noWrap: true
}).addTo(map);

let currentLocationIsShown = false;
function showCurrentLocation() {
  if ("geolocation" in navigator && currentLocationIsShown == false) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitudee;
      const lng = position.coords.longitudee;

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
export const redIcon = L.icon({
  iconUrl: "assets/img/fueguito.png",
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

// Función para dibujar líneas desde el marcador rojo
export function drawLinesWithSecondaryLines(latitude, longitude, windDeg, firePropagation) {

  const iniValue = () => windDeg + 180;
  windDeg = iniValue();

  const startPoint = [latitude, longitude];
  const orientationRadians = (windDeg * Math.PI) / 180;

  // Calcular las coordenadas finales de la línea principal
  const endLat =
    latitude + (firePropagation / 111320) * Math.cos(orientationRadians);

  const endLng =
    longitude + (firePropagation / (111320 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(orientationRadians);

  // Crear un arreglo con las coordenadas de inicio y fin de la línea principal
  const lineCoordinates = [startPoint, [endLat, endLng]];

  // Dibujar la línea principal en el mapa
  L.polyline(lineCoordinates, { color: 'purple' }).addTo(map);

  // Draws 200 lines anti-horary way based on the wind degrees.
  let direction = 1;
  let count = 1;
  const inclinationDegrees = 0.45;

  for (let i = 1; i <= 200; i++) {
    const lineColor = getColorForLine(count);
    const windDegSide = windDeg + direction * count++ * inclinationDegrees;
    const orientationRadiansSide = (windDegSide * Math.PI) / 180;
    const endLatSide =
      latitude + (firePropagation / 111320) * Math.cos(orientationRadiansSide);
    const endLngSide =
      longitude + (firePropagation / (111320 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(orientationRadiansSide);
    const lineCoordinatesSide = [startPoint, [endLatSide, endLngSide]];
    L.polyline(lineCoordinatesSide, { color: lineColor, weight: 0.25 }).addTo(map);

    // Restart the loop counter to print lines in the other side.
    if (i === 100) {
      direction = -1;
      count = 1;
    };
  };
};

/**
 * Returns a color based on the index provided, with a default color of black.
 * @param index - Position of a line in a list or array.
 */
function getColorForLine(index) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'brown'];
  return colors[Math.floor(index / 20)] || 'black';
}
