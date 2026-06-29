import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: number;
  qty: number;
};

const KEY = "iron-step-cart";
const SAVED_KEY = "iron-step-saved";

type Listener = () => void;
const listeners = new Set<Listener>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  listeners.forEach((l) => l());
}

export function getCart(): CartItem[] {
  return read<CartItem[]>(KEY, []);
}

export function addToCart(item: Omit<CartItem, "id" | "qty"> & { qty?: number }) {
  const cart = getCart();
  const key = `${item.productId}-${item.size}`;
  const existing = cart.find((c) => c.id === key);
  if (existing) {
    existing.qty += item.qty ?? 1;
  } else {
    cart.push({ ...item, id: key, qty: item.qty ?? 1 });
  }
  write(KEY, cart);
}

export function updateQty(id: string, qty: number) {
  const cart = getCart()
    .map((c) => (c.id === id ? { ...c, qty } : c))
    .filter((c) => c.qty > 0);
  write(KEY, cart);
}

export function removeItem(id: string) {
  write(KEY, getCart().filter((c) => c.id !== id));
}

export function clearCart() {
  write(KEY, []);
}

export function getSaved(): string[] {
  return read<string[]>(SAVED_KEY, []);
}

export function toggleSaved(productId: string) {
  const list = getSaved();
  write(
    SAVED_KEY,
    list.includes(productId) ? list.filter((x) => x !== productId) : [...list, productId],
  );
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => {
      setCart(getCart());
      setSaved(getSaved());
    };
    sync();
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  return { cart, saved, subtotal, count };
}
