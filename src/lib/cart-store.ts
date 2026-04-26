import { useSyncExternalStore } from "react";
import type { Course } from "@/data/mock";

export type CartItem = {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  qty: number;
};

const STORAGE_KEY = "sandiwa.cart.v1";

let items: CartItem[] = load();
const listeners = new Set<() => void>();

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => items,
    () => [] as CartItem[],
  );
}

export const cart = {
  add(course: Course) {
    const existing = items.find((i) => i.id === course.id);
    if (existing) {
      items = items.map((i) => (i.id === course.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      items = [
        ...items,
        {
          id: course.id,
          title: course.title,
          mentor: course.mentor,
          image: course.image,
          price: course.price,
          qty: 1,
        },
      ];
    }
    emit();
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
  count() {
    return items.reduce((s, i) => s + i.qty, 0);
  },
  total() {
    return items.reduce((s, i) => s + i.qty * i.price, 0);
  },
};
