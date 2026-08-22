# Cultural Safeguards

## Normative intent

These safeguards prevent sacred language, cultural heritage, and historically specific traditions from being flattened into decoration. They apply to manual design, code, templates, imported assets, and generative systems.

## Absolute prohibitions

The product MUST NOT use as decoration:

- Qur’anic verses or fragments;
- the names or attributes of God;
- the shahada;
- devotional formulas, invocations, blessings, or prayers;
- sacred or Qur’anic calligraphy;
- pseudo-Arabic marks intended to resemble sacred calligraphy;
- mirrored, scrambled, cropped, masked, outlined, fragmented, or illegibly small sacred text;
- text from religious architecture or objects detached from its source context.

“Decoration” includes backgrounds, borders, textures, logos, loading indicators, confetti, animation paths, skeletons, watermarks, data fills, masks, transitions, and purely atmospheric copy.

No exception may be granted merely because users cannot read Arabic, because the text is faint, or because a source image is public domain.

## Calligraphy and ordinary text

Calligraphy is writing, not an ornamental category without content. Before any Arabic-script artwork is considered, reviewers MUST document:

1. the exact transcription;
2. language and translation;
3. script identification if known;
4. author/calligrapher and source if known;
5. original function and context;
6. rights and permitted use;
7. review by a qualified Arabic reader and, for religious content, a relevant subject-matter expert.

Ordinary product text may be typographically expressive, but MUST remain correct, readable, selectable where appropriate, and semantically present. It MUST NOT imitate a historical calligraphic hand to create “authenticity.”

## Sacred and sensitive contexts

For Qur’an, prayer, mosque, pilgrimage, burial, charity, religious education, or devotional products:

- default to the neutral core and ornament density 0;
- consult domain experts and intended communities at concept stage, not only final review;
- separate navigation and utility text from scripture;
- preserve verified text, diacritics, verse markers, and reading order;
- prohibit truncation, automated paraphrase, uncontrolled line breaking, and decorative animation of scripture;
- define respectful handling for notifications, lock screens, error states, deletion, and offline caching;
- avoid placing sacred text in transient, dismissible, dirty, or physically inappropriate contexts without expert guidance.

This system alone is not sufficient to approve a sacred-content product.

## Historical care

### Use precise language

Prefer “Mamluk-period carved and inlaid woodwork in Cairo” over “ancient Islamic pattern.” Prefer “Safavid Iran” over “Persian” when the source and date support it. State uncertainty: “probably,” “attributed to,” “traditionally identified as,” or “date range” must survive into internal records.

### Do not universalize

- Islamic art is not universally nonfigural.
- Geometry does not have one fixed religious meaning across all places and periods.
- A color, star count, arch shape, or floral motif is not inherently pan-Islamic.
- “Arab,” “Arabic,” “Islamic,” “Middle Eastern,” “Persian,” “Turkish,” “South Asian,” and “Muslim” are not interchangeable.
- “Moorish” SHOULD be avoided as a catch-all; use Andalusi, Maghrebi, Nasrid, Marinid, or another evidenced term where possible.

### Separate visual categories

Every reference is tagged as one or more of:

- geometric;
- vegetal;
- calligraphic/epigraphic;
- figural;
- architectural;
- material/technical.

Tags describe what is present; they do not erase context. When categories coexist on an object, document their relationship instead of extracting one layer as free-floating ornament.

## No-blending rule

A production composition MUST use either:

- the universal geometry-first core, or
- exactly one named regional profile.

It MUST NOT blend profile-specific motifs, palettes, line treatments, or material cues. “Inspired by the Islamic world” is not an acceptable label for a composite. Cross-cultural influence may be discussed in research, but recreating such a relationship requires a narrowly scoped, expert-reviewed exception supported by specific objects and historical scholarship.

Shared geometric primitives do not themselves constitute blending. The profile-specific treatment—proportion, repeat family, palette, line, material reference, and vegetal vocabulary—is what must remain bounded.

## Review gates

### Gate 1 — intake

Record intended audience, context, profile, content sensitivity, source list, rights status, and whether generative tools are used.

### Gate 2 — classification

Classify visual categories and flag Arabic script, religious terms, sacred architecture, funerary objects, colonial-era collection histories, uncertain attributions, and living traditions.

### Gate 3 — expert review

At least one qualified reviewer examines historically specific production work. Arabic text requires a fluent reviewer; sacred content requires a religious-domain reviewer; a regional authenticity claim requires expertise in that region and period.

### Gate 4 — community review

For identity-facing or religious products, test with people from intended communities. A single reviewer does not represent a whole community.

### Gate 5 — release record

Store approvals, unresolved limitations, source links, licenses, transformations, profile version, and date. Public claims must not exceed the evidence.

## Generative-system controls

Prompts and generation APIs MUST:

- forbid sacred text and text-like glyph generation in ornament;
- require profile selection or universal-core mode;
- block profile mixing;
- output provenance metadata and generation parameters;
- prefer deterministic geometric construction over style imitation;
- flag unknown inscriptions or text-like output for rejection, not inference;
- support a no-ornament mode;
- never claim authenticity automatically.

Generated output containing legible or suspected Arabic-script forms is quarantined until reviewed. A model’s translation or assurance is not adequate verification.

## Claims and naming

Allowed:

- “Uses a contemporary geometry-first system.”
- “The divider’s construction was studied against [specific source], then independently redrawn.”
- “Profile: Ottoman, research draft; expert review pending.”

Disallowed without strong, documented review:

- “authentic Islamic design”;
- “Qur’an-inspired pattern”;
- “sacred geometry”;
- “traditional Muslim colors”;
- “faithful Mamluk/Ottoman/Persian style”;
- “AI-reconstructed historical pattern.”

## Incident response

If sacred or misidentified content reaches production:

1. remove or disable the asset promptly;
2. preserve the internal audit trail without redistributing the asset;
3. notify cultural, content, legal, and product owners;
4. obtain qualified review;
5. correct public descriptions and cached derivatives;
6. document the root cause and update prompt, review, and source controls.

The response should be factual and accountable, not defensive.

