# `@firdawsi/shape`

Parametric arch-corner family for Firdawsi. Corners are derived from
construction ratios (`rise`, `shoulder`), never from a horseshoe silhouette.

```ts
import { archCornerPath, archForState } from "@firdawsi/shape";

const rest = archForState(160, 48, "balanced", "rest");
const pressed = archForState(160, 48, "balanced", "pressed");
```
