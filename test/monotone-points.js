'use strict'

var tape = require('tape')
var ch = require('convex-hull')
var bnd = require('simplicial-complex-boundary')
var flip = require('flip-orientation')
var orient = require('robust-orientation')
var monotone = require('../lib/monotone')

function compareLex(a, b) {
  return (a[0] - b[0]) || (a[1] - b[1])
}

function verifyTriangulation(tape, points) {
  var triangles = monotone(points, [])

  //Verify:
  //  1. boundary of triangulation = convex hull
  var B = bnd(triangles).sort(compareLex)
  var H = ch(points).map(flip).sort(compareLex)
  tape.equals(B.join(';'), H.join(';'))

  //  2. the intersection of any two triangles is contained in their boundary
  //  3. no degenerate triangles
  //  4. every point is contained in at least one triangle
  //  5. euler characteristic is correct
}

tape('monotone triangulation - grids', function(t) {

  function grid(nx, ny) {
    var points = []
    for(var i=0; i<nx; ++i) {
      for(var j=0; j<ny; ++j) {
        points.push([i,j])
      }
    }
    verifyTriangulation(t, points)
  }

  grid(2, 2)
  grid(3, 3)
  grid(10, 10)
  grid(2, 10)
  grid(10, 2)
  grid(3, 10)
  grid(10, 3)
  grid(1, 10)
  grid(10, 1)

  t.end()
})
