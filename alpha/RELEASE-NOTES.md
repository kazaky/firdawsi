# Week 6 — preview distribution candidate

## Included

- Four local package tarballs: tokens, geometry, shape and React web components.
- Generated semantic themes, regional overlays and independent language/direction.
- A separate English/Arabic React starter with a genuine production build.
- A source manifest, package checksums and consumer-verification result.
- The source showcase's seven principles, bounded religious interpretations,
  six component contracts, pattern guidance and browser-local task lifecycle.
  The complete showcase is in the source repository, not the small starter.

Week 5 fixed regional colours overriding dark/high-contrast semantics, caption
and label contrast, keyboard focus for horizontal comparison, and narrow-screen
overflow. Language no longer changes implicitly when only direction changes.

## Adoption and compatibility

This kit preserves existing package versions and is identified by source commit.
APIs may change before stable release. Keep the kit and source revision together;
do not treat a tarball's version alone as a unique identifier for preview builds.
The packages are evaluated together. The starter targets React 19 and modern
Vite-compatible browsers; Android/Compose and iOS implementations are not included.

Browser-local reference tasks use `firdawsi-experience-tasks-v1`; missing legacy
completion flags are read as false. Existing data is not silently rewritten.
The starter has no storage. Neither example provides remote backup, cross-device
sync, multi-tab conflict resolution or Misho integration.

## Remaining gates

Manual screen-reader, zoom, forced-colour, real-device and visual review; Arabic
language/optical review; formative task testing; qualified religious and historical
review. Automated audits support a WCAG 2.2 AA target, not a conformance claim.
No stable tag, registry publication, or completed specialist review is asserted.

For rollback of an evaluation, reinstall all four tarballs from the previous kit
and restore its lockfile. Changes to local user data require a separate migration
and backup plan; code rollback alone does not restore deleted browser data.

Release claims follow [Al-Ahzab 33:70](https://quran.com/al-ahzab/70), applied here
as truthful reporting. Adoption respects [Al-Isra 17:70](https://quran.com/al-isra/70),
applied here as user dignity and access. These connections are ethical applications.
