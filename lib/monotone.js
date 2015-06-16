'use strict'

var bsearch = require('binary-search-bounds')
var orient = require('robust-orientation')[2]

var EVENT_POINT = 0
var EVENT_END   = 1
var EVENT_START = 2

module.exports = monotoneTriangulate

function PartialHull(a, b, idx, lower, upper) {
  this.a = a
  this.b = b
  this.idx = idx
  this.lowerPts = lowerPts
  this.lowerIds = lowerIds
  this.upperPts = upperPts
  this.upperIds = upperIds
}

function Event(a, b, type, idx) {
  this.a    = a
  this.b    = b
  this.type = type
  this.idx  = idx
}

function compareEvents(a, b) {
  var ax = a.a[0]
  var bx = b.b[0]
  var d = ax - bx
  if(d) {
    return d
  }
  var ay = a.a[1]
  var by = b.b[1]
  d = ay - by
  if(d) {
    return d
  }
  d = a.type - b.type
  if(d) {
    return d
  }
  if(a.type === EVENT_POINT) {
    return 0
  }
  return orient(a.a, a.b, b.b)
}

function testPoint(hull, p) {
  return orient(hull.a, hull.b, p)
}

function addPoint(cells, hulls, p, idx) {
  var lo = bsearch.lte(hulls, p, testPoint)
  var hi = bsearch.gt(hulls, p, testPoint, lo)
  for(var i=lo; i<hi; ++i) {
    var hull = hulls[i]

    //Insert p into lower hull
    var lowerPts = hull.lowerPts
    var lowerIdx = hull.lowerIdx
    var m = lowerPts.length
    while(m > 1 && orient(
        lowerPts[m-2],
        lowerPts[m-1],
        p) <= 0) {
      cells.push(
        [lowerIdx[m-1],
         lowerIdx[m-2],
         idx])
      m -= 1
    }
    lowerPts.length = lowerIdx.length = m
    lowerPts.push(p)
    lowerIdx.push(idx)

    //Insert p into upper hull
    var upperPts = hull.upperPts
    var upperIdx = hull.upperIdx
    var m = upperPts.length
    while(m > 1 && orient(
        upperPts[m-2],
        upperPts[m-1],
        p) >= 0) {
      cells.push(
        [upperIdx[m-1],
         upperIdx[m-2],
         idx])
      m -= 1
    }
    upperPts.length = upperIdx.length = m
    upperPts.push(p)
    upperIdx.push(idx)
  }
}

function splitHulls(hulls, a, b, idx) {
  //TODO
}

function mergeHulls(hulls, a, b, idx) {
  //TODO
}


function monotoneTriangulate(points, edges) {

  var numPoints = points.length
  var numEdges = edges.length

  var events = []

  //Create point events
  for(var i=0; i<numPoints; ++i) {
    events.push(new Event(
      points[i],
      null,
      EVENT_POINT,
      i))
  }

  //Create edge events
  for(var i=0; i<numEdges; ++i) {
    var e = edges[i]
    var a = points[e[0]]
    var b = points[e[1]]
    if(a[0] < b[0]) {
      if(a[1] !== b[1]) {
        events.push(
          new Event(a, b, EVENT_START, i),
          new Event(b, a, EVENT_END, i))
      }
    } else if(a[0] > b[0]) {
      events.push(
        new Event(b, a, EVENT_START, i),
        new Event(a, b, EVENT_END, i))
    }
  }

  //Sort events
  events.sort(compareEvent)

  //Initialize hull
  var minX = events[0] - Math.abs(events[0]) * Math.pow(2, -52)
  var hull = [ new PartialHull([minX, 0], [minX, 1], -1, [], [], [], []) ]

  //Process events in order
  var cells = []
  for(var i=0, numEvents=events.length; i<numEvents; ++i) {
    var event = events[i]
    var type = event.type
    if(type === EVENT_POINT) {
      addPoint(cells, hull, event.a, event.idx)
    } else if(type === EVENT_START) {
      splitHulls(hull, event.a, event.b, event.idx)
    } else {
      mergeHulls(hull, event.b, event.a, event.idx)
    }
  }

  //Return triangulation
  return cells
}
