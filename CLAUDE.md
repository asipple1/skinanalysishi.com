# Skin Analysis — AI Contributor Guide

This file is for AI agents (Claude Code, etc.) and human contributors adding or editing content on skinanalysishi.com. It covers content schemas, image specifications, pricing updates, and structured data.

---

## Project overview

Astro 5 static site. Content lives in `src/content/` as Markdown files validated against Zod schemas in `src/content.config.ts`. Images live in `src/assets/` (Astro-optimized) or are referenced as `/assets/` public paths in frontmatter.

Always validate changes with `npm run build` before committing.

---

## Adding a Treatment

### 1. Create the markdown file

```
src/content/treatments/your-treatment-slug.md
```

Slug rules: lowercase, hyphens only, no spaces (e.g. `laser-resurfacing.md`).

### 2. Copy this frontmatter template

```yaml
---
title: "Treatment Full Name"
shortName: "Short Name"          # Used in nav, cards — keep under ~24 chars
seoTitle: "Treatment on Oʻahu | Skin Analysis Medical Spa, Ewa Beach + Aiea"
metaDescription: "155–160 character meta description. Include location (Ewa Beach / Aiea / Oʻahu), the treatment name, and a key benefit."
category: "Collagen Induction"   # See valid values below
benefit: "One-sentence benefit shown on cards."
summary: "2–3 sentence plain-English explanation shown on the treatments index."
time: "60–75 min"
downtime: "1–2 days"
resultsAppear: "4–6 weeks"
typicalPlan: "Series of 3, 4 weeks apart"

# PRICING — see the Pricing section below for format rules
priceFrom: "$500 full face"
pricing:
  - label: "Full face"
    value: "$500"
  - label: "Face + neck"
    value: "$600"

# Concern slugs — must match existing files in src/content/concerns/
concerns: ["texture-scarring", "fine-lines-wrinkles"]

whoFor: "Who is a good candidate. Who is not. 2–3 sentences."
howItWorks: "Clinical mechanism, plain English. 2–3 sentences."

# expect — minimum 1 step; typical pattern is Before / During / After
expect:
  - step: "Before"
    text: "Preparation instructions."
  - step: "During"
    text: "What the client experiences."
  - step: "After"
    text: "Recovery, home care, what to expect."

faqs:
  - q: "Question?"
    a: "Full answer. Write conversationally, first-person plural (we/our)."

# Optional — add only if you have real before/after images
beforeAfter:
  - image: "/assets/treaments/your-treatment-slug/ba-photo-1.jpg"
    caption: "Concern, after X sessions"

# Optional
realResultsHeadline: "Real results from our clients"

# Must be slugs of existing treatments (max 3)
related: ["skinpen-microneedling", "chemical-peels", "diamondglow-facial"]

# Optional — attribute to a provider
providerNote:
  provider: "Sarah Lockwood-Sepulveda, FNP-BC"
  quote: "Short quote about this treatment."

heroImage: "/assets/treaments/your-treatment-slug/hero.jpg"
secondaryImage: "/assets/treaments/your-treatment-slug/secondary.jpg"
featured: false    # Set true to appear in the home page featured grid
order: 10          # Lower = appears first in sorted lists
---

Long-form treatment body content goes here (optional — page renders fine without it).
```

### Valid `category` values

```
Facials + Resurfacing
Collagen Induction
Injectables
Hair Removal
Consultation
Professional Skincare
Light Therapy
```

### 3. Add images

Place images in `src/assets/treaments/your-treatment-slug/` (note: the existing directory has the typo `treaments` — match it exactly to avoid breaking the image resolver).

| Image | Size | Format | Notes |
|---|---|---|---|
| `hero.jpg` | **1440 × 960 px** | JPEG, 80–85% quality | Full-width hero, 3:2 ratio. Subject in left or center third. |
| `secondary.jpg` | **800 × 800 px** | JPEG, 80% quality | Square or near-square. Used in detail page secondary slot. |
| Before/after photos | **800 × 1000 px** | JPEG or PNG | Portrait orientation, consistent crop. Pair consistently (same angle, same lighting). |

### 4. Link the treatment to concerns

Open the relevant concern file(s) in `src/content/concerns/` and add the treatment slug to the `treatments` array:

```yaml
treatments: ["diamondglow-facial", "chemical-peels", "your-treatment-slug"]
```

---

## Editing a Treatment

Open `src/content/treatments/<slug>.md` and edit the frontmatter fields. The most commonly updated fields are:

- `pricing` / `priceFrom` — see Pricing section below
- `faqs` — add/remove/rewrite Q&As
- `expect` — update pre/post care instructions
- `beforeAfter` — add new before/after photos
- `related` — update cross-links

After editing, run `npm run build` to catch any schema validation errors.

---

## Pricing — How to Update

Prices live entirely in the treatment's markdown frontmatter. There is no separate pricing database.

### Format rules

