# Skin Analysis — Project Status

**Site:** skinanalysishi.com  
**Stack:** Astro 5 · Tailwind v4 · Preact islands · Netlify (assumed)  
**Locations:** Ewa Beach + Aiea, Oʻahu

---

## What's been built

### Design system
- `src/styles/global.css` — full `@theme` token set (colors, type scale, radius, spacing), `@layer base` for `a`/`button` resets, `@layer utilities` for layout helpers (`max-w-site`, `px-gutter`, `py-section-*`, `grid-auto-*`, `dl-grid`) and TSX-accessible CSS classes (`btn-primary`, `chip`, `chip-active`, `chip-inactive`)
- `src/components/Btn.astro` — unified button/link component, variants: `primary` (default) · `secondary` · `ghost` · `outline`, sizes: `sm` · `md` (default) · `lg`, `full` prop for full-width, renders `<a>` when `href` is set, `<button>` otherwise

### Layouts & components
- `BaseLayout.astro` — full HTML shell, org-level MedicalBusiness JSON-LD, reveal animation IntersectionObserver, skip link
- `ArticleLayout.astro` — reading progress bar, article body styles, related treatments, medical disclaimer, CTA
- `Header.astro` — sticky with announcement bar (smoothly collapses on scroll via `max-height` transition), blur backdrop, desktop nav, mobile hamburger hidden on desktop via CSS
- `Footer.astro` — 4-column grid: brand, Treatments, Learn, Contact

### Preact islands (`client:visible` / `client:media`)
| Island | What it does |
|---|---|
| `MobileNav.tsx` | Full-screen overlay via `createPortal` to `document.body` (avoids `backdrop-filter` stacking context bug), scrollbar-width compensation on open |
| `ConcernExplorer.tsx` | ARIA tablist/tabpanel, 7 concerns, arrow-key navigation, treatment chip links |
| `Testimonials.tsx` | Prev/next with counter |
| `ResultsFilter.tsx` | Filter before/after grid by tag chips |
| `ContactForm.tsx` | Location selector, validation, success state "Mahalo, {first}.", Netlify Forms compatible |

### Pages
| Route | File | Notes |
|---|---|---|
| `/` | `pages/index.astro` | 11 sections: hero, statement, concern explorer, featured treatments, approach, providers, results, testimonials, skincare, locations, final CTA |
| `/treatments/` | `pages/treatments/index.astro` | Sticky concern chip filter (JS-managed), treatment rows |
| `/treatments/[slug]/` | `pages/treatments/[slug].astro` | Full detail: hero, who-for, how-it-works, expect, before/after, pricing, FAQ with `<details>`, related treatments. MedicalProcedure + FAQPage + BreadcrumbList schema |
| `/journal/` | `pages/journal/index.astro` | Featured article + grid |
| `/journal/[slug]/` | `pages/journal/[slug].astro` | Uses ArticleLayout, BlogPosting schema |
| `/contact/` | `pages/contact/index.astro` | ContactForm island, "What happens next" steps, locations grid |
| `/shop/` | `pages/shop/index.astro` | **Static stub only** — shows brand cards from `skincare-brands.json`. Shopify integration is the next big task (see below) |
| `/skin-concerns/[slug]/` | `pages/skin-concerns/[slug].astro` | Concern detail with linked treatments |

### Content collections (`src/content/`)
- **treatments** (7): `chemical-peels`, `consultation`, `dermaplaning`, `diamondglow-facial`, `dysport`, `laser-hair-removal`, `skinpen-microneedling`
- **concerns** (7): acne-congestion, dull-or-dehydrated-skin, fine-lines-wrinkles, pigmentation-melasma, preventative-skin-health, texture-scarring, unwanted-hair
- **journal** (6): dermaplaning-myths, first-consultation, melasma-hawaii, microneedling-vs-peels, natural-dysport, routine-between-appointments
- **locations** (2 JSON): Ewa Beach, Aiea — loaded via `file()` loader, each item has `id` field
- **testimonials** (3 JSON): placeholder text, each item has `id` field
- **providers**: loaded via glob

### Local assets (`public/assets/`)
All images downloaded from Squarespace CDN and design handoff — no external CDN dependencies:
`hero-portrait.png`, `palm-shadow.png`, `consultation-hero.png`, `skinpen-hero.png`, `skinpen-secondary.png`, `skinpen-ba-acne.png`, `skinpen-ba-neck.png`, `chemical-peel-hero.jpeg`, `chemical-peel-ba-1..4.png`, `dysport-hero.jpeg`, `dysport-secondary.jpg`, `dysport-ba-1..3.png`, `dysport-design.jpg`, `dermaplaning-hero.jpeg`, `providers-team.jpg`, `skincare-products.png`

