var map;
var youAreHere;
var bounds;
var directions;
var lastIndex = 0;
var markers = [];
var markersLatLng = [];
var results = {};

//------------------------------Core Functionality-------------------------------------------//
function firstLoad() {
  if (document.getElementById('map')) {
    directions =  new google.maps.DirectionsRenderer();
    var myLatlng = new google.maps.LatLng(43.0154795, -81.1981106);
    var mapOptions = {
      zoom: 14,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var geocoder = new google.maps.Geocoder();
  }
}


function get_loc() {
  if (document.getElementById("user_loc").value.length == 0) {
    alert("No suitable location submitted");
    return;
  } else {
    markersLatLng = [];
    bounds = new google.maps.LatLngBounds();
    for (var x = 0; x < markers.length; x++)
      markers[x].setMap(null);
    if (directions != undefined)
    directions.setMap(null);
    markers = [];
    lastIndex = 0;
    var address = document.getElementById('user_loc').value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        youAreHere = results[0].geometry.location
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        markers.push(marker);
        bounds.extend(marker.getPosition());
        map.fitBounds(bounds);
        find();
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    })
  }
}

function find() {
  var type = document.getElementsByClassName("activeType")[0].attributes[1].nodeValue;
  var request = {
    location: youAreHere,
    radius: '5000',
    types: [type]
  };

  var service = new google.maps.places.PlacesService(map);
  var remove = document.getElementsByClassName('removable');

  while (remove[0]) {
    remove[0].parentNode.removeChild(remove[0]);
  }

  service.nearbySearch(request, function(data, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results = clone(data);
      //globalMap = clone(map);
      createView()
    }
  });
}

function createView() {
  var size
  bounds.extend(youAreHere);
  map.fitBounds(bounds);
  if (document.getElementsByClassName('loadClass').length != 0) {
    var remove = document.getElementsByClassName('loadClass');
    remove[0].parentNode.removeChild(remove[0]);
  }

  if (results.length < 4)
    size = results.length;
  else
    size = 4 + lastIndex;;

  var start = 0 + lastIndex;
  if (lastIndex != 0)
    expand(lastIndex)
  for (var i = start; i < size; ++i) {
    var place = results[i];
    var links = document.getElementById("links")
    var container = document.createElement("div")
    container.setAttribute("class", "removable");
    container.setAttribute("id", "container" + i);
    var tophalf = document.createElement("div")
    tophalf.setAttribute('id', i);
    tophalf.setAttribute('class', "topHalf");
    markersLatLng.push(place.geometry.location);
    tophalf.setAttribute('onclick', 'expand(this.id);');
    var picHolder = document.createElement("div")
    picHolder.setAttribute("class", "pictureDiv");
    if (place.hasOwnProperty('photos')) {
      var picture = document.createElement("img")
      picture.setAttribute("style", "height:inherit;width:100%;")
      picture.setAttribute("src", place.photos[0].getUrl({
        'maxWidth': 300,
        'maxHeight': 100
      }))
      picHolder.appendChild(picture);
    }
    var ratingDiv = document.createElement("div")
    ratingDiv.setAttribute("class", "rating");
    var rating = document.createElement("h1")
    rating.setAttribute("class", "ratingText")
    if (!place.hasOwnProperty('rating'))
      rating.innerHTML = "N/A"
    else
      rating.innerHTML = place.rating;
    var findOnMap = document.createElement("h3");
    findOnMap.innerHTML = "Go To";
    findOnMap.setAttribute("class", "goto")
    findOnMap.setAttribute('onclick', 'GoTo(this.id);');
    findOnMap.setAttribute("id", "GoTo" + i);
    var hiddenID = document.createElement("div");
    hiddenID.setAttribute("placeid", place.place_id);
    hiddenID.setAttribute("id", i);
    hiddenID.setAttribute("class", "hidden");
    var mainContent = document.createElement("div");
    mainContent.setAttribute("class", "mainContent");
    var name = document.createElement("h1");
    name.setAttribute("class", "name");
    name.innerHTML = place.name;
    var phoneNumber = document.createElement("h4");
    phoneNumber.setAttribute("class", "generalText");
    phoneNumber.setAttribute("id", "phone" + i);
    var website = document.createElement("a");
    website.setAttribute("id", "website" + i);
    website.setAttribute("class", "generalText");
    var expansion = document.createElement("div");
    expansion.setAttribute("id", "expand" + i);
    expansion.setAttribute("class", "expando");
    var star = document.createElement("i")
    star.setAttribute("class", "fa fa-star")
    star.setAttribute("style", "margin-left:5px;")
    var locationAddress = document.createElement("h4");
    locationAddress.setAttribute("class", "location")
    locationAddress.innerHTML = place.vicinity;
    //TopHalf
    ratingDiv.appendChild(rating);
    rating.appendChild(star);
    ratingDiv.appendChild(findOnMap)
    mainContent.appendChild(name);
    mainContent.appendChild(locationAddress);
    mainContent.appendChild(phoneNumber);
    mainContent.appendChild(website);
    mainContent.appendChild(hiddenID);
    tophalf.appendChild(picHolder);
    tophalf.appendChild(ratingDiv);
    tophalf.appendChild(mainContent);
    container.appendChild(tophalf);
    container.appendChild(expansion);
    links.appendChild(container);

    if (i == 3 + lastIndex && 3 + lastIndex != results.length - 1) {
      var button = document.createElement("button")
      var newid = i + 1
      button.setAttribute("id", "container" + newid)
      button.setAttribute("class", "loadClass")
      var textcontainer = document.createElement("div")
      textcontainer.setAttribute("class", "loadContainer")
      var text = document.createElement("h1")
      text.setAttribute("class", "loadText")
      text.innerHTML = "Load More"
      textcontainer.appendChild(text)
      button.appendChild(textcontainer)
      links.appendChild(button)
      var loadEvent = document.getElementById("container" + newid)
      loadEvent.onclick = function() {
        createView(map)
      };
      lastIndex = i + 1;

    }
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    var marker = new google.maps.Marker({
      map: map,
      title: place.name,
      icon: image,
      position: place.geometry.location,
    });
    getDetails(place.place_id, i)
    google.maps.event.addListener(marker, 'click', function() {
      map.panTo(marker.getPosition());
    });
    marker.setMap(map);
    bounds.extend(place.geometry.location);
    map.fitBounds(bounds);
    markers.push(marker);
  }
}


