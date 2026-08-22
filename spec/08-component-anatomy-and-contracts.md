# Component Anatomy and Cross-Platform Contracts

## Architecture

Components are defined semantically, then rendered with native platform conventions. The contract separates:

1. **Meaning:** role, name, value, state, relationships, and events.
2. **Anatomy:** required and optional slots.
3. **Behavior:** input, focus, selection, validation, loading, and direction.
4. **Appearance:** core tokens and an optional single regional profile.

A profile may style approved appearance slots. It MUST NOT alter meaning, reorder essential anatomy, reduce targets, replace native behaviors, or add unannounced content.

## Universal anatomy model

Interactive components use these slots where applicable:

- `container` — hit area and grouping boundary;
- `leading` — logical-start icon/avatar, optional;
- `label` — primary accessible text;
- `description` — supporting text, optional;
- `value` — current value, optional;
- `trailing` — logical-end metadata or directional affordance, optional;
- `status` — validation/state message;
- `focusIndicator` — mandatory for focusable controls;
- `ornamentZone` — decorative, noninteractive, hidden from accessibility APIs, optional.

“Leading” and “trailing” are logical terms. Implementations MUST NOT hard-code left/right.

## Shared state model

Supported states are explicit:

- enabled;
- hover-capable hover;
- pressed;
- focused;
- selected/checked;
- disabled;
- read-only where relevant;
- loading;
- error;
- warning;
- success.

State precedence:

1. disabled/read-only semantics;
2. focus visibility;
3. error/warning;
4. selected/checked;
5. pressed/hover;
6. profile appearance;
7. ornament.

Ornament can never be the sole state indicator.

## Core component contracts

### Button

Required: container, label, focus indicator. Optional leading/trailing icon, loading status.

- Name is text or a robust accessible label; icon-only buttons require an accessible name and tooltip/help where platform conventions expect it.
- Loading preserves dimensions, communicates status, and prevents duplicate activation as appropriate.
- Destructive actions use semantic styling and confirmation proportional to risk.
- Minimum target follows the strictest relevant platform/accessibility target; visual shape may be smaller only within a larger hit area.
- Ornament is prohibited inside standard buttons. A ceremonial call-to-action may use a bounded frame outside the hit area after review.

### Text field

Required: persistent label, editable value, focus indicator. Optional description, prefix/suffix, status.

- Placeholder does not replace label.
- Validation message is programmatically associated and not color-only.
- Start/end accessories mirror by semantics, not graphics alone.
- Arabic input supports shaping, bidi editing, marks, and non-ASCII numerals.
- Pattern, textured fills, and ornamental outlines are prohibited.

### Card

Required: content region; optional header, media, actions, metadata, ornament zone.

- A card is not interactive by default. If whole-card activation is used, nested controls and semantics are resolved explicitly.
- One clear focal hierarchy; borders and shadow remain structural.
- Profile ornament is confined to a non-content edge/zone and removed in dense lists.
- Repeated cards SHOULD NOT repeat focal motifs.

### Navigation item

Required: label, selected/current state when applicable, focus indicator. Optional icon, badge.

- Current location is programmatically exposed.
- Directional icons respond to locale; identity icons do not.
- Selection treatment remains visible in forced colors.
- Geometry may organize spacing but MUST NOT make selected tabs look like sacred architectural forms.

### Dialog/sheet

Required: title, content, dismiss/commit path, focus management.

- Initial focus and return focus follow platform guidance.
- Reading and action order follows locale without blindly reversing risk conventions that platforms specify.
- Decoration is density 0 by default and cannot delay or obscure urgent messages.
- Full-screen sacred or sensitive content requires domain-specific review.

### List/table

- Lists expose grouping and item semantics.
- Tables preserve headers, relationships, sort state, and keyboard navigation.
- Repeating pattern backgrounds are prohibited.
- Row striping, rules, and selection use accessible structural tokens.
- RTL changes alignment and inline progression while preserving data semantics.

### Empty state

- Explains what is empty and provides a relevant action where possible.
- May use one original bounded geometric illustration at density 2.
- Illustration is decorative unless it conveys information; informative art needs equivalent text.
- Do not use sacred architecture, calligraphy, crescents, or generalized “Islamic” iconography as mood.

### Progress/stepper

- Exposes current step, total/sequence where known, and completion status.
- Progress direction follows reading direction unless time/data semantics dictate otherwise.
- Star nodes and ornamental interlace paths are prohibited.
- Motion follows the motion specification and reduced-motion preference.

## Cross-platform mapping

### Web

- Use native HTML semantics first; ARIA augments but does not replace them.
- DOM order is the semantic order.
- Support keyboard, pointer, touch, zoom/reflow, forced colors, reduced motion, and user styles.
- Decorative SVG uses `aria-hidden`, cannot receive focus, and has no pointer events.

### iOS/iPadOS

- Map to native accessibility traits, Dynamic Type, VoiceOver order, Reduce Motion, Increase Contrast, and RTL layout direction.
- Prefer standard controls and navigation behavior.
- Do not freeze type metrics or bake Arabic into images.

### Android

- Map roles/states to platform semantics, TalkBack traversal, font scaling, high-contrast/accessibility settings, and RTL resources.
- Use start/end constraints and locale-aware formatting.
- Preserve minimum touch targets and native back behavior.

### Desktop

- Provide visible focus, complete keyboard access, pointer/keyboard parity, platform menu conventions, and resizing.
- Support high-contrast themes and large text.
- Window chrome and system dialogs stay native; profiles do not theme OS-owned surfaces.

## Token boundary

Components consume semantic tokens:

- surface/content/border/action/status roles;
- spacing and type roles;
- focus and target requirements;
- motion bands;
- direction;
- optional `profile`;
- optional ornament density.

They do not consume object names such as `mamlukWood`, `iznikBlue`, or `mughalArch`. Historically loaded implementation names encourage decontextualized reuse. Profile internals use neutral token names plus provenance metadata.

## Serialization contract

For generated UI, each component description SHOULD include:

```json
{
  "type": "button",
  "role": "primary",
  "label": "Continue",
  "state": {"disabled": false, "loading": false},
  "direction": "auto",
  "profile": "universal",
  "ornamentDensity": 0,
  "provenanceIds": []
}
```

Unknown profile IDs, more than one profile, ornament on prohibited components, and missing accessible names are validation errors.

## Definition of done

A component is complete only when:

- neutral core anatomy and states are documented;
- web, iOS, Android, and desktop mappings are defined or explicitly out of scope;
- LTR/RTL, mixed script, text scaling, and localization are tested;
- keyboard and assistive-technology behavior is tested;
- forced colors/high contrast and reduced motion are tested;
- profile application changes appearance only;
- ornament removal causes no semantic or functional loss.

