import { useState } from 'preact/hooks';

interface Concern {
  name: string;
  slug: string;
  body: string;
  treatments: string[];
  treatmentSlugs: string[];
  image?: string;
  link: string;
}

interface Props {
  concerns: Concern[];
  initialIndex?: number;
}

export default function ConcernExplorer({ concerns, initialIndex = 0 }: Props) {
  const [active, setActive] = useState(initialIndex);
  const c = concerns[active];

  const handleKey = (e: KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((active + 1) % concerns.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((active - 1 + concerns.length) % concerns.length);
    }
  };

  return (
    <div class="grid grid-auto-lg gap-[clamp(32px,5vw,80px)] items-start">
      {/* Tab list */}
      <div role="tablist" aria-label="Skin concerns" class="flex flex-col border-t border-taupe-line">
        {concerns.map((item, i) => (
          <button
            key={item.slug}
            role="tab"
            aria-selected={i === active}
            aria-controls={`concern-panel-${item.slug}`}
            id={`concern-tab-${item.slug}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => handleKey(e as unknown as KeyboardEvent, i)}
            class={`bg-transparent border-0 border-b border-taupe-line py-5 flex items-baseline gap-5 cursor-pointer text-left transition-colors duration-250 ${i === active ? 'text-charcoal pl-3' : 'text-warm-muted pl-0 hover:text-charcoal'}`}
          >
            <span class="text-xs tracking-widest font-variant-numeric w-5.5 shrink-0" style="font-variant-numeric:tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span class="font-serif text-[clamp(24px,2.4vw,34px)] font-light leading-[1.1] flex-1">
              {item.name}
            </span>
            <span aria-hidden="true" class={`text-lg transition-opacity duration-250 ${i === active ? 'opacity-100' : 'opacity-0'}`}>→</span>
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        id={`concern-panel-${c.slug}`}
        role="tabpanel"
        aria-labelledby={`concern-tab-${c.slug}`}
        class="flex flex-col gap-7"
      >
        <div class="aspect-16/10 rounded-sm overflow-hidden bg-sand">
          {c.image ? (
            <img src={c.image} alt={c.name} class="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div class="w-full h-full bg-sand flex items-center justify-center text-warm-muted text-sm">
              {c.name}
            </div>
          )}
        </div>
        <div class="flex flex-col gap-4.5">
          <h3 class="font-serif font-normal text-[clamp(28px,2.6vw,38px)] leading-[1.1] m-0 tracking-[-0.01em]">
            {c.name}
          </h3>
          <p class="text-[17px] leading-[1.65] text-ink-2 m-0">{c.body}</p>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-xs tracking-[0.18em] uppercase text-ink-3">Treatments that may help</span>
          <div class="flex flex-wrap gap-2.5">
            {c.treatments.map((t, ti) => (
              <a
                key={t}
                href={`/treatments/${c.treatmentSlugs[ti] ?? t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`}
                class="chip chip-inactive"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
        <a
          href={c.link}
          class="text-[15px] font-medium text-charcoal flex gap-2 items-center no-underline border-b border-taupe-line pb-5 transition-colors duration-250 hover:text-clay"
        >
          Explore {c.name.toLowerCase()} treatment on Oʻahu <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
