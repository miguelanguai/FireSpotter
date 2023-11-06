import { pointsTracker } from './wildfire-tracker.js';
import { redIcon, map, countryMarker, drawLinesWithSecondaryLines } from './map-builder.js';

async function pointsPrinter(source, country) {
  const { abbreviation, name, coordinates } = country;

  countryMarker.clearLayers();

  map.setView(coordinates, 6);

  let trackedPoints;
  const key = `${name}, ${source}`;
  const storedPoints = getWithTTL(key);
  if (storedPoints) trackedPoints = storedPoints;
  else {
    trackedPoints = await pointsTracker(source, abbreviation);
    setWithTTL(key, JSON.stringify(trackedPoints));
  };

  for (const type in trackedPoints) {
    for (const points of trackedPoints[type]) {
      for (const point of points) {
        const {
          nearbyCity, frp, propagation, latitude, longitude, windDeg, windSpeed
        } = point;

        const isFire = type === 'fires';
  
        const toolTip =
          `<h4>${nearbyCity}</h4>` +
          "<hr>" +
          "<p>Prediction: " + type
            .replace(/(?:^|\s)./g, match => match.toUpperCase())
            .replace(/([A-Z])/g, ' $1').trim() + "</p>" +
          `<p>Source: ${source}</p>` +
          `<p>Radiative Power: ${frp}</p>`+
          (isFire ? "<p>Fire propagation: " +
          propagation.toFixed(2) + " meters</p>" : '') +
          `<p>latitude: ${latitude}</p>` +
          `<p>longitude: ${longitude}</p>` +
          `<p>Wind degrees: ${windDeg} degrees</p>` +
          `<p>Wind speed: ${windSpeed} meters/sec</p>` +
        '';
  
        const pointMarker = L.marker([latitude, longitude], { icon: redIcon })
          .bindTooltip(toolTip);

        countryMarker.addLayer(pointMarker);

        if (isFire) 
          drawLinesWithSecondaryLines(
            latitude, longitude, windDeg, propagation
          );
      }
    }
  };
};

function setWithTTL(key, content, ttl = 300) {
  const now = new Date();
  ttl *= 1000;

  const value = {
    content,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(value));
};

function getWithTTL(key) {
  let value = null;
  const rawValue = localStorage.getItem(key);

  if (rawValue) {
    const {content, expiry} = JSON.parse(rawValue);
    const now = new Date();
    
    if (expiry && now.getTime() > expiry) localStorage.removeItem(key);
    else value = JSON.parse(content);
  };
  
  return value;
};

async function main() {
  const rawCountries = await fetch('assets/js/countries.json');
  const countries = await rawCountries.json();
  
  const defaultCountry = "Spain";
  const country = (countryName) =>
    countries.find(country => country.name === countryName);

  const sources = [ "VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT", "MODIS_NRT" ];
  const defaultSource = sources[0];
  
  pointsPrinter(defaultSource, country(defaultCountry));

  const countrySelector = document.getElementById("countrySelector");
  countries.forEach(country => {
    // Creates an <option> HTML tag
    const option = document.createElement("option");

    const name = country.name;
    option.value = name;
    option.text = name;

    // Sets a default value
    if (name === defaultCountry) option.selected = true;

    // Adds <option> to the <select> HTML tag
    countrySelector.appendChild(option);
  });

  const sourceSelector = document.getElementById("sourceSelector");
  sources.forEach(source => {
    // Creates an <option> HTML tag
    const option = document.createElement("option");

    option.value = source;
    option.text = source;

    // Sets a default value
    if (source === defaultSource) option.selected = true;

    // Adds <option> to the <select> HTML tag
    sourceSelector.appendChild(option);
  });

  function printBySelection() {
    const selectedCountry =
      countrySelector.options[countrySelector.selectedIndex].value;

    const selectedSource =
      sourceSelector.options[sourceSelector.selectedIndex].value;
  
    pointsPrinter(selectedSource, country(selectedCountry));
  };

  countrySelector.addEventListener("change", printBySelection);
  sourceSelector.addEventListener("change", printBySelection);
};
main();
