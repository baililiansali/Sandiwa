import { useSyncExternalStore } from "react";
import type { Course } from "@/data/mockCourses";

export type CartItem = {
  id: string;
  title: string;
  mentor: string;
  image: string;
  price: number;
  selected?: boolean; // Add selected property
};

const STORAGE_KEY = "sandiwa.cart.v1";

let items: CartItem[] = load();
const listeners = new Set<() => void>();

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    // Ensure all items have selected property (default to true for backwards compatibility)
    return parsed.map(item => ({ ...item, selected: item.selected !== false }));
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
    if (!existing) {
      items = [
        ...items,
        {
          id: course.id,
          title: course.title,
          mentor: course.mentor,
          image: course.image,
          price: course.price,
          selected: true, // New items are selected by default
        },
      ];
    }
    emit();
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    emit();
  },
  toggleSelect(id: string) {
    items = items.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i));
    emit();
  },
  selectAll(selected: boolean) {
    items = items.map((i) => ({ ...i, selected }));
    emit();
  },
  getSelectedItems() {
    return items.filter(i => i.selected);
  },
  clear() {
    items = [];
    emit();
  },
  count() {
    return items.length;
  },
  total() {
    return items.reduce((s, i) => s + i.price, 0);
  },
  selectedTotal() {
    return items
      .filter(i => i.selected)
      .reduce((s, i) => s + i.price, 0);
  },
  selectedCount() {
    return items
      .filter(i => i.selected)
      .length;
  },
};