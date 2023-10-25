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

      const storedPoints = sessionStorage.getItem("points");
      if (storedPoints === null) {
        points = await fetchFirmsData(country.abbreviation);
        sessionStorage.setItem("points", JSON.stringify(points));
      }
      else points = JSON.parse(storedPoints);
  
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
              const { latitude, longitude, hour, source, } = points[i];
              
              let weatherData;

              const key = `[${latitude},${longitude}]`;
              const storedWeatherData = sessionStorage.getItem(key);
              if (storedWeatherData === null) {
                weatherData = await fetchOpenWeatherData(latitude, longitude);
                sessionStorage.setItem(key, JSON.stringify(weatherData));
              }
              else weatherData = JSON.parse(storedWeatherData);

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
  catch (error) {console.error('Error:', error);}
})();