function getDetails(placeid, id) {
  var secondarySearch = new google.maps.places.PlacesService(map);
  var secondaryRequest = {
      placeId: placeid   
    } //check to make sure all status. Are ok
  secondarySearch.getDetails(secondaryRequest, function(detailsLoc, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var phoneNumber = document.getElementById("phone" + id)
      if (detailsLoc.hasOwnProperty('formatted_phone_number')) {
        var fullNumber = detailsLoc.formatted_phone_number
        var smallNumber = fullNumber.replace(/["'()]/g, "");
        phoneNumber.innerHTML = smallNumber
      }
      var currDate = Date()
      var openHoursDay = document.getElementById("hours" + id);
      var noHours = false;
      var expando = document.getElementById("expand" + id)
      if (detailsLoc.hasOwnProperty('opening_hours')) {
        var detailsLocObj = {};
        detailsLocObj = JSON.parse(JSON.stringify(detailsLoc.opening_hours));
        if (detailsLocObj.hasOwnProperty('weekday_text')) {
          for (var k = 0; k < detailsLoc.opening_hours.weekday_text.length; ++k) {
            var hoursToday = detailsLoc.opening_hours.weekday_text[k]
            var smallHours = "";
            smallHours = smallHours + hoursToday.replace(/:00/g, "")
            var temp = smallHours.split(/:(.+)?/);
            var openHours = document.createElement("div")
            var day = document.createElement("h4")
            day.setAttribute("style", "float: left; margin: 0 5px 0 0; width:50px;")
            day.innerHTML = temp[0].slice(0, 3)
            var times = document.createElement("h4")
            times.setAttribute("style", "float: left; margin:0;")
            times.innerHTML = temp[1];
            openHours.setAttribute("class", "hourList")
            openHours.appendChild(day)
            openHours.appendChild(times)
            expando.appendChild(openHours);
          }
        } else
          noHours = true;
      } else
        noHours = true;
      if (noHours == true) {
        var openHours = document.createElement("h4")
        openHours.setAttribute("class", "noHours")
        openHours.innerHTML = "See site for times";
        expando.appendChild(openHours);
      }

      var website = document.getElementById("website" + id)
      if (detailsLoc.hasOwnProperty('website')) {
        var site = detailsLoc.website
        var smallsite = site.replace(/http:/g, "").replace(/https:/g, "").replace(/\//g, "");
        website.innerHTML = smallsite;
        website.setAttribute("href", site);
      }
    }
  });
}

//------------------------------------------------------Expanded Functionality-------------------------------------------------------------//
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function expand(id) {
  var uid = parseInt(id) + 1;
  var lid = parseInt(id) - 1;
  var nextEle = document.getElementById("container" + uid)
  var lastEle = document.getElementById("container" + uid)
  if ($("#expand" + id).css("display") == "none" && nextEle != null) {
    $("#expand" + id).slideDown();
    $("#container" + uid).css({
      'margin-top': '150px'
    })
  } else if (nextEle != null) {
    $("#expand" + id).slideUp("fast", function() {
      $("#container" + uid).css({
        'margin-top': '20px'
      })
    });
  } else if (nextEle == null)
    $("#expand" + lid).slideUp(10)
};

function GoTo(param) {
  var id = param.slice(4, param.length);
  var center_loc = markersLatLng[id]
  var zoom = 14
  map.panTo(markersLatLng[id]);
  var marker = new google.maps.Marker({
    map: map,
    position: youAreHere
  });
  directions.setMap(null);
  directions = new google.maps.DirectionsRenderer();
  directions.setMap(map);
  var request = {
    origin: youAreHere,
    destination: center_loc,
    travelMode: google.maps.TravelMode.DRIVING
  };
  var service = new google.maps.DirectionsService();
  service.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directions.setDirections(response);
    }
  });
}

  $('#user_loc').keypress(function(e) {
    if (e.keyCode == 13)
      $('#submit').click();
  });

$("#nav-toggle").click(function() {
  this.classList.toggle("active");
  $(".hidable").toggleClass("hideContent");
  $("#searchDD").animate({
    width: "toggle"
  });
});

$(".types").click(function() {
  $(".activeType").toggleClass("activeType")
  $(this).toggleClass("activeType");
  if(document.getElementById("user_loc").value != "")
    get_loc()
});


window.onload = firstLoad;