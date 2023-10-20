import { 
  formatFirmsData, 
  fetchOpenWeatherData, 
  propagationAlgorithm 
} from './wildfire-tracker.js';
import { redIcon, map, drawLinesWithSecondaryLines } from './map-builder.js';

const points = await formatFirmsData();

for (const type in points) {
  const pointsType = points[type];

  for (let i = 0; i < pointsType.length; i++) {
    const points = pointsType[i];
    
    for (let i = 0; i < points.length; i++) {
      const { latitud, longitud, hour, satellite } = points[i];
      
      const {
        windDeg, 
        windSpeed, 
        windGust, 
        temp, 
        humidity, 
        nearbyCity 
      } = await fetchOpenWeatherData(latitud, longitud);

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
        <p>Latitude: ${latitud}</p>
        <p>Longitude: ${longitud}</p>
        <p>Wind degrees: ${windDeg} grados</p>
        <p>Wind speed: ${windSpeed} meters/sec</p>
        <p>Fire propagation: ${Math.round(firePropagation)} meters</p>
      `;

      L.marker([latitud, longitud], { icon: redIcon })
        .addTo(map)
        .bindTooltip(toolTip);

      // Dibujar líneas desde el marcador rojo
      drawLinesWithSecondaryLines(latitud, longitud, windDeg, firePropagation);
    }
  };
};
