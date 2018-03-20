function initGeolocation() {
  if (navigator.geolocation) {
    // Call getCurrentPosition with success and failure callbacks
    navigator.geolocation.getCurrentPosition(success, fail);
  } else {
    alert("Sorry, your browser does not support geolocation services.");
  }
}

function success(position) {
  document.getElementById("lng").value = position.coords.longitude;
  document.getElementById("lat").value = position.coords.latitude;
}

function fail() {
  // Could not obtain location
}
