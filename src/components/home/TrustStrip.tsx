import { FiAward, FiShield, FiCheckCircle, FiPackage } from "react-icons/fi";

export default function TrustStrip() {
  const items = [
    {
      icon: <FiAward />,
      title: "ISO 9001:2015",
      sub: "Quality management certified",
    },
    {
      icon: <FiShield />,
      title: "EN 1504-3",
      sub: "Structural concrete repair",
    },
    {
      icon: <FiCheckCircle />,
      title: "EN 12004",
      sub: "Adhesives for ceramic tiles",
    },
    {
      icon: <FiPackage />,
      title: "EN 934-2",
      sub: "Concrete admixtures",
    },
  ];

  return (
    <section className="bg-white-base border-y border-neutral-100">
      <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-100">
        {items.map((it) => (
          <div
            key={it.title}
            className="bg-white-base p-6 md:p-7 flex items-center gap-4"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 text-xl shrink-0">
              {it.icon}
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900 leading-tight">
                {it.title}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
