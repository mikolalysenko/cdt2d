'use strict'

var orient = require('robust-orientation')
var mouseChange = require('mouse-change')
var fit = require('canvas-fit')
var createTriangulation = require('../lib/monotone')

//Create canvas and context
var canvas = document.createElement('canvas')
var context = canvas.getContext('2d')
document.body.appendChild(canvas)
window.addEventListener('resize', fit(canvas), false)

var points = []
var cells = []

var lastButtons = 0
mouseChange(canvas, function(buttons, x, y) {
  if(!lastButtons && buttons) {
    points.push([x / canvas.width, y / canvas.height])
    cells = createTriangulation(points, [])
  }
})

function line(a, b) {
  var x0 = a[0]
  var y0 = a[1]
  var x1 = b[0]
  var y1 = b[1]
  var w = canvas.width
  var h = canvas.height
  context.beginPath()
  context.moveTo(w*x0, h*y0)
  context.lineTo(w*x1, h*y1)
  context.stroke()
}

function circle(x, y, r) {
  var w = canvas.width
  var h = canvas.height
  context.beginPath()
  context.moveTo(w*x, y*h)
  context.arc(w*x, h*y, r, 0.0, 2.0*Math.PI)
  context.fill()
}

var CW_ARROW = '⟳'
var CCW_ARROW = '⟲'

function drawSpiral(a, b, c) {
  var w = canvas.width
  var h = canvas.height
  var x = w * (a[0] + b[0] + c[0]) / 3.0
  var y = h * (a[1] + b[1] + c[1]) / 3.0
  context.font = Math.ceil(Math.min(w, h)*0.025) + 'px Verdana'
  if(orient(a, b, c) > 0) {
    context.fillText(CW_ARROW, x, y)
  } else {
    context.fillText(CCW_ARROW, x, y)
  }
}

function draw() {
  requestAnimationFrame(draw)

  var w = canvas.width
  var h = canvas.height
  context.fillStyle = '#fff'
  context.fillRect(0, 0, w, h)


  for(var i=0; i<cells.length; ++i) {
    var f = cells[i]
    var a = points[f[0]]
    var b = points[f[1]]
    var c = points[f[2]]
    var fs = f.slice().sort().join()
    context.fillStyle = '#000'
    context.fillStyle = '#000'
    line(a, b)
    line(b, c)
    line(c, a)
    drawSpiral(a, b, c)
  }

  for(var i=0; i<points.length; ++i) {
    var p = points[i]
    context.fillStyle = '#000'
    circle(p[0], p[1], 3)
  }
}
draw()
