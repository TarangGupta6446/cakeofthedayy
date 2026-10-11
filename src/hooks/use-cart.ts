import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // unique line id
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantId: string | null;
  variantLabel: string | null;
  unitPrice: number;
  qty: number;
  customMessage?: string;
  occasion?: string;
  addons?: { id: string; name: string; price: number }[];
};


type CartState = {
  items: CartItem[];
  promoCode: string | null;
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setPromo: (code: string | null) => void;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      add: (item) =>
        set((s) => {
          const lineKey = `${item.productId}-${item.variantId ?? "default"}-${item.occasion ?? ""}-${item.customMessage ?? ""}`;
          const existing = s.items.find((i) => i.id === lineKey);
          if (existing) {
            return {
              items: s.items.map((i) => (i.id === lineKey ? { ...i, qty: i.qty + item.qty } : i)),
            };
          }
          return { items: [...s.items, { ...item, id: lineKey }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [], promoCode: null }),
      setPromo: (code) => set({ promoCode: code }),
      subtotal: () =>
        get().items.reduce(
          (sum, i) =>
            sum +
            (i.unitPrice + (i.addons?.reduce((a, x) => a + x.price, 0) ?? 0)) * i.qty,
          0,
        ),
    }),
    { name: "cod-cart-v1" },
  ),
);
