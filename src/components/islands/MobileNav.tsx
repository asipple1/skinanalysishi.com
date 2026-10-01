import { useState, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  navItems: NavItem[];
}

export default function MobileNav({ navItems }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      return;
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const overlay = open && mounted ? (
    <nav
      aria-label="Mobile"
      class="fixed inset-0 bg-ivory z-200 flex flex-col px-gutter py-6 overflow-y-auto"
    >
      <div class="flex justify-end mb-6">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          class="size-11 rounded-pill border border-taupe-line bg-transparent cursor-pointer text-lg text-charcoal shrink-0"
        >
          ×
        </button>
      </div>
      {navItems.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          onClick={() => setOpen(false)}
          class="font-serif text-[30px] py-3.5 border-b border-sand text-charcoal no-underline"
        >
          {label}
        </a>
      ))}
      <a
        href="/contact/"
        onClick={() => setOpen(false)}
        class="mt-8 bg-charcoal text-ivory px-7.5 py-4.25 rounded-pill text-[15px] font-medium no-underline text-center"
      >
        Book an Appointment
      </a>
    </nav>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Menu"
        class="bg-transparent border border-taupe-line rounded-pill size-11 flex flex-col items-center justify-center gap-1.25 cursor-pointer"
      >
        <span class="w-4 h-[1.5px] bg-charcoal block" />
        <span class="w-4 h-[1.5px] bg-charcoal block" />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
