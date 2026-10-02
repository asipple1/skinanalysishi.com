import { useState } from 'preact/hooks';
import { addToCart } from '../../lib/cartStore';

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
}

interface Props {
  variants: Variant[];
  title: string;
  image: string | null;
  imageAlt: string;
}

export default function ProductAddToCart({ variants, title, image, imageAlt }: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '');
  const [added, setAdded] = useState(false);

  const selected = variants.find(v => v.id === selectedId) ?? variants[0];
  const hasMultiple = variants.length > 1 && variants.some(v => v.title !== 'Default Title');

  const handleAdd = () => {
    if (!selected?.availableForSale) return;
    addToCart({
      variantId: selected.id,
      title: hasMultiple ? `${title} — ${selected.title}` : title,
      price: selected.price.amount,
      image,
      imageAlt,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div class="flex flex-col gap-4">
      {hasMultiple && (
        <div class="flex flex-col gap-2">
          <label class="text-[13px] tracking-[0.08em] uppercase text-ink-3">Option</label>
          <div class="flex flex-wrap gap-2">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                disabled={!v.availableForSale}
                class={`px-4 py-2 text-[14px] border rounded-pill transition-colors ${
                  v.id === selectedId
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-transparent text-charcoal border-taupe-line hover:border-charcoal'
                } ${!v.availableForSale ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected?.availableForSale ? (
        <button onClick={handleAdd} class="btn-primary">
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      ) : (
        <button disabled class="btn-primary opacity-50 cursor-not-allowed">Out of Stock</button>
      )}
    </div>
  );
}
