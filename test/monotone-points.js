'use strict'

var tape = require('tape')
var monotone = require('../lib/monotone')
var verifyTriangulation = require('./verify-triangulation')

tape('monotone triangulation - grids', function(t) {

  function grid(nx, ny) {
    console.log('test grid:', nx, ny)
    var points = []
    for(var i=0; i<nx; ++i) {
      for(var j=0; j<ny; ++j) {
        points.push([i/10,j/10])
      }
    }
    verifyTriangulation(t, points, [], monotone(points, []))
  }

  grid(2, 2)
  grid(3, 3)
  grid(5, 5)
  grid(10, 10)
  grid(2, 10)
  grid(10, 2)
  grid(3, 10)
  grid(10, 3)
  grid(1, 10)
  grid(10, 1)

  t.end()
})
