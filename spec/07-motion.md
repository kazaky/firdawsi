# Motion

## Purpose

Motion explains relationship, direction, hierarchy, and state. It does not animate ornament for atmosphere. The desired character is measured and continuous: constructed transitions, clear origins, and calm settling.

## Principles

### Motion follows geometry

Movement SHOULD follow layout axes, component bounds, repeat intervals, or a documented radial center. Arbitrary flourishes, drifting particles, and continuously rotating star fields are outside the system.

### Structure before embellishment

Animate the semantic change first: an item enters, a region expands, focus moves, or progress updates. A geometric accent MAY respond once, after or with the structural motion, but never delay comprehension.

### Continuity without spectacle

Use shared edges, aligned anchors, and preserved object identity. Interlace-like “drawing on” MAY be used in a bounded explanatory diagram; it is not a general loading treatment.

### Direction is logical

Inline transitions respond to reading direction. Spatial or data direction remains fixed when meaning requires it. See typography/RTL mirroring rules.

## Duration bands

Platform implementations map these bands to native conventions:

- **Immediate (0–100 ms):** press, hover, focus-adjacent feedback.
- **Quick (120–180 ms):** selection, small reveal, icon/state swap.
- **Standard (180–280 ms):** panel transition, route continuity, moderate expansion.
- **Deliberate (280–450 ms):** onboarding or one-time focal composition.

Durations above 450 ms require a functional reason. Repeated interactions SHOULD use the short end. Never delay an action just to complete ornament.

## Easing

- Enter: decelerating curve; content arrives clearly.
- Exit: accelerating curve; departed content yields promptly.
- Move/resize: symmetric ease-in-out or platform spring with little/no overshoot.
- Press: immediate and reversible.

Profile overrides MAY tune subtle character but MUST remain within duration bands, avoid excessive overshoot, and preserve reduced-motion behavior.

## Approved patterns

### Reveal from a frame

Content clips or fades from a structural boundary. The boundary itself remains stable. Suitable for section entry and responsive panels.

### Modular cascade

Sibling items enter in reading order with 20–40 ms stagger. Cap total stagger at 160 ms; disable stagger for large lists and assistive/reduced-motion contexts.

### Geometric morph

Simple paths may interpolate when topology and meaning remain recognizable. Do not morph text, sacred symbols, calligraphy, profile-specific historical motifs, or unrelated icons.

### Focus transfer

Selection/focus emphasis moves along the shortest structural path without leaving users uncertain about the active item. The platform focus indicator remains immediate; decorative emphasis may follow but cannot replace it.

### Progressive construction

For educational diagrams only, reveal compass points, guides, polygons, then final lines. Provide pause/replay and a static equivalent. Do not imply that the sequence is a historically documented construction unless the source says so.

## Disallowed motion

- continuous ambient tessellation, parallax, shimmer, rotation, or pulsing ornament;
- calligraphy or scripture drawn, erased, fragmented, scattered, or used as a transition;
- motifs used as spinners;
- rapid radial expansion that resembles flashing;
- motion that crosses or obscures text and controls;
- decorative celebration for prayer, donation, or sacred-reading completion without domain review;
- animation whose only purpose is to make a profile feel “exotic” or “mystical.”

## Reduced motion

Respect the platform reduced-motion preference automatically and without requiring restart.

Under reduced motion:

- replace spatial travel with state cuts or short opacity transitions;
- remove parallax, rotation, scale overshoot, path drawing, and stagger;
- keep focus and pressed-state feedback;
- show progress through determinate static change where possible;
- preserve sequence and meaning;
- never remove content or confirmation.

Provide a reduced-decoration setting separately when ornament is substantial. Reduced motion and reduced decoration are related but not identical preferences.

## Loading and progress

- Prefer skeletons that match content anatomy or determinate progress.
- Indeterminate indicators use platform-standard forms and accessible labels.
- Geometric loaders MUST remain simple, non-textual, non-profile-specific, and non-continuous after loading ends.
- Announce long-running status without excessive screen-reader updates.
- Avoid star polygons, crescents, calligraphic marks, or sacred associations in loading states.

## Performance

- Animate compositor-friendly properties where platform guidance supports them.
- Maintain responsive input and scrolling; ornament animation is the first effect removed under load.
- Avoid path complexity that causes frame drops.
- Pause nonessential animation when offscreen, backgrounded, or occluded.
- A motion design fails if it only works on high-end hardware.

## Verification

Test:

- LTR and RTL logical direction;
- reduced-motion enabled before and during use;
- keyboard and switch navigation during transitions;
- screen-reader announcements;
- interrupted/reversed animations;
- background/foreground lifecycle;
- low-end reference devices and 4× CPU slowdown on web;
- zoom, dynamic type, and reflow while motion is active;
- no flashing exceeding WCAG thresholds.

