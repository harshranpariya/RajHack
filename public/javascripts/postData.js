$("#uploadForm").submit(function(e) {
  e.preventDefault();
  // $("#status").empty().text("File is uploading...");
  var city = $("#city").val();
  var lng = $("#lng").val();
  var lat = $("#lat").val();
  var feedback = $("#feedback").val();
  console.log({ lat: lat, lng: lng });
  console.log("data ", city, lng, lat, feedback);
  // console.log("title",title);
  $(this).ajaxSubmit({
    data: { city: city, lng: lng, lat: lat, feedback: feedback },
    contentType: "application/json",
    success: function(response) {
      setMapOnAll(map, { lat: parseFloat(lat), lng: parseFloat(lng) });
      $("#status")
        .empty()
        .text(response);
      $("#uploadForm")[0].reset();
      $("#lng").val(lng);
      $("#lat").val(lat);

      $("#blah").remove();
      $("#img").html('<img id="blah" class = "mw-100" src=""  />');
      lat = parseFloat(response[0][2]);
      lng = parseFloat(response[0][3]);
      console.log("success");
    }
  });
  return false;
});

var map;
var markers = [];

function initMap(location) {
  console.log(location);
  if (location) {
    var loc = { lat: parseFloat(location[0]), lng: parseFloat(location[1]) };
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: loc,
      mapTypeId: "terrain",
      url: "./img/mark.png"
    });
  }
}

function addMarker(loc) {
  console.log(loc);
  var marker = new google.maps.Marker({
    position: loc,
    map: map,
    icon: {
      url: "./img/mark.png",
      anchor: new google.maps.Point(23, 50),
      scaledSize: new google.maps.Size(40, 40)
    }
  });
  console.log(marker);
  marker.setMap(map);

  markers.push(marker);
}

function setMapOnAll(map, loc) {
  addMarker(loc);
  console.log("setMapOnAll called");
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
