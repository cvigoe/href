$(document).ready(function(){

  var end = new Date('12/28/2016 1:50 PM');

  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;

  function showRemaining() {
      var now = new Date();
      var distance = end - now;
      if (distance < 0) {

          clearInterval(timer);
          document.getElementById('countdown').innerHTML = 'EXPIRED!';

          return;
      }
      var days = Math.floor(distance / _day);
      var hours = Math.floor((distance % _day) / _hour);
      var minutes = Math.floor((distance % _hour) / _minute);
      var seconds = Math.floor((distance % _minute) / _second);

      document.getElementById('waiting').innerHTML = days + 'days ';
      document.getElementById('waiting').innerHTML += hours + 'hrs ';
      document.getElementById('waiting').innerHTML += minutes + 'mins ';
      document.getElementById('waiting').innerHTML += seconds + 'secs';
  }

  timer = setInterval(showRemaining, 1000);
});