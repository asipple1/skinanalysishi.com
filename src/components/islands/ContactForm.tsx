import { useState } from 'preact/hooks';

interface Props {
  treatments: { id: string; label: string }[];
  preselect?: string;
}

type ReachMethod = 'Email' | 'Phone call' | 'Text';
type Location = 'Ewa Beach' | 'Aiea';

export default function ContactForm({ treatments, preselect }: Props) {
  const [location, setLocation] = useState<Location>('Ewa Beach');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(preselect || '');
  const [message, setMessage] = useState('');
  const [reach, setReach] = useState<ReachMethod>('Email');
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameOk = name.trim().length >= 2;
  const emailOk = /^.+@.+\..+$/.test(email.trim());
  const valid = nameOk && emailOk;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setTried(true);
    if (!valid) return;
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      setSent(true);
    } catch {
      form.submit();
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
          We received your message and will reach out to you by {reach.toLowerCase()} within one business day
          {location === 'Ewa Beach' ? ' from our Ewa Beach studio' : ' from our Aiea studio'}.
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
        <p role="alert" class="text-sm text-clay m-0 px-4 py-3 border border-clay rounded-sm">
          Please add your name and a valid email so we can reach you.
        </p>
      )}

      {/* Location */}
      <div class="flex flex-col gap-2.5">
        <label class="text-[13px] text-ink-3 font-medium">Location</label>
        <div role="group" aria-label="Choose location" class="grid gap-2" style="grid-template-columns:1fr 1fr">
          {(['Ewa Beach', 'Aiea'] as Location[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              aria-pressed={location === loc}
              class={location === loc
                ? 'border border-charcoal bg-charcoal text-ivory rounded-sm p-3 text-sm cursor-pointer font-sans transition-all duration-250'
                : 'border border-taupe-line-2 bg-transparent text-charcoal rounded-sm p-3 text-sm cursor-pointer font-sans transition-all duration-250'}
            >
              {loc}
            </button>
          ))}
        </div>
        <input type="hidden" name="location" value={location} />
      </div>

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
            class={`border rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none transition-[border-color] duration-250 ${tried && !nameOk ? 'border-clay' : 'border-taupe-line-2'}`}
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
          class={`border rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none transition-[border-color] duration-250 ${tried && !emailOk ? 'border-clay' : 'border-taupe-line-2'}`}
        />
      </div>

      {/* Interest */}
      <div class="flex flex-col gap-2">
        <label for="contact-interest" class="text-[13px] text-ink-3 font-medium">I'm interested in</label>
        <select
          id="contact-interest"
          name="interest"
          value={interest}
          onChange={(e) => setInterest((e.target as HTMLSelectElement).value)}
          class="border border-taupe-line-2 rounded-sm px-3.5 py-3 text-[15px] font-sans bg-[#FAFAF8] outline-none appearance-none cursor-pointer"
        >
          <option value="">Not sure yet — consultation</option>
          {treatments.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
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
        <input type="hidden" name="reach" value={reach} />
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
