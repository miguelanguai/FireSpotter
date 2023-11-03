import { 
  fetchFirmsData, 
  fetchOpenWeatherData, 
  propagationAlgorithm 
} from './wildfire-tracker.js';
import { redIcon, map, drawLinesWithSecondaryLines } from './map-builder.js';

(async () => {
  const rawCountries = await fetch('assets/js/countries.json');
  const countries = await rawCountries.json();

  const country = countries.find(country => country.name === "Spain");
  const abbreviation = country.abbreviation;

  if (country) {
    map.setView(country.coordinates, 5);

    let points;

    const storedPoints = getWithTTL("points");
    if (
      storedPoints &&
      storedPoints.abbreviation === abbreviation
    ) points = storedPoints
    else {
      points = await fetchFirmsData(abbreviation);
      setWithTTL("points", JSON.stringify({points, abbreviation}));
    };

    if (
      (points.hotSpots && points.hotSpots.length > 0) ||
      (points.fires && points.fires.length > 0)
    )
    {
      for (const type in points) {
        const pointsType = points[type];
  
        for (let i = 0; i < pointsType.length; i++) {
          const points = pointsType[i];
          
          for (let i = 0; i < points.length; i++) {
            const { abbreviation, latitude, longitude, hour, source, frp } = points[i];

            let weatherData;

            const key = `[${latitude},${longitude}]`;
            const storedWeatherData = getWithTTL(key);
            if (
              storedWeatherData &&
              storedWeatherData.abbreviation === abbreviation
            ) weatherData = storedWeatherData.weatherData;
            else {
              weatherData = await fetchOpenWeatherData(latitude, longitude);

              setWithTTL(key, JSON.stringify({ abbreviation, weatherData }));
            };

            const {
              windDeg,
              windSpeed,
              windGust,
              temp,
              humidity,
              nearbyCity
            } = weatherData;
  
            const firePropagation =
              propagationAlgorithm(temp, humidity, windDeg, windSpeed, hour);
            
            const toolTip = `
              <h4>${nearbyCity}</h4>
              <hr>
              <p>Source: ${source}</p>
              <p>Prediction: ${
                type
                .replace(/(?:^|\s)./g, match => match.toUpperCase())
                .replace(/([A-Z])/g, ' $1')
              }</p>
              <p><strong>Propagation: ${Math.round(firePropagation)} meters/hour</strong></p>
              <p>Radiative Power: ${frp}</p>
            `;
  
            L.marker([latitude, longitude], { icon: redIcon })
              .addTo(map)
              .bindTooltip(toolTip);
  
            drawLinesWithSecondaryLines(
              latitude, longitude, windDeg, firePropagation
            );
          }
        }
      }
    }
  };
})();

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
