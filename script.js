/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Implemented from: Paul Bourke's Random space filling tiling of the plane:
 * http://paulbourke.net/texture_colour/randomtile/
 *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var canvas = document.getElementById('view');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var ctx = this.canvas.getContext('2d');

var c = 1.2;
var circles = [];
var A0 = 50000;
var generation = 1;
var spaceKeyPressed = true;

/**
 * Generates normally distributed noise between 0 and 1.
 */
function random() { 
  return 0.5 * (((Math.random() + Math.random() + Math.random() + Math.random()
    + Math.random() + Math.random()) - 3) / 3) + 0.5;
}

/**
 * Drops the initial circle.
 */
function dropInitialCircle() { 
  var x = canvas.width * random();
  var y = canvas.height * random();
  var r = Math.sqrt(A0 / (Math.PI));
  circles.push({
    x: x,
    y: y,
    r: r
  });
}

/**
 * Tests against all the circles if a one with center (x, y) and radius r
 * intersects any of the rest.
 * @param {number} x 
 * @param {number} y 
 * @param {number} r
 * @returns {boolean} Whether it intersects or not.
 */
function isOverlapping(x, y, r) { 

  var x0 = x;
  var y0 = y;
  var r0 = r;

  var overlapping = false;

  circles.forEach(function (circle) { 
    var x1 = circle.x;
    var y1 = circle.y;
    var r1 = circle.r;

    var squaredDistance = Math.pow((x1 - x0), 2) + Math.pow(y1 - y0, 2);

    overlapping = overlapping || squaredDistance < Math.pow(r0 + r1, 2);
  });

  return overlapping;
}

window.onkeypress = function (ev) {
  if (ev.keyCode === 32) {
    spaceKeyPressed = !spaceKeyPressed;
  }
}

dropInitialCircle();
setInterval(function () {
  if (spaceKeyPressed) { 
    var x = random();
    var y = random();
    x *= canvas.width;
    y *= canvas.height;

    var r = Math.sqrt(A0 * Math.pow(generation, -c) / (Math.PI));

    while (isOverlapping(x, y, r)) {
      x = random();
      y = random();
      x *= canvas.width;
      y *= canvas.height;
    }

    circles.push({
      x: x,
      y: y,
      r: r
    });

    generation += 1;
  }

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';

  circles.forEach(function (circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
    ctx.fill();
  })
}, 30);