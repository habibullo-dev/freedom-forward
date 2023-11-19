// Data sets
let boycottedBrands;

// Call updateCards with currentMode as argument
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => {
    boycottedBrands = data.boycotts;
    console.log(boycottedBrands);

    // Create an object to store the markers
    const markers = {};

    boycottedBrands.forEach(function (brand, index) {
      let coordinates = getCityCoordinates(index);
      if (!coordinates) {
        // If there are no more cities, place the brand at a random location 10 km away from the last city
        coordinates = getRandomCoordinates(cities[cities.length - 1].coordinates, 25);
      }

      // Create a marker with the custom icon
      const marker = L.marker(coordinates, { icon: greyIcon });

      // Add the marker to the markers object
      markers[brand.name.toLowerCase()] = marker;

      // Add a popup with the brand's name
      marker.bindPopup(brand.name);

      // Add a click event to the marker to show the sidebar
      marker.on('click', function () {
        // Show the sidebar and fill it with the brand's info
        document.getElementById('sidebar').style.display = 'block';
        document.getElementById('sidebar').innerHTML = `
        <img src="${brand.image}" alt="${brand.name}">
        <h1>${brand.news.title}</h1>
        <p>${brand.news.brief}</p>
        <a href="${brand.reference}" target="_blank">Read more</a>
      `;
      });

      marker.addTo(map);
    });

    // Add an event listener to the search form
    document.querySelector('form[role="search"]').addEventListener('submit', function (event) {
      // Prevent the form from being submitted
      event.preventDefault();

      // Get the search term from the input field and convert it to lower case
      const searchTerm = event.target.querySelector('input[type="search"]').value.toLowerCase();

      // Find the marker for the brand
      const marker = markers[searchTerm];

      // If a marker was found, simulate a click on it
      if (marker) {
        marker.fire('click');
      } else {
        // If no marker was found, show an alert
        alert('Brand not found');
      }
    });
  })
  .catch((error) => console.error("Error:", error));

// Array of central Korean cities with their coordinates
const cities = [
  { name: "Seoul", coordinates: [37.5665, 126.978] },
  { name: "Incheon", coordinates: [37.4563, 126.7052] },
  { name: "Suwon", coordinates: [37.2636, 127.0286] },
  { name: "Seongnam", coordinates: [37.4449, 127.1389] },
  { name: "Goyang", coordinates: [37.6584, 126.832] },
  { name: "Yongin", coordinates: [37.2411, 127.1775] },
  { name: "Bucheon", coordinates: [37.5034, 126.766] },
  { name: "Ansan", coordinates: [37.3228, 126.8309] },
  { name: "Namyangju", coordinates: [37.636, 127.2165] },
];

// Function to get the coordinates of a city by index
function getCityCoordinates(index) {
  return cities[index] ? cities[index].coordinates : null;
}

// Function to generate a random point at a certain distance from a given point
function getRandomCoordinates(center, radiusInKm) {
  const radiusInDegrees = radiusInKm / 111.32; // Roughly convert radius from km to degrees
  const angle = Math.random() * 2 * Math.PI; // Random angle
  const dx = radiusInDegrees * Math.cos(angle);
  const dy = radiusInDegrees * Math.sin(angle);
  return [center[0] + dy, center[1] + dx];
}

// Create a map centered at central South Korea with a city-level zoom
const map = L.map("map").setView([37.5636, 127.0286], 10);

// Add a dark-themed tile layer to the map
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 19,
  }
).addTo(map);

// Create a custom icon
const greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});