export {
  GEOMETRY_EPSILON,
  bounds,
  circle,
  line,
  lineThrough,
  point,
  polygon,
  ray,
  segment,
} from "./types.js";
export type {
  Bounds,
  Circle,
  Line,
  Point,
  Polygon,
  Ray,
  Segment,
} from "./types.js";

export {
  mapPolygon,
  midpoint,
  offsetSegment,
  pointOnRay,
  rayFromAngle,
  raySegment,
  reflectPoint,
  rotatePoint,
  rotatePolygon,
  scalePoint,
  scalePolygon,
  translatePoint,
  translatePolygon,
} from "./transforms.js";

export {
  circleCircleIntersections,
  lineCircleIntersections,
  lineLineIntersection,
  segmentIntersection,
} from "./intersections.js";
export type { SegmentIntersection } from "./intersections.js";

export {
  divideCircle,
  insetConvexPolygon,
  isConvexPolygon,
  polygonArea,
  polygonCentroid,
  polygonWinding,
  regularPolygon,
  regularPolygonVertices,
  starStepVertices,
  validatePolygon,
} from "./polygons.js";
export type { PolygonValidation } from "./polygons.js";

export {
  decagonalGrid,
  dodecagonalGrid,
  hexagonalGrid,
  radialGrid,
  squareGrid,
  triangularGrid,
} from "./grids.js";
export type { BoundedGridOptions, ConstructionGrid } from "./grids.js";

export { DeterministicPathBuilder, polygonPath } from "./path.js";

export {
  almondPetal,
  lotusBud,
  mirrorMotifGroup,
  palmette,
  rotateMotifGroup,
  splitLeaf,
  sScrollPath,
  tendrilPath,
} from "./botanical.js";
export type {
  BotanicalMotif,
  BotanicalMotifGroup,
  BotanicalPath,
  BotanicalPathRole,
} from "./botanical.js";

export {
  findSelfIntersections,
  validateRepeatCellEdges,
  validateSimplePolygon,
} from "./validation.js";
export type {
  GeometryValidation,
  PolygonSelfIntersection,
} from "./validation.js";

export {
  constructionOverlay,
  overlayCircle,
  overlayPoint,
  overlayPolygon,
  overlaySegment,
} from "./overlay.js";

export { GIRIH_PROTOTILE_KINDS, girihPrototile } from "./girih.js";
export type { GirihPrototileKind } from "./girih.js";
export type {
  ConstructionOverlay,
  ConstructionOverlayPrimitive,
  OverlayCircle,
  OverlayPoint,
  OverlayPolygon,
  OverlayRole,
  OverlaySegment,
} from "./overlay.js";
