const ENDPOINT = `https://${import.meta.env.PUBLIC_SHOPIFY_DOMAIN}/api/2024-10/graphql.json`;
const TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

export async function shopifyFetch<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export const ALL_PRODUCTS_QUERY = `{
  products(first: 100) {
    edges {
      node {
        handle title description vendor
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
}`;
