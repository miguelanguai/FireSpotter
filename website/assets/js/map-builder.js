// Creates a map
export const map = L.map('map', {
  zoomControl: false
});

export const countryMarker = L.layerGroup().addTo(map);

// Sets the limit of the map
const southWest = L.latLng(-85, -180);
const northEast = L.latLng(85, 180);
const bounds = L.latLngBounds(southWest, northEast);

// Adds a real map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  bounds,
  noWrap: true
}).addTo(map);

let currentLocationIsShown = false;
function showCurrentLocation() {
  if ("geolocation" in navigator && currentLocationIsShown == false) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Set a marker in the current location
      L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 15); // Set the view in the current location
      currentLocationIsShown = true;
    });
  } else if (currentLocationIsShown == true) {
    map.setView([40.41831, -3.70275], 6);
    currentLocationIsShown = false;
  }
  else {
    alert("Your navigator doesn't allow geolocation");
  };
};

// Create a custom red icon marker
export const redIcon = L.icon({
  iconUrl: "assets/img/fueguito.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Adds a event listener to the button
const getLocationButton = document.getElementById("getLocationButton");
getLocationButton.addEventListener("click", showCurrentLocation);

// Adds a scale to the map
const customScale = L.control.scale();
customScale.addTo(map);

// Gets the "scale" by it's ID and sets a controller
const scaleContainer = document.getElementById("scale");
scaleContainer.appendChild(customScale.getContainer());

/**
 * Takes in latitude, longitude, wind degrees, and fire propagation
 * and draws lines on the map to represent fire propagation and wind direction.
 */
export function drawLinesWithSecondaryLines(latitude, longitude, windDeg, firePropagation) {

  const iniValue = () => windDeg + 180;
  windDeg = iniValue();

  const startPoint = [latitude, longitude];
  const orientationRadians = (windDeg * Math.PI) / 180;

  // Calculates the dimension of the fire propagation
  const endLat =
    latitude + (firePropagation / 111320) * Math.cos(orientationRadians);

  const endLng =
    longitude + (firePropagation / (111320 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(orientationRadians);

  // Dawns the fire propagation into the map
  L.polyline([startPoint, [endLat, endLng]], { color: 'purple' }).addTo(countryMarker);

  // Draws 200 lines anti-horary way based on the wind degrees.
  let direction = 1;
  let count = 1;
  const inclinationDegrees = 0.45;
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'brown'];

  for (let i = 1; i <= 200; i++) {
    const lineColor = colors[Math.floor(count / 20)] || 'black';
    const windDegSide = windDeg + direction * count++ * inclinationDegrees;
    const orientationRadiansSide = (windDegSide * Math.PI) / 180;
    const endLatSide =
      latitude + (firePropagation / 111320) * Math.cos(orientationRadiansSide);
    const endLngSide =
      longitude + (firePropagation / (111320 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(orientationRadiansSide);
    const lineCoordinatesSide = [startPoint, [endLatSide, endLngSide]];
    L.polyline(lineCoordinatesSide, { color: lineColor, weight: 0.25 }).addTo(countryMarker);

    // Restart the loop counter to print lines in the other side.
    if (i === 100) {
      direction = -1;
      count = 1;
    };
  };
};

