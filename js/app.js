let map;
const form = document.getElementById("locationForm");
const input = document.getElementById("locationInput");
const list = document.getElementById("locationsList");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function initMap() {
  const map = L.map("mapContainer").setView([40.4168, -3.7038], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);
  console.log("Logistics Dashboard started");
  return map;
}

async function geocodeLocation(location) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,
    );
    const data = await response.json();
    if (data.length === 0) {
      alert("Location not found");
      return null;
    }
    return data[0];
  } catch (error) {
    console.error("Geocoding error:", error);
    alert("Failed to fetch location");
    return null;
  }
}

function addMarker(map, lat, lon, label) {
  const marker = L.marker([lat, lon]).addTo(map).bindPopup(label);
  marker.openPopup();
}

function addLocationToList(location) {
  const li = document.createElement("li");
  li.textContent = location;
  list.appendChild(li);
}
function cleanStoredLocations() {
  const stored = JSON.parse(localStorage.getItem("locations")) || [];
  const cleaned = [...new Set(stored.map((loc) => loc.toUpperCase()))];
  localStorage.setItem("locations", JSON.stringify(cleaned));
  console.log("Cleaned locations:", cleaned);
}

function saveLocation(location) {
  const stored = JSON.parse(localStorage.getItem("locations")) || [];
  console.log("location: ", location);
  if (stored.includes(location.toUpperCase())) {
    console.log("Location already exists:", location);
    return;
  }
  stored.push(location);
  localStorage.setItem("locations", JSON.stringify(stored));
  console.log("stored location: ", stored);
}

async function loadSavedLocations() {
  const stored = JSON.parse(localStorage.getItem("locations")) || [];
  for (const location of stored) {
    addLocationToList(location);
    const result = await geocodeLocation(location);
    if (result) {
      addMarker(map, result.lat, result.lon, location);
    }
    await sleep(1000);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const location = input.value.trim().toUpperCase();
  const stored = JSON.parse(localStorage.getItem("locations")) || [];
  if (stored.includes(location)) {
    alert("Location already added");
    input.value = "";
    return;
  }
  console.log("New delivery location:", location);
  const result = await geocodeLocation(location);
  if (!result) return;
  const lat = result.lat;
  const lon = result.lon;
  map.setView([lat, lon], 10);
  addMarker(map, lat, lon, location);
  addLocationToList(location);
  saveLocation(location);
  input.value = "";
}

function initEvents() {
  form.addEventListener("submit", handleFormSubmit);
}
function initApp() {
  cleanStoredLocations();
  map = initMap();
  initEvents();
  loadSavedLocations();
}
initApp();
