import { useState } from 'preact/hooks';

interface Result {
  title: string;
  detail: string;
  tags: string[];
  image?: string;
}

interface Props {
  results: Result[];
  filters: string[];
}

export default function ResultsFilter({ results, filters }: Props) {
  const [active, setActive] = useState('All');

  const shown = results
    .filter((r) => active === 'All' || r.tags.includes(active))
    .slice(0, 4);

  return (
    <div>
      <div role="group" aria-label="Filter results" class="flex flex-wrap gap-x-7 gap-y-2 mb-10 pb-4 border-b border-taupe-line-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            aria-pressed={f === active}
            class={`bg-transparent border-0 p-0 cursor-pointer font-sans text-[14px] transition-colors duration-200 ${
              f === active
                ? 'text-charcoal font-medium underline underline-offset-4 decoration-1 decoration-charcoal'
                : 'text-ink-3 hover:text-charcoal'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div class="grid gap-[clamp(24px,2.4vw,36px)]" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))">
        {shown.map((r, i) => (
          <figure key={i} class="m-0 flex flex-col gap-3.5">
            <div class="aspect-4/3 rounded-sm overflow-hidden bg-ivory">
              {r.image ? (
                <img src={r.image} alt={r.title} class="w-full h-full object-contain" loading="lazy" />
              ) : (
                <div class="w-full h-full bg-sand flex items-center justify-center text-warm-muted text-[13px] text-center p-3">
                  {r.title}
                </div>
              )}
            </div>
            <figcaption class="flex justify-between gap-3 text-sm">
              <span class="font-serif text-[19px]">{r.title}</span>
              <span class="text-ink-3">{r.detail}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