### Other
- `public/robots.txt` — allows all, disallows `/shop/cart`, references sitemap
- `public/favicon.svg` — dark square with serif "S"
- URL redirects in `astro.config.mjs` — old Squarespace paths (`/services`, `/blog`, `/our-approach`, etc.) redirect to new routes
- `nanostores` installed (ready for cart state when Shopify lands)

---

## What still needs doing

### High priority
- [ ] **Shopify integration** on `/shop/` — see full guide below
- [ ] **Real photography** — location card images are still placeholder color blocks; provider headshots are missing
- [ ] **Testimonial copy** — 3 entries are placeholder text, marked `"placeholder": true` in `src/data/testimonials.json`
- [ ] **Before/after photos** — `ResultsFilter` entries without `image` field silently skip the card; several entries in `index.astro` have no image yet
- [ ] **Accessibility audit** — `ally-review.md` referenced but review not yet done; focus on ConcernExplorer tab sequence, ResultsFilter live region, ContactForm error announcements
- [ ] **Favicon** — current SVG is a text placeholder; swap in actual logo mark once available

### Medium priority
- [ ] **Treatment content review** — pricing (`priceFrom`), FAQ entries, and `expect` steps in each treatment markdown file are placeholder copy
- [ ] **Provider data** — `src/content/providers/` needs real bios, headshots, credentials
- [ ] **Analytics** — no tracking installed yet; add Plausible or GA4 via `BaseLayout.astro` `<head>`
- [ ] **Netlify deploy config** — add `netlify.toml` with build command, publish dir, and form handling
- [ ] **Environment variables** — once Shopify is connected, `PUBLIC_SHOPIFY_DOMAIN` and `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` need to be set in Netlify UI
- [ ] **`design_handoff_skin_analysis_astro/`** — the original design handoff folder at the repo root can be deleted or gitignored once confirmed no longer needed

### Low priority / polish
- [ ] **OG image** — `BaseHead.astro` references a generic OG image; create a real one
- [ ] **404 page** — no custom 404 yet; add `src/pages/404.astro`
- [ ] **Location images** — slot real exterior/interior photos into location cards on `/contact/` and `/`
- [ ] **Treatments filter chip JS** — currently manipulates inline styles directly; could be refactored to class-toggling if chip CSS utilities are preferred (low priority, works fine now)

---

## Shopify integration — `/shop/` page

The `/shop/` page currently shows a static brand grid from `skincare-brands.json`. The goal is to replace it with real purchasable products pulled from a Shopify store via the **Storefront API** (headless). The site stays fully Astro/static — Shopify only handles cart and checkout.

### What we need from you before starting

1. **Shopify store domain** — the `.myshopify.com` URL, e.g. `skinanalysis.myshopify.com`
2. **Storefront API public access token** — create one in Shopify admin:
   - Go to **Settings → Apps and sales channels → Develop apps**
   - Create an app (e.g. "Skin Analysis Website")
   - Under **Storefront API**, enable these scopes:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_write_checkouts` (for cart → checkout)
   - Copy the **Storefront API access token** (starts with a long string, not the Admin API key)
3. **Collection handle** — the Shopify collection you want to display on `/shop/`, e.g. `skincare` or `all`. Find it under **Products → Collections → [collection name] → Search engine listing → URL handle**
4. **Decision: cart behavior**
   - **Option A — Redirect to Shopify checkout** (simpler): clicking "Add to Cart" opens the Shopify-hosted checkout. No on-site cart drawer. Recommended for launch.
   - **Option B — On-site cart drawer** (more work): a slide-out cart stays on the site, checkout still goes to Shopify. Can be added later.

### Step-by-step implementation

#### Step 1 — Environment variables

Create `.env` at the project root (never commit this file):
```
PUBLIC_SHOPIFY_DOMAIN=yourstore.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token_here
PUBLIC_SHOPIFY_COLLECTION=skincare
```

Add the same vars in the **Netlify dashboard** under Site → Environment variables.

#### Step 2 — Install Shopify client (optional but cleaner)

```bash
npm install @shopify/storefront-api-client
```

Or skip the package and use `fetch` directly — both work fine for a small catalog.

#### Step 3 — Create a Shopify fetch utility

Create `src/lib/shopify.ts`:
```ts
const domain = import.meta.env.PUBLIC_SHOPIFY_DOMAIN;
const token  = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const endpoint = `https://${domain}/api/2024-10/graphql.json`;

export async function shopifyFetch(query: string, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export const PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            featuredImage { url altText }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;
```

#### Step 4 — Create a Cart island

Create `src/components/islands/ShopGrid.tsx`. This island:
- Fetches products client-side on mount (keeps the page static)
- Shows a loading skeleton while fetching
- Renders product cards with "Add to Cart" / "Buy Now" that redirect to Shopify checkout

```tsx
import { useState, useEffect } from 'preact/hooks';

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string } | null;
  variants: { edges: { node: { id: string; availableForSale: boolean } }[] };
}

