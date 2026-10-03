import { useStore } from '@nanostores/preact';
import { cartItems, isCartOpen } from '../../lib/cartStore';

export default function CartButton() {
  const items = useStore(cartItems);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      onClick={() => isCartOpen.set(true)}
      aria-label={`Open cart${count > 0 ? `, ${count} item${count !== 1 ? 's' : ''}` : ''}`}
      class="relative flex items-center justify-center w-10 h-10 text-charcoal hover:text-olive transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span class="absolute -top-0.5 -right-0.5 bg-olive text-ivory text-[10px] font-medium w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
          {count}
        </span>
      )}
    </button>
  );
}
