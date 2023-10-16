import { 
  formatFirmsData, 
  fetchOpenWeatherData, 
  propagationAlgorithm 
} from './wildfire-tracker.js';
import { redIcon, map, drawLinesWithSecondaryLines } from './map-builder.js';

(async () => {
  try {
    const points = await formatFirmsData();

    for (const type in points) {
      const pointsType = points[type];

      for (let i = 0; i < pointsType.length; i++) {
        const points = pointsType[i];
        
        for (let i = 0; i < points.length; i++) {
          const { latitude, longitude, hour, satellite } = points[i];
          
          const {
            windDeg, 
            windSpeed, 
            windGust, 
            temp, 
            humidity, 
            nearbyCity 
          } = await fetchOpenWeatherData(latitude, longitude);

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
            <p>Satellite: ${satellite}</p>
            <p>latitude: ${latitude}</p>
            <p>longitude: ${longitude}</p>
            <p>Wind degrees: ${windDeg} degrees</p>
            <p>Wind speed: ${windSpeed} meters/sec</p>
            <p>Fire propagation: ${Math.round(firePropagation)} meters</p>
          `;

          L.marker([latitude, longitude], { icon: redIcon })
            .addTo(map)
            .bindTooltip(toolTip);

          drawLinesWithSecondaryLines(latitude, longitude, windDeg, firePropagation);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