export default function ShopGrid({ collection }: { collection: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch from /api/products.json (see Step 5) or directly from Storefront API
    fetch(`/api/products.json?collection=${collection}`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  }, []);

  const buyNow = async (variantId: string) => {
    const domain = import.meta.env.PUBLIC_SHOPIFY_DOMAIN;
    const token  = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
    // Create a checkout and redirect
    const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: `mutation {
          cartCreate(input: { lines: [{ quantity: 1, merchandiseId: "${variantId}" }] }) {
            cart { checkoutUrl }
          }
        }`,
      }),
    });
    const { data } = await res.json();
    window.location.href = data.cartCreate.cart.checkoutUrl;
  };

  if (loading) return <div class="text-ink-3 py-20 text-center">Loading products…</div>;

  return (
    <div class="grid gap-8" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))">
      {products.map(p => {
        const variant = p.variants.edges[0]?.node;
        const price = parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2);
        return (
          <article key={p.id} class="flex flex-col gap-4">
            <div class="aspect-[4/5] rounded-sm overflow-hidden bg-sand">
              {p.featuredImage && (
                <img src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title}
                  class="w-full h-full object-cover" loading="lazy" />
              )}
            </div>
            <div class="flex flex-col gap-2">
              <h2 class="font-serif font-normal text-[22px] m-0">{p.title}</h2>
              <p class="text-[15px] text-ink-3 m-0">{p.description}</p>
              <p class="text-[15px] font-medium text-charcoal m-0">${price}</p>
            </div>
            {variant?.availableForSale ? (
              <button onClick={() => buyNow(variant.id)} class="btn-primary">
                Add to Cart
              </button>
            ) : (
              <span class="text-sm text-ink-3">Out of stock</span>
            )}
          </article>
        );
      })}
    </div>
  );
}
```

#### Step 5 — API endpoint for products (keeps token server-side)

Since `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` is a public token it's safe in client JS, but for cleanliness create `src/pages/api/products.json.ts` to proxy the fetch:

```ts
// src/pages/api/products.json.ts
import type { APIRoute } from 'astro';
import { shopifyFetch, PRODUCTS_QUERY } from '../../lib/shopify';

export const GET: APIRoute = async ({ url }) => {
  const collection = url.searchParams.get('collection') ?? 'all';
  const data = await shopifyFetch(PRODUCTS_QUERY, { handle: collection, first: 50 });
  const products = data.collection?.products.edges.map((e: { node: unknown }) => e.node) ?? [];
  return new Response(JSON.stringify(products), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

> **Note:** This requires changing `astro.config.mjs` output from `'static'` to `'hybrid'` so the API route can be server-rendered. Everything else stays static via `export const prerender = true` at the top of each page — or just switch to `output: 'server'` and add `export const prerender = true` to the pages you want static.

#### Step 6 — Update `/shop/index.astro`

Replace the static brand grid with the island:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ShopGrid from '../../components/islands/ShopGrid';
const collection = import.meta.env.PUBLIC_SHOPIFY_COLLECTION ?? 'all';
---
<BaseLayout title="Shop | Skin Analysis" ...>
  <!-- keep the existing hero text + sage CTA block -->
  <ShopGrid client:visible collection={collection} />
</BaseLayout>
```

#### Step 7 — Netlify config

Add `netlify.toml` to the repo root if not already present:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "public, max-age=300"
```

#### Step 8 — Test locally

```bash
npm run dev
# visit http://localhost:4321/shop/
```

Confirm products load, "Add to Cart" creates a Shopify cart and redirects to checkout.

---

## Key technical notes

- **Tailwind v4** — config is entirely in `src/styles/global.css` via `@theme`. No `tailwind.config.js`. Plugin is `@tailwindcss/vite` in `astro.config.mjs`.
- **rolldown binding** — `@rolldown/binding-darwin-arm64` is a direct dependency in `package.json` to work around an npm 10.x optional-deps bug on Apple Silicon. Do not remove it.
- **Preact islands** — use `class` (not `className`), import hooks from `preact/hooks`. `createPortal` from `preact/compat`.
- **Content collections** — use `glob()` loader for markdown, `file()` loader for JSON. JSON items via `file()` loader **must** have an `id` field.
- **Fonts** — self-hosted via Fontsource. Newsreader Variable (serif) + Hanken Grotesk (sans). Imported in `global.css`.
- **Netlify Forms** — `ContactForm.tsx` has `data-netlify="true"` and honeypot. Will work automatically on Netlify deploy.
- **Announcement bar** — collapses on scroll via `max-height` transition (not `display:none`, which caused a sticky-header glitch).
- **MobileNav overlay** — portalled to `document.body` to avoid `backdrop-filter` containing-block bug in Chromium/WebKit.
