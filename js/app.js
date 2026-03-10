console.log("Logistics Dashboard started");
const form = document.getElementById("locationForm");
const input = document.getElementById("locationInput");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const location = input.value;

  console.log("New delivery location:", location);

  input.value = "";
});
