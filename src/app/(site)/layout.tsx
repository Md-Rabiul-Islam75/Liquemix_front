import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/contact/FloatingWhatsApp";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { fetchSiteSettings } from "@/data/settings";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSiteSettings();
  return (
    <SettingsProvider value={settings}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </SettingsProvider>
  );
}
