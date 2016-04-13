/*global $:true Popcorn:true*/

function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
  var dLon = (lon2 - lon1).toRad();
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d*1000;
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

$(function() {
  var pos;

  function showPosition(position) {
    console.log(position)
    pos = position;
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    var img_url = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlon + '&zoom=15&size=400x300&sensor=false';
    var dist = Math.floor(distance(3.8657956,43.6003912,position.coords.longitude,position.coords.latitude));
    $('#precision').text(Math.floor(position.coords.accuracy));
    $('#distance').text(dist);
    document.getElementById('myLoc').innerHTML = '<img src="' + img_url + '">';

  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, function() {}, { enableHighAccuracy: true });
  } else {
    $('#myLoc').text('Geolocation is not supported by this browser.');
  }



  var a = document.getElementById('myAudio');
  //a.play();

  var c = 1;
  var i = setInterval(function() {
    var t = a.currentTime;
    var d = a.duration;
    var z = a.buffered.end(a.buffered.length - 1);
    $('#position').text(Math.floor(t) + ' / ' + Math.floor(d - t));
    $('#duration').text(Math.floor(d));
    $('#buffer').text(Math.floor(z));
    $('#load').text(Math.floor((100 * z) / d));
    var rate = c / z;
    $('#remain').text(c + ' / ' + Math.floor((d - z) * rate));
    if (Math.floor((d - z) * rate) < 1)
      clearInterval(i);
    c++;
  }, 1000);



  var ref = new Firebase("https://tem.firebaseio.com/users");

  function authenticate(authData) {
    var myRef = new Firebase("https://tem.firebaseio.com/users/" + authData.uid + "/log");

    myRef.orderByChild("timestamp").limitToLast(5).on('child_added', function(snap) {
      var val = snap.val();
      $('#log').append('<li>' + new Date(val.timestamp) + ' : ' + val.event + '</li>');
    });

    var log = myRef.push({
      event: 'login',
      commissure: 1,
      timestamp: Date.now(),
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });

    $(window).bind('beforeunload', function() {
      var log = myRef.push({
        event: 'leave',
        commissure: 1,
        timestamp: Date.now(),
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        position: a.currentTime
      });
    });


  }

  var myRef;
  $.fbLog = function() {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData.facebook);
        $('#dispname').text(authData.facebook.displayName + ' / ' + authData.uid)
        authenticate(authData);
      }
    });
  }

  $.twLog = function() {
    ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $('#dispname').text(authData.twitter.displayName + ' / ' + authData.uid)
        authenticate(authData);
      }
    });
  }




});