```yaml
priceFrom: "$500 full face"   # Shown on cards — short label + price
pricing:
  - label: "Full face"
    value: "$500"
  - label: "Face + neck"
    value: "$600"
  - label: "Add-on: exosomes"
    value: "+$150"
  - label: "Series of 3"
    value: "Ask about series pricing"   # Free text is fine when not a fixed price
```

`value` can be:
- A dollar amount: `"$500"` or `"$15 / unit"`
- A range: `"$200–$400"`
- Free text: `"Starting at $250"` or `"Ask about series pricing"`

The schema renderer extracts numeric values from `value` strings to populate `schema.org/Offer` — dollar amounts preceded by `$` are parsed automatically. Free-text values are still included in the schema as `priceSpecification.description`.

### Updating Dysport / injectable unit pricing

Dysport unit price is set in `src/content/treatments/dysport.md`. The `priceFrom` field shows on cards; the `pricing` array is the detail table:

```yaml
priceFrom: "$15 / unit"
pricing:
  - label: "Price per unit"
    value: "$15 / unit"
  - label: "Forehead (approx.)"
    value: "30–50 units"
  - label: "Glabella (approx.)"
    value: "50–70 units"
```

---

## Adding a Skin Concern

### 1. Create the markdown file

```
src/content/concerns/your-concern-slug.md
```

### 2. Frontmatter template

```yaml
---
title: "Concern Display Name"
order: 8                          # Controls sort order on the concerns page
seoTitle: "Concern name on Oʻahu | Skin Analysis"
metaDescription: "155–160 char meta. Include location and key treatments."
intro: "1–2 sentence intro shown in the concern explorer and concern cards."
treatments: ["treatment-slug-1", "treatment-slug-2"]   # Must be valid treatment slugs
image: "/assets/concerns/your-concern-slug.png"
---

<!-- Optional long-form body: explain the concern (causes, types), then introduce treatments. -->
```

### 3. Add the concern image

Place in `src/assets/concerns/`:

| Image | Size | Format | Notes |
|---|---|---|---|
| `your-concern-slug.png` | **640 × 640 px** | PNG or JPEG | Square. Skin-focused, clean background. |

### 4. Add the concern slug to relevant treatments

Open each treatment that applies and add this concern's slug to its `concerns` array.

---

## Publishing a Journal Article

### 1. Create the file

```
src/content/journal/your-article-slug.md
```

Use `.mdx` only if you need interactive components inside the article.

### 2. Frontmatter template

```yaml
---
title: "Article title — sentence case, conversational"
description: "155–160 char meta description. First sentence of the article, essentially."
category: "Treatments"         # See valid values below
pubDate: "2024-03-15"          # ISO 8601 date (YYYY-MM-DD)
updatedDate: "2024-04-01"      # Optional — show if significantly revised
author: "sarah-lockwood-sepulveda"   # Must match a provider slug in src/content/providers/
readingTime: "4 min read"
heroImage: "/assets/journal/your-article-slug-1200x800.jpg"
relatedTreatments: ["skinpen-microneedling"]   # Optional; shown at end of article
draft: false                   # Set true to hide without deleting
---

Article body in Markdown...
```

### Valid `category` values

```
Treatments
Skin Health
Ingredients
Lifestyle
Practice News
```

### 3. Add the hero image

Place in `src/assets/journal/`:

| Image | Size | Format | Notes |
|---|---|---|---|
| Hero | **1200 × 800 px** | JPEG, 80–85% quality | 3:2 ratio, full-bleed. Skin-focused or abstract. No faces without a release. |

### Writing style

- First-person plural: *we*, *our*, *us* (not "the practice" or third person)
- Conversational but clinical — no fluff, no hype
- Headings as `##` (H2); subheadings as `###`
- Use `>` blockquotes for key takeaways
- No markdown tables unless genuinely tabular data
- End with a soft CTA pointing readers to book a consultation

---

## Updating Provider Profiles

Provider files: `src/content/providers/<slug>.md`

```yaml
---
name: "Sarah Lockwood-Sepulveda"
credentials: "FNP-BC"
role: "Nurse Practitioner"
summary: "2–3 sentence bio. Focus on clinical background and approach."
photo: "/assets/providers/sarah-lockwood-sepulveda.jpg"
order: 1
---
```

### Provider headshot specs

| Image | Size | Format | Notes |
|---|---|---|---|
| Headshot | **600 × 750 px** | JPEG, 85% quality | Portrait 4:5. Neutral background. Professional but approachable. |

---

## Image Specifications — Full Reference

| Use case | Dimensions | Format | Quality | Notes |
|---|---|---|---|---|
| Treatment hero | 1440 × 960 px | JPEG | 80–85% | 3:2, full-bleed |
| Treatment secondary | 800 × 800 px | JPEG | 80% | Square |
| Treatment before/after | 800 × 1000 px | JPEG or PNG | 85% | Portrait, consistent crop across pairs |
| Concern | 640 × 640 px | PNG or JPEG | 80% | Square, skin-focused |
| Journal hero | 1200 × 800 px | JPEG | 80–85% | 3:2, full-bleed |
| Provider headshot | 600 × 750 px | JPEG | 85% | Portrait 4:5 |
| OG / social share | 1200 × 630 px | JPEG or PNG | 85% | Per page (generate from hero) |
| Site logo | SVG preferred | SVG | — | Fallback: 400 × 120 px PNG |

