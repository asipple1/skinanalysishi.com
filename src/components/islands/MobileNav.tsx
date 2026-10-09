import { useState, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  navItems: NavItem[];
}

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="34" height="34" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function MobileNav({ navItems }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
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
      style={{ top: 'var(--header-h, 80px)' }}
      class="fixed inset-x-0 bottom-0 bg-ivory z-199 flex flex-col px-gutter pt-6 pb-10 overflow-y-auto"
    >
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
      <div class="mt-8 flex gap-7 items-center justify-center">
        <a
          href="https://www.instagram.com/skinanalysis_aesthetics/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          class="text-black opacity-90 hover:opacity-100 transition-opacity duration-200"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://www.youtube.com/@skinanalysisaesthetics"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          class="text-black opacity-90 hover:opacity-100 transition-opacity duration-200"
        >
          <YouTubeIcon />
        </a>
      </div>
    </nav>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        class="bg-transparent border border-taupe-line rounded-pill size-11 flex flex-col items-center justify-center gap-1.25 cursor-pointer"
      >
        {open ? (
          <span class="text-lg text-charcoal leading-none">×</span>
        ) : (
          <>
            <span class="w-4 h-[1.5px] bg-charcoal block" />
            <span class="w-4 h-[1.5px] bg-charcoal block" />
          </>
        )}
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
