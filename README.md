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
* `edges` is an optional list of edges which must occur within the triangulation.
* `options` is an object which takes some optional parameters.
    + `delaunay` if this flag is set to true, then return a Delaunay triangulation.  Otherwise if it is false, then an arbitrary triangulation is returned.  (Default `true`)
    + `pointAtInfinity` if set, then the triangulation is augmented with a point at infinity represented by the index `-1`.  (Default `false`)

**Returns** A list of all triangles represented as tuples of indices of vertices

# License
(c) 2015 Mikola Lysenko. MIT License
