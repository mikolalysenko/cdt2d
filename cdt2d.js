'use strict'

var monotoneTriangulate = require('./lib/monotone')
var makeIndex = require('./lib/triangulation')
var delaunayRefine = require('./lib/delaunay')

module.exports = cdt2d

function canonicalizeEdge(e) {
  return [Math.min(e[0], e[1]), Math.max(e[0], e[1])]
}

function compareEdge(a, b) {
  var d = a[0] - b[0]
  if(d) {
    return d
  }
  return a[1] - b[1]
}

function canonicalizeEdges(edges) {
  return edges.map(canonicalizeEdge).sort(compareEdge)
}

function cdt2d(points, edges, options) {

  console.clear()
  console.log('run triangulation')

  if(!Array.isArray(edges)) {
    options = edges || {}
    edges = []
  } else {
    options = options || {}
    edges = edges || []
  }

  //Parse out options
  var delaunay = ('delaunay' in options) ? !!options.delaunay : true

  //Construct initial triangulation
  var cells = monotoneTriangulate(points, edges)

  console.log('cells=', cells)

  //If delaunay refinement needed, then improve quality by edge flipping
  if(delaunay) {

    //Index all of the cells to support fast neighborhood queries
    var triangulation = makeIndex(points.length)
    for(var i=0; i<cells.length; ++i) {
      var f = cells[i]
      triangulation.addTriangle(f[0], f[1], f[2])
    }

    //Sort edges for set membership queries
    var sortedEdges = canonicalizeEdges(edges)

    //Run delaunay refinement
    delaunayRefine(points, triangulation, sortedEdges)

    //Return cells in triangulation
    return triangulation.cells()
  } else {
    return cells
  }
}
