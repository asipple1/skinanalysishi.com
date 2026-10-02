import { atom } from 'nanostores';

export interface CartItem {
  variantId: string;
  title: string;
  price: string;
  quantity: number;
  image: string | null;
  imageAlt: string;
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem('sa_cart');
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('sa_cart', JSON.stringify(items)); } catch {}
}

const g = typeof window !== 'undefined' ? window : ({} as any);

if (!g.__cartItems) g.__cartItems = atom<CartItem[]>(loadCart());
if (!g.__isCartOpen) g.__isCartOpen = atom<boolean>(false);

export const cartItems: ReturnType<typeof atom<CartItem[]>> = g.__cartItems;
export const isCartOpen: ReturnType<typeof atom<boolean>> = g.__isCartOpen;

if (typeof window !== 'undefined') {
  cartItems.subscribe(saveCart);
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const current = cartItems.get();
  const existing = current.find(i => i.variantId === item.variantId);
  if (existing) {
    cartItems.set(current.map(i =>
      i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i
    ));
  } else {
    cartItems.set([...current, { ...item, quantity: 1 }]);
  }
  isCartOpen.set(true);
}

export function removeFromCart(variantId: string) {
  cartItems.set(cartItems.get().filter(i => i.variantId !== variantId));
}

export function updateQuantity(variantId: string, qty: number) {
  if (qty <= 0) { removeFromCart(variantId); return; }
  cartItems.set(cartItems.get().map(i =>
    i.variantId === variantId ? { ...i, quantity: qty } : i
  ));
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0).toFixed(2);
}
