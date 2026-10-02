import { useState, useEffect } from 'preact/hooks';
import { addToCart } from '../../lib/cartStore';

const DOMAIN = import.meta.env.PUBLIC_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const ENDPOINT = `https://${DOMAIN}/api/2024-10/graphql.json`;

interface Variant {
  id: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string } | null;
  variants: { edges: { node: Variant }[] };
}

async function shopifyFetch(query: string) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const PRODUCTS_QUERY = `{
  products(first: 50) {
    edges {
      node {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText }
        variants(first: 1) {
          edges { node { id availableForSale price { amount currencyCode } } }
        }
      }
    }
  }
}`;

export default function ShopGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    shopifyFetch(PRODUCTS_QUERY)
      .then(data => {
        setProducts(data.products.edges.map((e: { node: Product }) => e.node));
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load products. Please refresh and try again.');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product, variant: Variant) => {
    setAdding(variant.id);
    addToCart({
      variantId: variant.id,
      title: product.title,
      price: variant.price.amount,
      image: product.featuredImage?.url ?? null,
      imageAlt: product.featuredImage?.altText ?? product.title,
    });
    setTimeout(() => setAdding(null), 600);
  };

  if (loading) {
    return (
      <div class="grid gap-[clamp(24px,2.4vw,36px)]" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))">
        {[...Array(6)].map((_, i) => (
          <div key={i} class="flex flex-col gap-4 border-t border-taupe-line pt-5 animate-pulse">
            <div class="aspect-4/5 bg-sand rounded-sm" />
            <div class="h-6 bg-sand rounded-sm w-3/4" />
            <div class="h-4 bg-sand rounded-sm w-full" />
            <div class="h-4 bg-sand rounded-sm w-1/3" />
            <div class="h-11 bg-sand rounded-pill w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p class="text-ink-3 py-10 text-center">{error}</p>;
  }

  return (
    <div class="grid gap-[clamp(24px,2.4vw,36px)]" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))">
      {products.map(p => {
        const variant = p.variants.edges[0]?.node;
        const price = parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2);
        return (
          <article key={p.id} class="flex flex-col gap-4 border-t border-taupe-line pt-5">
            <a href={`/shop/${p.handle}/`} class="block aspect-4/5 bg-sand rounded-sm overflow-hidden no-underline">
              {p.featuredImage ? (
                <img
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText ?? p.title}
                  class="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div class="w-full h-full flex items-center justify-center hover:bg-sand/80 transition-colors">
                  <span class="font-serif text-[18px] text-warm-muted text-center p-5">{p.title}</span>
                </div>
              )}
            </a>
            <a href={`/shop/${p.handle}/`} class="no-underline group">
              <h2 class="font-serif font-normal text-[22px] m-0 leading-tight text-charcoal group-hover:text-clay transition-colors">{p.title}</h2>
            </a>
            {p.description && (
              <p class="text-[15px] text-ink-3 m-0 line-clamp-2">{p.description}</p>
            )}
            <p class="text-[15px] font-medium text-charcoal m-0">${price}</p>
            {variant?.availableForSale ? (
              <button
                onClick={() => handleAddToCart(p, variant)}
                disabled={adding === variant.id}
                class="btn-primary mt-auto"
              >
                {adding === variant.id ? 'Added!' : 'Add to Cart'}
              </button>
            ) : (
              <span class="text-sm text-ink-3 mt-auto">Out of stock</span>
            )}
          </article>
        );
      })}
    </div>
  );
}
