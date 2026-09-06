import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ShopProduct } from "@/lib/shop";

export type CartLine = { product: ShopProduct; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  add: (product: ShopProduct) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "eyetech-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved) as CartLine[]);
    } catch {
      setLines([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce(
      (total, line) => total + line.product.priceKes * line.quantity,
      0,
    );
    return {
      lines,
      itemCount,
      subtotal,
      add: (product) =>
        setLines((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
            );
          }
          return [...current, { product, quantity: 1 }];
        }),
      remove: (productId) =>
        setLines((current) => current.filter((line) => line.product.id !== productId)),
      setQuantity: (productId, quantity) =>
        setLines((current) =>
          quantity < 1
            ? current.filter((line) => line.product.id !== productId)
            : current.map((line) => (line.product.id === productId ? { ...line, quantity } : line)),
        ),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
