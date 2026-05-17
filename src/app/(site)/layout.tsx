import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/contact/FloatingWhatsApp";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <Footer />
      </div>
      <div className="print:hidden">
        <FloatingWhatsApp />
      </div>
    </div>
  );
}
