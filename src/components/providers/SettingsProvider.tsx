"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/data/settings";

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

/**
 * Wraps the public site with the latest SiteSettings fetched from the
 * backend on each request. Server components can read settings directly
 * via fetchSiteSettings(); this provider is the bridge for the client
 * components that sit inside the server tree — FloatingWhatsApp, the
 * mega-menu enquiry CTA, the home FAQ, EnquireOptions when rendered
 * from a client surface, etc.
 *
 * Defaulting the context to DEFAULT_SETTINGS means client components
 * outside the provider (e.g. the admin app) still get sensible values.
 */
export function SettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SiteSettings {
  return useContext(SettingsContext);
}