**General rules:**
- Run all JPEGs through Squoosh or ImageOptim before committing — target under 200 KB for hero images, under 100 KB for thumbnails.
- Astro's image pipeline generates WebP/AVIF output and responsive srcsets automatically from `src/assets/` — you do not need to manually create multiple sizes.
- Images referenced as `/assets/` paths in frontmatter (e.g. `heroImage: "/assets/treaments/..."`) are served from `public/assets/` and are **not** processed by Astro — optimize these manually before adding them.

---

## Schema.org / Structured Data

Schema is generated automatically from content — you do not write JSON-LD by hand. Here is what each content type produces:

### Treatment pages

The `[slug].astro` template generates:
- `MedicalProcedure` or `Service` schema from treatment frontmatter
- `Offer` objects from the `pricing` array — `priceFrom` string is parsed for a numeric `price`; `priceCurrency` defaults to `USD`
- `FAQPage` from the `faqs` array

**To add a new pricing tier** — add an entry to the `pricing` array; schema updates automatically on the next build.

**To add a FAQ to schema** — add an entry to the `faqs` array; it appears on-page in `<details>` elements and in the JSON-LD `FAQPage` block.

### Journal articles

`ArticleLayout.astro` generates a `BlogPosting` schema using `title`, `description`, `pubDate`, `updatedDate`, `author`, and `heroImage`.

### Organization-level schema

`BaseLayout.astro` renders a `MedicalBusiness` + `MedicalClinic` JSON-LD on every page. Location data comes from `src/data/locations.json`. To update business name, phone, or address — edit `locations.json`.

---

## Locations Data

`src/data/locations.json` — array of location objects:

```json
{
  "id": "ewa-beach",
  "name": "Ewa Beach",
  "tag": "Main Location",
  "streetAddress": "91-590 Farrington Hwy, Suite 201",
  "locality": "Ewa Beach",
  "region": "HI",
  "country": "US",
  "phone": "(808) 555-0100",
  "tel": "+18085550100",
  "mapUrl": "https://maps.google.com/?q=...",
  "appointments": "https://booking.url",
  "main": true
}
```

Set `"main": true` on the primary location (used for org-level schema).

---

## Testimonials Data

`src/data/testimonials.json` — array of testimonial objects:

```json
{
  "id": "amanda-mcdonald",
  "text": "Full testimonial text...",
  "name": "Amanda M.",
  "detail": "DiamondGlow client",
  "placeholder": false
}
```

Set `"placeholder": true` on entries that are not yet real — they are filtered out in production rendering.

---

## Specials Page

`src/pages/specials/index.astro` has a `specials` array at the top of the file. Add entries directly:

```typescript
const specials = [
  {
    title: "October Skin Reset",
    description: "15% off SkinPen microneedling series bookings in October.",
    expires: "2024-10-31",
    treatment: "skinpen-microneedling",   // optional — links to treatment page
  },
];
```

Remove entries when they expire.

---

## Common Tasks Checklist

### Launch a new treatment

- [ ] Create `src/content/treatments/<slug>.md` with all required frontmatter
- [ ] Add hero image (`1440 × 960 px`) to `src/assets/treaments/<slug>/`
- [ ] Add secondary image (`800 × 800 px`) to same directory
- [ ] Add concern slugs to `concerns` array in treatment frontmatter
- [ ] Add treatment slug to `treatments` array in relevant concern files
- [ ] Set `featured: true` if it should appear on the home page grid
- [ ] Run `npm run build` — fix any schema errors before committing

### Add before/after photos

- [ ] Save image to `public/assets/treaments/<slug>/` (these are served directly, optimize first)
- [ ] Add entry to `beforeAfter` array in treatment frontmatter
- [ ] Recommended size: `800 × 1000 px`, JPEG, under 150 KB

### Update a price

- [ ] Open `src/content/treatments/<slug>.md`
- [ ] Update `priceFrom` (card display) and the matching entry in the `pricing` array
- [ ] Run `npm run build` to verify schema output

### Publish a journal article

- [ ] Create `src/content/journal/<slug>.md` with all required frontmatter
- [ ] Set `draft: false` when ready to publish
- [ ] Add hero image (`1200 × 800 px`) to `src/assets/journal/`
- [ ] Link `relatedTreatments` slugs if applicable

### Add a skin concern

- [ ] Create `src/content/concerns/<slug>.md`
- [ ] Add concern image (`640 × 640 px`) to `src/assets/concerns/`
- [ ] Link relevant treatment slugs in `treatments` array
- [ ] Add this concern's slug to each linked treatment's `concerns` array

---

## Validation & Build

```bash
npm run build      # Full production build — catches all schema/type errors
npm run dev        # Dev server with hot reload — good for iterating on content
```

Schema errors from Zod will surface as build-time errors with the field name and constraint. Fix the frontmatter, then rebuild.
