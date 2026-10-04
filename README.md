# Skin Analysis Medical Spa — skinanalysishi.com

Astro 5 + Tailwind CSS v4 website for Skin Analysis Medical Spa (Ewa Beach + Aiea, Oʻahu). Headless Shopify for the skincare shop. Deployed on Netlify.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (static output) |
| Styling | Tailwind CSS v4 with `@theme` design tokens |
| Interactivity | Preact 10 (islands architecture) |
| State | nanostores (cart state, localStorage persisted) |
| E-commerce | Shopify Storefront API 2024-10 (headless) |
| Deployment | Netlify + `@astrojs/netlify` adapter |
| Fonts | Newsreader Variable (serif) + Hanken Grotesk (sans) |
| Images | Astro Image — `layout: constrained`, `responsiveStyles: true` |
| Schema | JSON-LD via `SchemaOrg.astro` — MedicalBusiness, Service, FAQPage, BlogPosting |
| SEO | `@astrojs/sitemap`, OG tags, `llms.txt`, `robots.txt` |

---

## Project Structure

```
skinanalysishi.com/
├── src/
│   ├── assets/                 # Source images (Astro-optimized)
│   │   ├── treaments/          # Treatment hero, secondary, before/after
│   │   ├── concerns/           # Concern page images
│   │   ├── journal/            # Article hero images
│   │   ├── providers/          # Provider headshots
│   │   └── site/               # Logo, team photo, shared images
│   ├── components/
│   │   ├── islands/            # Preact interactive components
│   │   └── sections/           # Astro section components
│   ├── content/
│   │   ├── treatments/         # Markdown — 9 treatments
│   │   ├── concerns/           # Markdown — 7 skin concerns
│   │   ├── journal/            # Markdown/MDX — 11 articles
│   │   └── providers/          # Markdown — 2 providers
│   ├── data/
│   │   ├── locations.json
│   │   ├── testimonials.json
│   │   └── skincare-brands.json
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── lib/
│   │   ├── shopify.ts          # Storefront API GraphQL queries
│   │   ├── cartStore.ts        # nanostores cart atom
│   │   └── images.ts           # Asset image resolver
│   ├── pages/
│   └── styles/
│       └── global.css          # Tailwind @theme tokens, fluid type scale
├── public/
│   ├── assets/                 # Static files served directly
│   ├── robots.txt
│   └── llms.txt
├── astro.config.mjs
├── netlify.toml
└── CLAUDE.md                   # AI contributor guide (image sizes, schemas, content)
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install & Run

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

### Environment Variables

Create a `.env` file at the project root:

```env
PUBLIC_SHOPIFY_DOMAIN=skin-analysis-2.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token_here
```

These are **public** variables (safe in client-side code). The Storefront token only allows read-products and create-carts.

---

## Pages & Routes

| Route | File | Description |
|---|---|---|
| `/` | `pages/index.astro` | Home — hero, concern explorer, featured treatments, providers, results, testimonials |
| `/treatments/` | `pages/treatments/index.astro` | Treatments grid with sticky concern filter |
| `/treatments/[slug]/` | `pages/treatments/[slug].astro` | Treatment detail — who-for, steps, before/after, pricing, FAQs |
| `/skin-concerns/[slug]/` | `pages/skin-concerns/[slug].astro` | Concern detail with linked treatments |
| `/journal/` | `pages/journal/index.astro` | Articles index |
| `/journal/[slug]/` | `pages/journal/[slug].astro` | Article detail (ArticleLayout) |
| `/shop/` | `pages/shop/index.astro` | Shopify product grid (Storefront API) |
| `/about/` | `pages/about.astro` | Brand story |
| `/contact/` | `pages/contact/index.astro` | Contact form + locations |
| `/specials/` | `pages/specials/index.astro` | Monthly specials |
| `/policies/` | `pages/policies.astro` | Privacy, shipping, terms |
| `/404` | `pages/404.astro` | Custom 404 |

**Redirects** (configured in `astro.config.mjs`):
- `/services` → `/treatments/`
- `/blog` → `/journal/`
- `/skincare` → `/shop/`

---

## Content Collections

All content lives in `src/content/` and is validated against Zod schemas defined in `src/content.config.ts`. See [CLAUDE.md](./CLAUDE.md) for the full guide on adding content, required fields, and image specifications.

### Treatments (`src/content/treatments/`)

9 treatment markdown files. Key fields: `title`, `category`, `pricing`, `concerns`, `expect`, `faqs`, `heroImage`, `beforeAfter`.

Categories available:
- `Facials + Resurfacing`
- `Collagen Induction`
- `Injectables`
- `Hair Removal`
- `Consultation`
- `Professional Skincare`
- `Light Therapy`

### Concerns (`src/content/concerns/`)

7 skin concern markdown files. Links treatments via slug array. Key fields: `title`, `order`, `intro`, `treatments`, `image`.

### Journal (`src/content/journal/`)

11 articles (`.md` or `.mdx`). Key fields: `title`, `description`, `category`, `pubDate`, `heroImage`, `relatedTreatments`.

Set `draft: true` to hide an article from production without deleting it.

### Providers (`src/content/providers/`)

2 provider profiles. Key fields: `name`, `credentials`, `role`, `summary`, `photo`, `order`.

---

## Design Tokens

Defined in `src/styles/global.css` using Tailwind v4 `@theme`:

**Colors:** `ivory`, `sand`, `sage`, `sage-light`, `charcoal`, `ink-2`, `ink-3`, `warm-muted`, `olive`

**Typography:**
- Serif: `font-serif` → Newsreader Variable
- Sans: `font-sans` → Hanken Grotesk

**Fluid type scale:** `text-display`, `text-h1-lg`, `text-h2-xl`, `text-h2-lg`, `text-h2-md`, `text-h2-sm`, `text-body-lg`

---

## Image Handling

Source images in `src/assets/` are processed by Astro's image pipeline (WebP/AVIF output, responsive srcsets). Images referenced as paths in frontmatter are resolved via `src/lib/images.ts`.

**Recommended sizes:** See [CLAUDE.md — Image Specifications](./CLAUDE.md#image-specifications).

---

## Shopify Integration

The shop at `/shop/` is a headless Shopify storefront:

1. **Product data** is fetched client-side via the Storefront API GraphQL (`src/lib/shopify.ts`)
2. **Cart state** lives in nanostores (`src/lib/cartStore.ts`), persisted to `localStorage` as `sa_cart`
3. **Checkout** redirects to Shopify's hosted checkout with the cart's `webUrl`

The `ShopGrid.tsx` island fetches products on first render (not at build time) — Shopify products do not require a rebuild when they change.

---

## Schema & SEO

- **MedicalBusiness + MedicalClinic** JSON-LD rendered in `BaseLayout.astro` for every page
- **Service** schema (with `Offer` objects) on every treatment detail page
- **FAQPage** schema built from the treatment's `faqs` array
- **BlogPosting** schema on journal articles
- **BreadcrumbList** on inner pages
- Sitemap auto-generated by `@astrojs/sitemap` (excludes `/shop/cart`)

---

## Deployment

Hosted on Netlify. The `netlify.toml` sets:

- Build command: `npm ci && npm run build`
- Publish dir: `dist/`
- Node 22
- Security headers: `X-Frame-Options`, `Content-Security-Policy`, `HSTS`
- Long cache on `/assets/*` (immutable, 1 year)

**Required Netlify env vars:**
- `PUBLIC_SHOPIFY_DOMAIN`
- `PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

---

## Contributing & Content Updates

See [CLAUDE.md](./CLAUDE.md) for a complete guide to:
- Adding/editing treatments
- Adding/editing skin concerns
- Publishing journal articles
- Updating pricing
- Image sizing requirements
- Schema and structured data

---

## Project Status

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the full roadmap, outstanding work, and implementation notes.
