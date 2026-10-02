import { useStore } from '@nanostores/preact';
import { createPortal } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { cartItems, isCartOpen, removeFromCart, updateQuantity, cartTotal } from '../../lib/cartStore';
import { shopifyFetch } from '../../lib/shopify';

async function checkout(items: ReturnType<typeof cartItems.get>) {
  const lines = items.map(i =>
    `{ quantity: ${i.quantity}, merchandiseId: "${i.variantId}" }`
  ).join(', ');
  const data: any = await shopifyFetch(`mutation {
    cartCreate(input: { lines: [${lines}] }) {
      cart { checkoutUrl }
    }
  }`);
  window.location.href = data.cartCreate.cart.checkoutUrl;
}

export default function CartDrawer() {
  const items = useStore(cartItems);
  const open = useStore(isCartOpen);
  const total = cartTotal(items);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => isCartOpen.set(false);

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        class={`fixed inset-0 bg-charcoal/40 z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <div
        class={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-ivory z-[61] flex flex-col shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div class="flex items-center justify-between px-6 py-5 border-b border-taupe-line">
          <span class="font-serif text-[22px] font-normal">Your Cart</span>
          <button onClick={close} aria-label="Close cart" class="text-ink-3 hover:text-charcoal transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 4l12 12M16 4L4 16" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {items.length === 0 ? (
            <p class="text-ink-3 text-[15px] py-8 text-center">Your cart is empty.</p>
          ) : items.map(item => (
            <div key={item.variantId} class="flex gap-4 border-b border-taupe-line pb-5">
              <div class="w-20 h-20 bg-sand rounded-sm shrink-0 overflow-hidden">
                {item.image
                  ? <img src={item.image} alt={item.imageAlt} class="w-full h-full object-cover" />
                  : <div class="w-full h-full flex items-center justify-center">
                      <span class="text-[10px] text-warm-muted text-center p-1">{item.title}</span>
                    </div>
                }
              </div>
              <div class="flex flex-col gap-1 flex-1 min-w-0">
                <p class="text-[15px] font-medium text-charcoal m-0 leading-tight">{item.title}</p>
                <p class="text-[14px] text-ink-3 m-0">${parseFloat(item.price).toFixed(2)}</p>
                <div class="flex items-center gap-3 mt-1">
                  <div class="flex items-center border border-taupe-line rounded-pill overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      class="px-3 py-1 text-ink-3 hover:text-charcoal transition-colors text-[16px] leading-none"
                      aria-label="Decrease quantity"
                    >−</button>
                    <span class="px-2 text-[14px] text-charcoal">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      class="px-3 py-1 text-ink-3 hover:text-charcoal transition-colors text-[16px] leading-none"
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    class="text-[13px] text-ink-3 hover:text-clay transition-colors underline"
                  >Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div class="px-6 py-5 border-t border-taupe-line flex flex-col gap-4">
            <div class="flex justify-between text-[15px]">
              <span class="text-ink-2">Subtotal</span>
              <span class="font-medium text-charcoal">${total}</span>
            </div>
            <p class="text-[13px] text-ink-3 m-0">Shipping and taxes calculated at checkout.</p>
            <button
              onClick={() => checkout(items)}
              class="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(drawer, document.body);
}
