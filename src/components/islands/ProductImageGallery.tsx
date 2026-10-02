import { useState } from 'preact/hooks';

interface ShopifyImage {
  url: string;
  altText: string | null;
}

export default function ProductImageGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div class="flex flex-col gap-3">
      <div class="aspect-square bg-sand rounded-sm overflow-hidden">
        {main ? (
          <img
            src={main.url}
            alt={main.altText ?? title}
            class="w-full h-full object-cover"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center">
            <span class="font-serif text-[24px] text-warm-muted text-center p-8">{title}</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div class="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              class={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                i === active ? 'border-charcoal' : 'border-transparent hover:border-taupe-line'
              }`}
            >
              <img src={img.url} alt={img.altText ?? title} class="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
