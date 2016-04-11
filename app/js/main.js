/*global $:true Popcorn:true twttr:true*/

$(function() {

  function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var img_url = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlon + '&zoom=15&size=400x300&sensor=false';

    document.getElementById('myLoc').innerHTML = '<img src="' + img_url + '">';
  }
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    $('#myLoc').text = 'Geolocation is not supported by this browser.';
  }
  var a = document.getElementById('myAudio');
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

});
