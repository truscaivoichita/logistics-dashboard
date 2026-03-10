const map = L.map("mapContainer").setView([40.4168, -3.7038], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

console.log("Logistics Dashboard started");
const form = document.getElementById("locationForm");
const input = document.getElementById("locationInput");
const list = document.getElementById("locationsList");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const location = input.value;

  if (!location) return;
  const li = document.createElement("li");
  li.textContent = location;
  list.appendChild(li);
  console.log("New delivery location:", location);

  input.value = "";
});
