import { 
  fetchFirmsData, 
  fetchOpenWeatherData, 
  propagationAlgorithm 
} from './wildfire-tracker.js';
import { redIcon, map, drawLinesWithSecondaryLines } from './map-builder.js';

const countries = [
  {
    abbreviation: "ABW",
    name: "Aruba",
    coordinates: [12.5211, -69.9683]
  },
  {
    abbreviation: "AFG",
    name: "Afghanistan",
    coordinates: [33.9391, 67.7099]
  },
  {
    abbreviation: "AGO",
    name: "Angola",
    coordinates: [-11.2027, 17.8739]
  },
  {
    abbreviation: "AIA",
    name: "Anguilla",
    coordinates: [18.2206, -63.0686]
  },
  {
    abbreviation: "ALA",
    name: "Aland Islands",
    coordinates: [60.1785, 19.9156]
  },
  {
    abbreviation: "ALB",
    name: "Albania",
    coordinates: [41.1533, 20.1683]
  },
  {
    abbreviation: "AND",
    name: "Andorra",
    coordinates: [42.5462, 1.6016]
  },
  {
    abbreviation: "ARE",
    name: "United Arab Emirates",
    coordinates: [23.4241, 53.8478]
  },
  {
    abbreviation: "ARG",
    name: "Argentina",
    coordinates: [-38.4161, -63.6167]
  },
  {
    abbreviation: "ARM",
    name: "Armenia",
    coordinates: [40.0691, 45.0382]
  },
  {
    abbreviation: "ASM",
    name: "American Samoa",
    coordinates: [-14.2717, -170.1322]
  },
  {
    abbreviation: "ATA",
    name: "Antarctica",
    coordinates: [] // Las coordenadas varían ampliamente.
  },
  {
    abbreviation: "ATF",
    name: "French Southern and Antarctic Lands",
    coordinates: [] // Las coordenadas varían ampliamente.
  },
  {
    abbreviation: "ATG",
    name: "Antigua and Barbuda",
    coordinates: [17.0608, -61.7964]
  },
  {
    abbreviation: "AUS",
    name: "Australia",
    coordinates: [-25.2744, 133.7751]
  },
  {
    abbreviation: "AUT",
    name: "Austria",
    coordinates: [47.5162, 14.5501]
  },
  {
    abbreviation: "AZE",
    name: "Azerbaijan",
    coordinates: [40.1431, 47.5769]
  },
  {
    abbreviation: "BDI",
    name: "Burundi",
    coordinates: [-3.3731, 29.9189]
  },
  {
    abbreviation: "BEL",
    name: "Belgium",
    coordinates: [50.8503, 4.3517]
  },
  {
    abbreviation: "BEN",
    name: "Benin",
    coordinates: [9.3077, 2.3158]
  },
  {
      abbreviation: "BFA",
      name: "Burkina Faso",
      coordinates: [12.2383, -1.5616]
    },
    {
      abbreviation: "BGD",
      name: "Bangladesh",
      coordinates: [23.6850, 90.3563]
    },
    {
      abbreviation: "BGR",
      name: "Bulgaria",
      coordinates: [42.7339, 25.4858]
    },
    {
      abbreviation: "BHR",
      name: "Bahrain",
      coordinates: [26.0667, 50.5577]
    },
    {
      abbreviation: "BHS",
      name: "Bahamas",
      coordinates: [25.0343, -77.3963]
    },
    {
      abbreviation: "BIH",
      name: "Bosnia and Herzegovina",
      coordinates: [43.9159, 17.6791]
    },
    {
      abbreviation: "BLM",
      name: "Saint-Barthelemy",
      coordinates: [17.8962, -62.8523]
    },
    {
      abbreviation: "BLR",
      name: "Belarus",
      coordinates: [53.7098, 27.9534]
    },
    {
      abbreviation: "BLZ",
      name: "Belize",
      coordinates: [17.1899, -88.4976]
    },
    {
      abbreviation: "BMU",
      name: "Bermuda",
      coordinates: [32.3078, -64.7505]
    },
    {
      abbreviation: "BOL",
      name: "Bolivia",
      coordinates: [-16.2902, -63.5887]
    },
    {
      abbreviation: "BRA",
      name: "Brazil",
      coordinates: [-14.2350, -51.9253]
    },
    {
      abbreviation: "BRB",
      name: "Barbados",
      coordinates: [13.1939, -59.5432]
    },
    {
      abbreviation: "BRN",
      name: "Brunei Darussalam",
      coordinates: [4.5353, 114.7277]
    },
    {
      abbreviation: "BTN",
      name: "Bhutan",
      coordinates: [27.5142, 90.4336]
    },
    {
      abbreviation: "BWA",
      name: "Botswana",
      coordinates: [-22.3285, 24.6849]
    },
    {
      abbreviation: "CAF",
      name: "Central African Republic",
      coordinates: [6.6111, 20.9394]
    },
    {
      abbreviation: "CAN",
      name: "Canada",
      coordinates: [56.1304, -106.3468]
    },
    {
      abbreviation: "CHE",
      name: "Switzerland",
      coordinates: [46.8182, 8.2275]
    },
    {
      abbreviation: "CHL",
      name: "Chile",
      coordinates: [-35.6751, -71.5430]
    },
    {
      abbreviation: "CHN",
      name: "China",
      coordinates: [35.8617, 104.1954]
    },{
      abbreviation: "CIV",
      name: "Cote d'Ivoire",
      coordinates: [7.5399, -5.5471]
    },
    {
      abbreviation: "CMR",
      name: "Cameroon",
      coordinates: [5.9641, 12.6530]
    },
    {
      abbreviation: "COD",
      name: "Democratic Republic of the Congo",
      coordinates: [-4.0383, 21.7587]
    },
    {
      abbreviation: "COG",
      name: "Republic of Congo",
      coordinates: [-0.2280, 15.8277]
    },
    {
      abbreviation: "COK",
      name: "Cook Islands",
      coordinates: [-21.2367, -159.7777]
    },
    {
      abbreviation: "COL",
      name: "Colombia",
      coordinates: [4.5709, -74.2973]
    },
    {
      abbreviation: "COM",
      name: "Comoros",
      coordinates: [-11.6455, 43.3337]
    },
    {
      abbreviation: "CPV",
      name: "Cape Verde",
      coordinates: [15.1201, -23.6054]
    },
    {
      abbreviation: "CRI",
      name: "Costa Rica",
      coordinates: [9.7489, -83.7534]
    },
    {
      abbreviation: "CUB",
      name: "Cuba",
      coordinates: [21.5218, -77.7812]
    },
    {
      abbreviation: "CUW",
      name: "Curacao",
      coordinates: [12.1696, -68.9900]
    },
    {
      abbreviation: "CYM",
      name: "Cayman Islands",
      coordinates: [19.3133, -81.2546]
    },
    {
      abbreviation: "CYP",
      name: "Cyprus",
      coordinates: [35.1264, 33.4299]
    },
    {
      abbreviation: "CZE",
      name: "Czech Republic",
      coordinates: [49.8175, 15.4724]
    },
    {
      abbreviation: "DEU",
      name: "Germany",
      coordinates: [51.1657, 10.4515]
    },
    {
      abbreviation: "DJI",
      name: "Djibouti",
      coordinates: [11.8251, 42.5903]
    },
    {
      abbreviation: "DMA",
      name: "Dominica",
      coordinates: [15.4141, -61.3709]
    },
    {
      abbreviation: "DNK",
      name: "Denmark",
      coordinates: [56.2639, 9.5018]
    },
    {
      abbreviation: "DOM",
      name: "Dominican Republic",
      coordinates: [18.7357, -70.1627]
    },
    {
      abbreviation: "DZA",
      name: "Algeria",
      coordinates: [28.0339, 1.6596]
    },
    {
      abbreviation: "ECU",
      name: "Ecuador",
      coordinates: [-1.8312, -78.1834]
    },
    {
      abbreviation: "EGY",
      name: "Egypt",
      coordinates: [26.8206, 30.8025]
    },
    {
      abbreviation: "ERI",
      name: "Eritrea",
      coordinates: [15.1794, 39.7823]
    },
    {
      abbreviation: "ESP",
      name: "Spain",
      coordinates: [40.4637, -3.7492]
    }, {
      abbreviation: "EST",
      name: "Estonia",
      coordinates: [58.5953, 25.0136]
    },
    {
      abbreviation: "ETH",
      name: "Ethiopia",
      coordinates: [9.1450, 40.489673]
    },
    {
      abbreviation: "FIN",
      name: "Finland",
      coordinates: [61.9241, 25.7482]
    },
    {
      abbreviation: "FJI",
      name: "Fiji",
      coordinates: [-17.7134, 178.0650]
    },
    {
      abbreviation: "FLK",
      name: "Falkland Islands",
      coordinates: [-51.7963, -59.5236]
    },
    {
      abbreviation: "FRA",
      name: "France",
      coordinates: [46.6034, 1.8883]
    },
    {
      abbreviation: "FRO",
      name: "Faeroe Islands",
      coordinates: [61.8926, -6.9118]
    },
    {
      abbreviation: "FSM",
      name: "Federated States of Micronesia",
      coordinates: [7.4256, 150.5508]
    },
    {
      abbreviation: "GAB",
      name: "Gabon",
      coordinates: [-0.8037, 11.6094]
    },
    {
      abbreviation: "GBR",
      name: "United Kingdom",
      coordinates: [55.3781, -3.4360]
    },
    {
      abbreviation: "GEO",
      name: "Georgia",
      coordinates: [42.3154, 43.3569]
    },
    {
      abbreviation: "GGY",
      name: "Guernsey",
      coordinates: [49.4657, -2.5853]
    },
    {
      abbreviation: "GHA",
      name: "Ghana",
      coordinates: [7.2505, -0.2637]
    },
    {
      abbreviation: "GIB",
      name: "Gibraltar",
      coordinates: [36.1377, -5.3453]
    },
    {
      abbreviation: "GIN",
      name: "Guinea",
      coordinates: [9.9456, -9.6966]
    },
    {
      abbreviation: "GLP",
      name: "Guadeloupe",
      coordinates: [16.2650, -61.5509]
    },
    {
      abbreviation: "GMB",
      name: "The Gambia",
      coordinates: [13.4432, -15.3101]
    },
    {
      abbreviation: "GNB",
      name: "Guinea-Bissau",
      coordinates: [11.8037, -15.1804]
    },
    {
      abbreviation: "GNQ",
      name: "Equatorial Guinea",
      coordinates: [1.6508, 10.2679]
    },
    {
      abbreviation: "GRC",
      name: "Greece",
      coordinates: [39.0742, 21.8243]
    },
    {
      abbreviation: "GRD",
      name: "Grenada",
      coordinates: [12.1165, -61.6790]
    },
    {
      abbreviation: "GRL",
      name: "Greenland",
      coordinates: [71.7069, -42.6043]
    },
    {
      abbreviation: "GTM",
      name: "Guatemala",
      coordinates: [15.7835, -90.2308]
    },
    {
      abbreviation: "GUF",
      name: "French Guiana",
      coordinates: [3.9339, -53.1258]
    },
    {
      abbreviation: "GUM",
      name: "Guam",
      coordinates: [13.4443, 144.7937]
    },
    {
      abbreviation: "GUY",
      name: "Guyana",
      coordinates: [4.8604, -58.9302]
    },
    {
      abbreviation: "HKG",
      name: "Hong Kong",
      coordinates: [22.3964, 114.1095]
    },
    {
      abbreviation: "HMD",
      name: "Heard I. and McDonald Islands",
      coordinates: [-53.0818, 73.5133]
    },
    {
      abbreviation: "HND",
      name: "Honduras",
      coordinates: [15.1990, -86.2419]
    },
    {
      abbreviation: "HRV",
      name: "Croatia",
      coordinates: [45.1000, 15.2000]
    }, {
      abbreviation: "HTI",
      name: "Haiti",
      coordinates: [18.9712, -72.2852]
    },
    {
      abbreviation: "HUN",
      name: "Hungary",
      coordinates: [47.1625, 19.5033]
    },
    {
      abbreviation: "IDN",
      name: "Indonesia",
      coordinates: [-0.7893, 113.9213]
    },
    {
      abbreviation: "IMN",
      name: "Isle of Man",
      coordinates: [54.2361, -4.5481]
    },
    {
      abbreviation: "IND",
      name: "India",
      coordinates: [20.5937, 78.9629]
    },
    {
      abbreviation: "IOT",
      name: "British Indian Ocean Territory",
      coordinates: [-7.3343, 72.4246]
    },
    {
      abbreviation: "IRL",
      name: "Ireland",
      coordinates: [53.4129, -8.2439]
    },
    {
      abbreviation: "IRN",
      name: "Iran",
      coordinates: [32.4279, 53.6880]
    },
    {
      abbreviation: "IRQ",
      name: "Iraq",
      coordinates: [33.2232, 43.6793]
    },
    {
      abbreviation: "ISL",
      name: "Iceland",
      coordinates: [64.9631, -19.0208]
    },
    {
      abbreviation: "ISR",
      name: "Israel",
      coordinates: [31.0461, 34.8516]
    },
    {
      abbreviation: "ITA",
      name: "Italy",
      coordinates: [41.8719, 12.5674]
    },
    {
      abbreviation: "JAM",
      name: "Jamaica",
      coordinates: [18.1096, -77.2975]
    },
    {
      abbreviation: "JEY",
      name: "Jersey",
      coordinates: [49.2144, -2.1313]
    },
    {
      abbreviation: "JOR",
      name: "Jordan",
      coordinates: [30.5852, 36.2384]
    },
    {
      abbreviation: "JPN",
      name: "Japan",
      coordinates: [36.2048, 138.2529]
    },
    {
      abbreviation: "KAZ",
      name: "Kazakhstan",
      coordinates: [48.0196, 66.9237]
    },
    {
      abbreviation: "KEN",
      name: "Kenya",
      coordinates: [-1.2921, 36.8219]
    },
    {
      abbreviation: "KGZ",
      name: "Kyrgyzstan",
      coordinates: [41.2044, 74.7661]
    },
    {
      abbreviation: "KHM",
      name: "Cambodia",
      coordinates: [12.5657, 104.9909]
    },
    {
      abbreviation: "KIR",
      name: "Kiribati",
      coordinates: [1.8707, -157.3630]
    },
    {
      abbreviation: "KNA",
      name: "Saint Kitts and Nevis",
      coordinates: [17.3578, -62.7829]
    },
    {
      abbreviation: "KOR",
      name: "Republic of Korea",
      coordinates: [35.9078, 127.7669]
    },
    {
      abbreviation: "KOS",
      name: "Kosovo",
      coordinates: [42.6026, 20.9026]
    },
    {
      abbreviation: "KWT",
      name: "Kuwait",
      coordinates: [29.3759, 47.9774]
    },
    {
      abbreviation: "LAO",
      name: "Lao PDR",
      coordinates: [19.8563, 102.4955]
    },
    {
      abbreviation: "LBN",
      name: "Lebanon",
      coordinates: [33.8547, 35.8623]
    },
    {
      abbreviation: "LBR",
      name: "Liberia",
      coordinates: [6.4281, -9.4295]
    },
    {
      abbreviation: "LBY",
      name: "Libya",
      coordinates: [26.3351, 17.2283]
    },
    {
      abbreviation: "LCA",
      name: "Saint Lucia",
      coordinates: [13.9094, -60.9789]
    },
    {
      abbreviation: "LIE",
      name: "Liechtenstein",
      coordinates: [47.1660, 9.5554]
    },
    {
      abbreviation: "LKA",
      name: "Sri Lanka",
      coordinates: [7.8731, 80.7718]
    },
    {
      abbreviation: "LSO",
      name: "Lesotho",
      coordinates: [-29.6099, 28.2336]
    },
    {
      abbreviation: "LTU",
      name: "Lithuania",
      coordinates: [55.1694, 23.8813]
    },
    {
      abbreviation: "LUX",
      name: "Luxembourg",
      coordinates: [49.8153, 6.1296]
    },{
      abbreviation: "LVA",
      name: "Latvia",
      coordinates: [56.8796, 24.6032]
    },
    {
      abbreviation: "MAC",
      name: "Macao",
      coordinates: [22.1987, 113.5439]
    },
    {
      abbreviation: "MAF",
      name: "Saint-Martin",
      coordinates: [18.0708, -63.0501]
    },
    {
      abbreviation: "MAR",
      name: "Morocco",
      coordinates: [31.7917, -7.0926]
    },
    {
      abbreviation: "MCO",
      name: "Monaco",
      coordinates: [43.7384, 7.4246]
    },
    {
      abbreviation: "MDA",
      name: "Moldova",
      coordinates: [47.4116, 28.3699]
    },
    {
      abbreviation: "MDG",
      name: "Madagascar",
      coordinates: [-18.7669, 46.8691]
    },
    {
      abbreviation: "MDV",
      name: "Maldives",
      coordinates: [3.2028, 73.2207]
    },
    {
      abbreviation: "MEX",
      name: "Mexico",
      coordinates: [23.6345, -102.5528]
    },
    {
      abbreviation: "MHL",
      name: "Marshall Islands",
      coordinates: [7.1315, 171.1845]
    },
    {
      abbreviation: "MKD",
      name: "Macedonia, Former Yugoslav Republic of",
      coordinates: [41.6086, 21.7453]
    },
    {
      abbreviation: "MLI",
      name: "Mali",
      coordinates: [17.5707, -3.9962]
    },
    {
      abbreviation: "MLT",
      name: "Malta",
      coordinates: [35.9375, 14.3754]
    },
    {
      abbreviation: "MMR",
      name: "Myanmar",
      coordinates: [21.9162, 95.9560]
    },
    {
      abbreviation: "MNE",
      name: "Montenegro",
      coordinates: [42.7087, 19.3744]
    },
    {
      abbreviation: "MNG",
      name: "Mongolia",
      coordinates: [46.8625, 103.8467]
    },
    {
      abbreviation: "MNP",
      name: "Northern Mariana Islands",
      coordinates: [17.3300, 145.3846]
    },
    {
      abbreviation: "MOZ",
      name: "Mozambique",
      coordinates: [-18.6657, 35.5296]
    },
    {
      abbreviation: "MRT",
      name: "Mauritania",
      coordinates: [20.9394, -17.1097]
    },
    {
      abbreviation: "MSR",
      name: "Montserrat",
      coordinates: [16.7425, -62.1874]
    },
    {
      abbreviation: "MTQ",
      name: "Martinique",
      coordinates: [14.6415, -61.0242]
    },
    {
      abbreviation: "MUS",
      name: "Mauritius",
      coordinates: [-20.348404, 57.552152]
    },
    {
      abbreviation: "MWI",
      name: "Malawi",
      coordinates: [-13.2543, 34.3015]
    },
    {
      abbreviation: "MYS",
      name: "Malaysia",
      coordinates: [4.2105, 101.9758]
    },
    {
      abbreviation: "MYT",
      name: "Mayotte",
      coordinates: [-12.8275, 45.166244]
    },
    {
      abbreviation: "NAM",
      name: "Namibia",
      coordinates: [-22.9576, 18.4904]
    },
    {
      abbreviation: "NCL",
      name: "New Caledonia",
      coordinates: [-21.6226, 165.8640]
    },
    {
      abbreviation: "NER",
      name: "Niger",
      coordinates: [17.6078, 8.0817]
    },
    {
      abbreviation: "NFK",
      name: "Norfolk Island",
      coordinates: [-29.0408, 167.9547]
    },
    {
      abbreviation: "NGA",
      name: "Nigeria",
      coordinates: [9.0820, 8.6753]
    },
    {
      abbreviation: "NIC",
      name: "Nicaragua",
      coordinates: [12.8654, -85.2072]
    },
    {
      abbreviation: "NIU",
      name: "Niue",
      coordinates: [-19.0544, -169.8672]
    },
    {
      abbreviation: "NLD",
      name: "Netherlands",
      coordinates: [52.1326, 5.2913]
    },
    {
      abbreviation: "NOR",
      name: "Norway",
      coordinates: [60.4720, 8.4689]
    },
    {
      abbreviation: "NPL",
      name: "Nepal",
      coordinates: [28.3949, 84.1240]
    },
    {
      abbreviation: "NRU",
      name: "Nauru",
      coordinates: [-0.5228, 166.9315]
    },
    {
      abbreviation: "NZL",
      name: "New Zealand",
      coordinates: [-40.9006, 174.8860]
    },
    {
      abbreviation: "OMN",
      name: "Oman",
      coordinates: [21.5126, 55.9233]
    },
    {
      abbreviation: "PAK",
      name: "Pakistan",
      coordinates: [30.3753, 69.3451]
    }, {
      abbreviation: "PAN",
      name: "Panama",
      coordinates: [8.5379, -80.7821]
    },
    {
      abbreviation: "PCN",
      name: "Pitcairn Islands",
      coordinates: [-25.0667, -130.1000]
    },
    {
      abbreviation: "PER",
      name: "Peru",
      coordinates: [-9.1900, -75.0152]
    },
    {
      abbreviation: "PHL",
      name: "Philippines",
      coordinates: [12.8797, 121.7740]
    },
    {
      abbreviation: "PLW",
      name: "Palau",
      coordinates: [7.5150, 134.5825]
    },
    {
      abbreviation: "PNG",
      name: "Papua New Guinea",
      coordinates: [-6.3149, 143.9556]
    },
    {
      abbreviation: "POL",
      name: "Poland",
      coordinates: [51.9194, 19.1451]
    },
    {
      abbreviation: "PRI",
      name: "Puerto Rico",
      coordinates: [18.2208, -66.5901]
    },
    {
      abbreviation: "PRK",
      name: "Dem. Rep. Korea",
      coordinates: [40.3399, 127.5101]
    },
    {
      abbreviation: "PRT",
      name: "Portugal",
      coordinates: [39.3999, -8.2245]
    },
    {
      abbreviation: "PRY",
      name: "Paraguay",
      coordinates: [-23.4425, -58.4438]
    },
    {
      abbreviation: "PSE",
      name: "Palestine",
      coordinates: [31.9522, 35.2332]
    },
    {
      abbreviation: "PYF",
      name: "French Polynesia",
      coordinates: [-17.6797, -149.4068]
    },
    {
      abbreviation: "QAT",
      name: "Qatar",
      coordinates: [25.3548, 51.1839]
    },
    {
      abbreviation: "REU",
      name: "Reunion",
      coordinates: [-21.1151, 55.5364]
    },
    {
      abbreviation: "ROU",
      name: "Romania",
      coordinates: [45.9432, 24.9668]
    },
    {
      abbreviation: "RUS",
      name: "Russian Federation",
      coordinates: [61.5240, 105.3188]
    },
    {
      abbreviation: "RWA",
      name: "Rwanda",
      coordinates: [-1.9403, 29.8739]
    },
    {
      abbreviation: "SAU",
      name: "Saudi Arabia",
      coordinates: [23.8859, 45.0792]
    },
    {
      abbreviation: "SDN",
      name: "Sudan",
      coordinates: [12.8628, 30.2176]
    },
    {
      abbreviation: "SEN",
      name: "Senegal",
      coordinates: [14.4974, -14.4524]
    },
    {
      abbreviation: "SGP",
      name: "Singapore",
      coordinates: [1.3521, 103.8198]
    },
    {
      abbreviation: "SGS",
      name: "South Georgia and South Sandwich Islands",
      coordinates: [-54.4212, -36.0868]
    },
    {
      abbreviation: "SHN",
      name: "Saint Helena",
      coordinates: [-15.9654, -5.7084]
    },
    {
      abbreviation: "SJM",
      name: "Svalbard and Jan Mayen",
      coordinates: [77.5536, 23.6703]
    },
    {
      abbreviation: "SLB",
      name: "Solomon Islands",
      coordinates: [-9.7448, 160.0759]
    },
    {
      abbreviation: "SLE",
      name: "Sierra Leone",
      coordinates: [8.4606, -11.7799]
    },
    {
      abbreviation: "SLV",
      name: "El Salvador",
      coordinates: [13.7942, -88.8965]
    },
    {
      abbreviation: "SMR",
      name: "San Marino",
      coordinates: [43.9424, 12.4578]
    },
    {
      abbreviation: "SOM",
      name: "Somalia",
      coordinates: [5.1521, 46.1996]
    },
    {
      abbreviation: "SPM",
      name: "Saint Pierre and Miquelon",
      coordinates: [46.8852, -56.3159]
    },
    {
      abbreviation: "SRB",
      name: "Serbia",
      coordinates: [44.0165, 21.0059]
    },
    {
      abbreviation: "SSD",
      name: "South Sudan",
      coordinates: [7.8624, 29.6949]
    },
    {
      abbreviation: "STP",
      name: "Sao Tome and Principe",
      coordinates: [0.1864, 6.6131]
    },
    {
      abbreviation: "SUR",
      name: "Suriname",
      coordinates: [3.9193, -56.0278]
    },
    {
      abbreviation: "SVK",
      name: "Slovakia",
      coordinates: [48.6690, 19.6990]
    },
    {
      abbreviation: "SVN",
      name: "Slovenia",
      coordinates: [46.1512, 14.9955]
    },
    {
      abbreviation: "SWE",
      name: "Sweden",
      coordinates: [60.1282, 18.6435]
    },
    {
      abbreviation: "SWZ",
      name: "Swaziland",
      coordinates: [-26.5225, 31.4659]
    },
    {
      abbreviation: "SXM",
      name: "Sint Maarten",
      coordinates: [18.0425, -63.0548]
    },
    {
      abbreviation: "SYC",
      name: "Seychelles",
      coordinates: [-4.6796, 55.4920]
    },
    {
      abbreviation: "SYR",
      name: "Syria",
      coordinates: [34.8021, 38.9968]
    },
    {
      abbreviation: "TCA",
      name: "Turks and Caicos Islands",
      coordinates: [21.6940, -71.7979]
    },
    {
      abbreviation: "TCD",
      name: "Chad",
      coordinates: [15.4542, 18.7322]
    },
    {
      abbreviation: "TGO",
      name: "Togo",
      coordinates: [8.6195, 0.8248]
    },
    {
      abbreviation: "THA",
      name: "Thailand",
      coordinates: [15.8700, 100.9925]
    },
    {
      abbreviation: "TJK",
      name: "Tajikistan",
      coordinates: [38.8610, 71.2761]
    },
    {
      abbreviation: "TKM",
      name: "Turkmenistan",
      coordinates: [38.9697, 59.5563]
    },
    {
      abbreviation: "TLS",
      name: "Timor-Leste",
      coordinates: [-8.8742, 125.7275]
    },
    {
      abbreviation: "TON",
      name: "Tonga",
      coordinates: [-21.1780, -175.1982]
    },
    {
      abbreviation: "TTO",
      name: "Trinidad and Tobago",
      coordinates: [10.6918, -61.2225]
    },
    {
      abbreviation: "TUN",
      name: "Tunisia",
      coordinates: [33.8869, 9.5375]
    },
    {
      abbreviation: "TUR",
      name: "Turkey",
      coordinates: [38.9637, 35.2433]
    },
    {
      abbreviation: "TUV",
      name: "Tuvalu",
      coordinates: [-7.1095, 177.6493]
    },
    {
      abbreviation: "TWN",
      name: "Taiwan",
      coordinates: [23.6978, 120.9605]
    },
    {
      abbreviation: "TZA",
      name: "Tanzania",
      coordinates: [-6.369028, 34.888822]
    },
    {
      abbreviation: "UGA",
      name: "Uganda",
      coordinates: [1.3733, 32.2903]
    },
    {
      abbreviation: "UKR",
      name: "Ukraine",
      coordinates: [48.3794, 31.1656]
    },
    {
      abbreviation: "UMI",
      name: "United States Minor Outlying Islands",
      coordinates: [19.2881, 166.6470]
    },
    {
      abbreviation: "URY",
      name: "Uruguay",
      coordinates: [-32.5228, -55.7658]
    },
    {
      abbreviation: "USA",
      name: "United States",
      coordinates: [37.0902, -95.7129]
    },
    {
      abbreviation: "UZB",
      name: "Uzbekistan",
      coordinates: [41.3775, 64.5853]
    },
    {
      abbreviation: "VAT",
      name: "Vatican",
      coordinates: [41.9029, 12.4534]
    },
    {
      abbreviation: "VCT",
      name: "Saint Vincent and the Grenadines",
      coordinates: [12.9843, -61.2872]
    },
    {
      abbreviation: "VEN",
      name: "Venezuela",
      coordinates: [6.4238, -66.5897]
    },
    {
      abbreviation: "VGB",
      name: "British Virgin Islands",
      coordinates: [18.4207, -64.6399]
    },
    {
      abbreviation: "VIR",
      name: "United States Virgin Islands",
      coordinates: [18.3358, -64.8963]
    },
    {
      abbreviation: "VNM",
      name: "Vietnam",
      coordinates: [14.0583, 108.2772]
    },
    {
      abbreviation: "VUT",
      name: "Vanuatu",
      coordinates: [-15.3767, 166.9592]
    },
    {
      abbreviation: "WLF",
      name: "Wallis and Futuna Islands",
      coordinates: [-13.7681, -177.1561]
    },
    {
      abbreviation: "WSM",
      name: "Samoa",
      coordinates: [-13.7590, -172.1046]
    },
    {
      abbreviation: "YEM",
      name: "Yemen",
      coordinates: [15.5527, 48.5164]
    },
    {
      abbreviation: "ZAF",
      name: "South Africa",
      coordinates: [-30.5595, 22.9375]
    },
    {
      abbreviation: "ZMB",
      name: "Zambia",
      coordinates: [-13.1339, 27.8493]
    },
    {
      abbreviation: "ZWE",
      name: "Zimbabwe",
      coordinates: [-19.0154, 29.1549]
    }
];

(async () => {
  try {
    const country = countries.find(country => country.name === "Spain");

    if (country !== undefined) {
      map.setView(country.coordinates, 5);
      
      const points = await fetchFirmsData(country.abbreviation);
  
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
