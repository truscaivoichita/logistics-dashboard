const map = L.map("mapContainer").setView([40.4168, -3.7038], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

console.log("Logistics Dashboard started");
const form = document.getElementById("locationForm");
const input = document.getElementById("locationInput");
const list = document.getElementById("locationsList");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const location = input.value;

  console.log("New delivery location:", location);
  const li = document.createElement("li");
  li.textContent = location;
  list.appendChild(li);

  const result = await geocodeLocation(location);

  if (!result) return;

  const lat = result.lat;
  const lon = result.lon;

  map.setView([lat, lon], 10);

  L.marker([lat, lon]).addTo(map).bindPopup(location);
  marker.openPopup();

  input.value = "";
});

async function geocodeLocation(location) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,
  );

  const data = await response.json();
  console.log(data);

  if (data.length === 0) {
    alert("Location not found");
    return null;
  }
  return data[0];
}
