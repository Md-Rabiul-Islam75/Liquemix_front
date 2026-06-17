"use client";

import { useEffect, useState } from "react";

/**
 * The public visitor who signed in with Google via the Enquire flow.
 * Held in sessionStorage (per-tab, cleared when the tab closes) so multiple
 * components — the Enquire panel and the site header — can show "Signed in
 * as …" without prop-drilling or a provider.
 *
 * Writes go through {@link saveEnquirer}/{@link clearEnquirer} which fire a
 * custom event, so {@link useEnquirer} updates live in the same tab (the
 * native `storage` event only fires in *other* tabs).
 */
export type Enquirer = { name: string; email: string };

const KEY = "liquemix_enquirer";
const EVENT = "liquemix-enquirer-change";

export function getEnquirer(): Enquirer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Enquirer) : null;
  } catch {
    return null;
  }
}

export function saveEnquirer(who: Enquirer) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(who));
  window.dispatchEvent(new Event(EVENT));
}

export function clearEnquirer() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** Reactive current enquirer — re-renders when sign-in happens anywhere in
 *  this tab (custom event) or in another tab (storage event). */
export function useEnquirer(): Enquirer | null {
  const [enquirer, setEnquirer] = useState<Enquirer | null>(null);
  useEffect(() => {
    const read = () => setEnquirer(getEnquirer());
    read(); // hydrate from sessionStorage after mount
    window.addEventListener(EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return enquirer;
}
