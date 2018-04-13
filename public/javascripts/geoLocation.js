function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var location = JSON.parse(this.responseText).loc.split(",");
      console.log(location);
      try {
        document.getElementById("lng").value = 72.6655;
        document.getElementById("lat").value = 23.1563;
      } catch (e) {}
      // this.responseText;
    }
    initMap(location);
  };
  xhttp.open("GET", "https://ipinfo.io/json", true);
  xhttp.send();
}
