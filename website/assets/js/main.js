import { 
  fetchFirmsData, 
  fetchOpenWeatherData, 
  propagationAlgorithm 
} from './wildfire-tracker.js';
import { redIcon, map, drawLinesWithSecondaryLines } from './map-builder.js';

(async () => {
  try {
    const rawCountries = await fetch('assets/js/countries.json');
    const countries = await rawCountries.json();

    const country = countries.find(country => country.name === "Spain");

    if (country !== undefined) {
      map.setView(country.coordinates, 5);

      let points;

      const localPoints = localStorage.getItem("points");
      if (localPoints === null) {
        points = await fetchFirmsData(country.abbreviation);
        localStorage.setItem("points", JSON.stringify(points));
      }
      else points = JSON.parse(localPoints);
  
      if (
        (points.hotSpots !== undefined && points.hotSpots.length > 0) ||
        (points.fires !== undefined && points.fires.length > 0)
      )
      {
        for (const type in points) {
          const pointsType = points[type];
    
          for (let i = 0; i < pointsType.length; i++) {
            const points = pointsType[i];
            
            for (let i = 0; i < points.length; i++) {
              const { latitude, longitude, hour, source, frp } = points[i];
              
              let weatherData;

              const key = `[${latitude},${longitude}]`;
              const localWeatherData = localStorage.getItem(key);
              if (localWeatherData === null) {
                weatherData = await fetchOpenWeatherData(latitude, longitude);
                localStorage.setItem(key, JSON.stringify(weatherData));
              }
              else weatherData = JSON.parse(localWeatherData);

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
                <p>Prediction: ${
                  type
                    .replace(/(?:^|\s)./g, match => match.toUpperCase())
                    .replace(/([A-Z])/g, ' $1').trim()
                }</p>
                <p>Source: ${source}</p>
                <p>Fire Radiative Power: ${frp}</p>
                <p>Fire propagation: ${Math.round(firePropagation)} meters</p>
                <p>latitude: ${latitude}</p>
                <p>longitude: ${longitude}</p>
                <p>Wind degrees: ${windDeg} degrees</p>
                <p>Wind speed: ${windSpeed} meters/sec</p>
              `;
    
              L.marker([latitude, longitude], { icon: redIcon })
                .addTo(map)
                .bindTooltip(toolTip);
    
              drawLinesWithSecondaryLines(latitude, longitude, windDeg, firePropagation);
            }
          }
        }
      }
    };
  } 
  catch (error) {
    console.error('Error:', error);
  }
})();
