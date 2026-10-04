import { useState, useEffect, useRef } from 'preact/hooks';

interface Props {
  treatments: { id: string; label: string }[];
  preselect?: string;
}

type ReachMethod = 'Email' | 'Phone call' | 'Text';

function TreatmentDropdown({
  treatments,
  interests,
  onToggle,
}: {
  treatments: { id: string; label: string }[];
  interests: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const count = interests.size;
  const label =
    count === 0
      ? 'Not sure yet — consultation'
      : count === 1
      ? treatments.find((t) => interests.has(t.id))?.label ?? `${count} selected`
      : `${count} treatments selected`;

  return (
    <div ref={ref} class="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        class="w-full flex items-center justify-between border border-taupe-line-2 rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] text-left cursor-pointer transition-[border-color] duration-250 hover:border-charcoal"
      >
        <span class={count === 0 ? 'text-ink-3' : 'text-charcoal'}>{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class={`text-ink-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          class="absolute z-20 top-[calc(100%+4px)] left-0 right-0 bg-white border border-taupe-line-2 rounded-sm shadow-lg py-1 max-h-64 overflow-y-auto"
        >
          {treatments.map((t) => {
            const checked = interests.has(t.id);
            return (
              <label
                key={t.id}
                class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-sand transition-colors duration-150 text-[15px]"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={t.id}
                  checked={checked}
                  onChange={() => onToggle(t.id)}
                  class="w-4 h-4 accent-charcoal shrink-0"
                />
                <span>{t.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ContactForm({ treatments, preselect }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<Set<string>>(
    preselect ? new Set([preselect]) : new Set()
  );
  const [message, setMessage] = useState('');
  const [reach, setReach] = useState<ReachMethod>('Email');
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameOk = name.trim().length >= 2;
  const emailOk = /^.+@.+\..+$/.test(email.trim());
  const valid = nameOk && emailOk;

  const toggleInterest = (id: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setTried(true);
    if (!valid) return;
    setLoading(true);

    const params = new URLSearchParams();
    params.set('form-name', 'contact');
    params.set('name', name);
    params.set('phone', phone);
    params.set('email', email);
    params.set('message', message);
    params.set('reach', reach);
    interests.forEach((id) => params.append('interests', id));

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      setSent(true);
    } catch {
      (e.target as HTMLFormElement).submit();
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    const first = name.trim().split(' ')[0];
    return (
      <div class="bg-white p-[clamp(32px,4vw,56px)] rounded-sm flex flex-col gap-5">
        <h2 class="font-serif font-light text-[clamp(36px,4vw,52px)] leading-[1.05] m-0">
          Mahalo, {first}.
        </h2>
        <p class="text-base leading-[1.65] text-ink-2 m-0">
          We received your message and will reach out to you by {reach.toLowerCase()} within one business day.
        </p>
        <p class="text-[13px] text-ink-3 m-0">
          This form is not a secure messaging system. Please do not submit protected health information.
        </p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      class="bg-white p-[clamp(32px,4vw,56px)] rounded-sm flex flex-col gap-6"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p class="hidden"><label>Don't fill this out: <input name="bot-field" /></label></p>

      {tried && !valid && (
        <p role="alert" class="text-sm text-olive m-0 px-4 py-3 border border-olive rounded-sm">
          Please add your name and a valid email so we can reach you.
        </p>
      )}

      {/* Name + Phone */}
      <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))">
        <div class="flex flex-col gap-2">
          <label for="contact-name" class="text-[13px] text-ink-3 font-medium">Full name *</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            required
            autocomplete="name"
            class={`border rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none transition-[border-color] duration-250 ${tried && !nameOk ? 'border-olive' : 'border-taupe-line-2'}`}
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="contact-phone" class="text-[13px] text-ink-3 font-medium">Phone</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={phone}
            onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
            autocomplete="tel"
            class="border border-taupe-line-2 rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none transition-[border-color] duration-250"
          />
        </div>
      </div>

      {/* Email */}
      <div class="flex flex-col gap-2">
        <label for="contact-email" class="text-[13px] text-ink-3 font-medium">Email *</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
          autocomplete="email"
          class={`border rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none transition-[border-color] duration-250 ${tried && !emailOk ? 'border-olive' : 'border-taupe-line-2'}`}
        />
      </div>

      {/* Interests dropdown */}
      <div class="flex flex-col gap-2">
        <label class="text-[13px] text-ink-3 font-medium">I'm interested in</label>
        <TreatmentDropdown
          treatments={treatments}
          interests={interests}
          onToggle={toggleInterest}
        />
      </div>

      {/* Message */}
      <div class="flex flex-col gap-2">
        <label for="contact-message" class="text-[13px] text-ink-3 font-medium">Message (optional)</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          class="border border-taupe-line-2 rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none resize-y transition-[border-color] duration-250"
        />
      </div>

      {/* Best way to reach */}
      <div class="flex flex-col gap-2.5">
        <label class="text-[13px] text-ink-3 font-medium">Best way to reach you</label>
        <div class="flex flex-wrap gap-2">
          {(['Email', 'Phone call', 'Text'] as ReachMethod[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setReach(m)}
              aria-pressed={reach === m}
              class={reach === m ? 'chip chip-active' : 'chip chip-inactive'}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn btn-primary btn-md w-full justify-center"
      >
        {loading ? 'Sending…' : 'Send message'}
      </button>

      <p class="text-xs leading-normal text-ink-3 m-0 text-center">
        This form is not a secure messaging system. Do not submit protected health information. We'll respond within one business day.
      </p>
    </form>
  );
}
