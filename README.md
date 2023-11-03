# FireSpotter

https://firms.modaps.eosdis.nasa.gov/descriptions/FIRMS_MODIS_Firehotspots.html

https://miguelanguai.github.io/FireSpotter/

Certainly, here's the entire text converted to Markdown format along with the corresponding Markdown code:


# PREDICTIVE FIRE PATH ALGORITHM

## Algorithm Structure


$Fire_prop = WindSpeed * 3600 * k_Terr * k_Fuel * k_Fc * k_Temp * k_Hum$

### kFuel

$k_Fuel:$ This is the name given to the value of the constant that gives us the propagation percentage.


This algorithm has been conceived based on parameters dependent on fire propagation, such as:

- **Campbell Fire Curve**: Predictive chart of fire evolution based on time.

For this reason, a data table was created to simulate this behavior. This table is determined by the following values, depending on the time.

By interpolating these values on a scale of [1-2], the following graph is derived:

### kFc (Fire Cone Constant)

$k_Fc$: The name assigned to the fire cone constant. This value, in turn, depends on an independent formula developed by the FireSpotter team and is determined by the wind's angle of incidence.

**Explanation**: When the wind impacts the wind rose, it has a direction and a sense since it is a vector quantity, which we have considered two-dimensional in our predictive model.

The values of the Campbell Fire Curve simulate the behavior of the fuel based on sun exposure. Therefore, the 45º point has been established, as it is directly related to the midpoint of 2 cardinal points as a multiplier of 0.5, and as the wind impacts, this factor will increase as it reaches 90º (Cardinal Point 1) or 0º (Cardinal Point 2). Thus, it is sought to include any type of angle between [0-90].

Next, an example is presented:

- Deg = 150º [NW Direction]

![image](https://github.com/miguelanguai/FireSpotter/assets/147279879/ad18cc96-c357-4b6e-866a-c4423c7f73c1)

If Deg - deflection is between 45º and 90º:

$k_Fc' = (((Deg-deflection) - 45) * 0.01111 + 0.5)$

In the case that Deg-deflection is between 0º and 45º:

$k_Fc' = 1 - (((Deg-deflection) - 45) * 0.01111 + 0.5)$


Where 0.01111 is the conversion constant from 45º to 0.5 and from 90º and 0º to 1.

Once $k_Fc'$ is obtained, we proceed to calculate k_Fc:

$k_Fc = k_Fc' * k_Fuel$

### kTemp

k_Temp: Value of the constant dependent on temperature, with the formula:

$k_Temp = ((temp - temp_min) / (temp_max - temp_min))$

Where:

- $temp_min$: The minimum temperature of the day.
- $temp_max$: The maximum temperature of the day.

### kTerr

$k_Terr:$ Constant of terrain propagation. Due to a lack of information, it has been considered that k_Terr= 0 for water and $k_Terr$= 1 for mountains. Therefore, a value equal to 50% of conductivity has been obtained, with $k_Terr= 0.5$.

### kHum

k_Hum: Name given to the constant dependent on humidity, which responds to the following formula.

$k_Hum = ((100 - Hum) / 100)$


Where:

- Hum: Humidity measured as a percentage.

### WindSpeed

WindSpeed: Wind speed in m/s. This is why it is multiplied by 3600 to obtain the value in m/h.

# OTHER FIRMS FEATURES

## Data

We have been using the FIRMS API, which provides us with some data, including:
  - FRP (Fire Radiative Power), which helps us distinguish between hot spots and actual fires, as sometimes the app may identify false alarms.

**VIIRS (Visible Infrared Imaging Radiometer Suite):**

- VIIRS is an instrument on board the Suomi National Polar-orbiting Partnership (Suomi NPP) satellite, as well as subsequent satellites in the Joint Polar Satellite System (JPSS) program.
- It measures a wide range of environmental variables, including cloud cover, sea surface temperature, vegetation health, and more, by observing the Earth in a variety of spectral bands.
- VIIRS provides high-quality, high-resolution imagery and data, making it valuable for climate monitoring, weather forecasting, and environmental research.

**MODIS (Moderate Resolution Imaging Spectroradiometer):**

- MODIS is an instrument on board NASA's Terra and Aqua satellites, which are part of the Earth Observing System (EOS) program.
- It provides observations in multiple spectral bands and at various spatial resolutions, allowing it to monitor a wide array of Earth's processes and phenomena.
- MODIS data is widely used in remote sensing and Earth science research, contributing to studies related to land cover, ocean properties, atmospheric composition, and more.
- MODIS has been a key tool in monitoring changes in the Earth's climate and environment over time.

These two technologies are the ones that NASA uses to detect thermal anomalies.

# FUTURE FOLLOWING PATH 

## LiDAR TECHNOLOGY

In a future scenario, FireSpotter is planned to use LIDAR sensor data to generate a 3D map of hazardous areas. To achieve this, it will use coordinates provided by the FIRMS API, along with LIDAR data, to create a cartographic map of the fire's point of origin, as the DEMO shown below:

![image](https://github.com/miguelanguai/FireSpotter/assets/147279879/8e7df625-6b71-4cd9-8de8-df2e02db1276)

Then it will place the fire as depicted in the following image:

![image](https://github.com/miguelanguai/FireSpotter/assets/147279879/75613040-1dd4-4034-ab32-260e5e650871)


Finally, it will generate a 3D fire cone to visualize the actual area it could affect.
![image](https://github.com/miguelanguai/FireSpotter/assets/147279879/893a6d49-7500-4274-8584-6a9d39d9928e)


With this feature, hopefully we could add the third dimension to our algorithm.
