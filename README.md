cdt2d
=====
A robust 2D constrained Delaunay triangulation library

**WORK IN PROGRESS**

# Install

```
npm i cdt2d
```

# API

#### `var cells = require('cdt2d')(points[, edges, options])`
Constructs a constrained Delaunay triangulation of the point set

* `points` are the vertices of the triangulation.  These must be unique.
* `edges` is an optional list of edges which must occur within the triangulation. If not specified, then no constraints are used.
* `options` is an object which takes some optional parameters.
    + `delaunay` if this flag is set to true, then return a Delaunay triangulation.  Otherwise if it is false, then an arbitrary triangulation is returned.  (Default `true`)
    + `interior` if set, only return interior faces (Default `true`)
    + `exterior` if set, only return exterior faces (Default `true`)
    + `infinity` if set, then the triangulation is augmented with a point at infinity represented by the index `-1`.  (Default `false`)

**Returns** A list of all triangles represented as tuples of indices of vertices

**Note** Interior/exterior faces are classified by ray shooting against the planar graph, not edge orientation.

**Assumptions** This module makes the following assumptions about the points and edge constraints for correctness purposes:

* No point in the input is duplicated
* No pair of edge constraints cross
* If a point touches an edge constraint, then it must be one of the end points (no T-junctions)

If your input does not satisfy these conditions, you wil need to preprocess it somehow first.

# License
(c) 2015 Mikola Lysenko. MIT License
