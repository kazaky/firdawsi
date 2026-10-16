# Reference task lifecycle

The experience lab now demonstrates a complete browser-local task lifecycle:
capture, edit, complete/reopen, move, remove, and undo. List and grouped week
views share the same state. This is a Firdawsi reference flow, not a Misho
integration or a cloud-sync implementation.

## Religious connections and observable contracts

| Behaviour | Religious connection | Proposed application |
| --- | --- | --- |
| Capture and edit | [Bukhari 69](https://sunnah.com/bukhari:69), facilitation | Keep the draft and prior title available until a change is actually saved. |
| Completion | [Al-Hijr 15:46](https://quran.com/al-hijr/46), experiential inspiration from peace | Make completion visible and reversible, without confetti or sacred-text feedback. |
| Movement and week grouping | [Al-Insan 76:14](https://quran.com/al-insan/14), experiential inspiration from easy reach | Keep tasks and their destinations nearby, with an accessible select alternative to dragging. |
| Removal and undo | [An-Nisa 4:58](https://quran.com/an-nisa/58), fulfilling trusts | Make removal reversible through the next change; preserve prior state when persistence fails. |
| Recovery | [Al-Ahzab 33:70](https://quran.com/al-ahzab/70), truthful speech | Never report a failed write as saved; retry the pending operation without duplication. |
| Language and input modes | [Al-Isra 17:70](https://quran.com/al-isra/70), dignity | Provide native controls, independent Arabic copy, labelled states, and narrow layouts. |

These are design applications, not religious prescriptions for software. Jannah
passages remain experiential inspiration and never a claim to depict the unseen.

## Data and failure contract

- The existing storage key and legacy `id`, `title`, and `day` fields are retained.
  A missing completion field is interpreted as false without an automatic write.
  An explicitly malformed completion field blocks mutation, like other corrupt data.
- Mutations commit only after storage accepts the write. No account or network is
  involved; clearing browser data removes the local record.
- Failed edits retain the original task in the list and the revised text in the
  editor. Retry commits once; cancelling the pending change returns to editing.
- One editor is active at a time. Other task mutations wait until editing ends.
- Undo is one level deep, not a permanent history. It includes removal,
  completion, movement, and title changes; a successful new mutation replaces
  the previous undo point.
- Undo uses the same failure/retry path as other writes. A retried undo clears its
  undo point and announces the restored state only after storage succeeds.
- The simulation checkbox can fail any next mutation, including undo. The
  simulated failure must not alter the saved task set.
- This reference has no multi-tab conflict resolution, remote backup, multi-device
  synchronisation, authentication, scheduling engine, or prayer-time integration.

## Validation

Browser scenarios cover the full lifecycle, completion after reload, edit focus,
empty-title repair, failed-edit preservation and retry, week grouping and movement,
Arabic completion on a narrow screen, legacy-data compatibility, and failed undo.
Existing capture, corruption, recovery, and component-contract checks remain in place.

Real-product adoption, user studies, and broader manual accessibility review are
still required before treating this as a production planner.
