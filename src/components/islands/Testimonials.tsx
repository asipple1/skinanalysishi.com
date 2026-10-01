import { useState } from 'preact/hooks';

interface Testimonial {
  text: string;
  name: string;
  detail: string;
}

interface Props {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: Props) {
  const [idx, setIdx] = useState(0);
  const q = testimonials[idx];
  const prev = () => setIdx((idx - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((idx + 1) % testimonials.length);

  return (
    <div class="max-w-275 mx-auto px-gutter py-[clamp(100px,12vw,180px)]">
      <h2 class="text-xs tracking-[0.22em] uppercase text-sage font-normal m-0 mb-12 font-sans">
        In their words
      </h2>
      <figure class="m-0 min-h-80 flex flex-col gap-10">
        <blockquote
          class="m-0 font-serif font-light text-[clamp(28px,3.6vw,50px)] leading-[1.2] tracking-[-0.015em]"
        >
          &ldquo;{q.text}&rdquo;
        </blockquote>
        <figcaption class="flex gap-4 items-baseline flex-wrap text-[15px] font-sans">
          <span class="font-medium">{q.name}</span>
          <span class="text-ink-3">{q.detail}</span>
        </figcaption>
      </figure>
      <div class="flex items-center gap-5 mt-12 border-t border-taupe-line pt-6">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          class="w-12 h-12 rounded-pill border border-taupe-line-2 bg-transparent cursor-pointer text-lg text-charcoal transition-all duration-250 hover:bg-charcoal hover:text-ivory hover:border-charcoal"
        >
          ←
        </button>
        <button
          onClick={next}
          aria-label="Next testimonial"
          class="w-12 h-12 rounded-pill border border-taupe-line-2 bg-transparent cursor-pointer text-lg text-charcoal transition-all duration-250 hover:bg-charcoal hover:text-ivory hover:border-charcoal"
        >
          →
        </button>
        <span class="text-sm text-ink-3 font-sans" style="font-variant-numeric:tabular-nums">
          {idx + 1} / {testimonials.length}
        </span>
      </div>
    </div>
  );
}
