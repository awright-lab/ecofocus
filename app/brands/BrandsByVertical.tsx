import { FadeUp } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="corner-glow rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="gradient-underline text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BrandColumn({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-slate-800">{heading}</h3>
      <ul className="mt-2 space-y-1 text-slate-600">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function BrandsByVertical() {
  return (
    <FadeUp>
      <Panel title="Brands by Vertical">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <BrandColumn
            heading="CPG"
            items={[
              "Mars", "Trolli", "Keurig", "Peet’s Coffee", "Coca Cola",
              "Constellation Brands–Corona", "Dr. Pepper", "General Mills",
              "Campbell’s Condensed", "Heinz", "Pepsi",
            ]}
          />
          <BrandColumn
            heading="Soft Goods"
            items={[
              "Patagonia", "Allbirds", "Gap", "Adidas", "Under Armor",
              "Dior", "Ralph Lauren", "Converse", "Chanel", "Nike",
            ]}
          />
          <BrandColumn
            heading="Homeowners"
            items={[
              "Duravit", "TimberTech AZEK", "Trex", "Kraus", "TOTO",
              "Kohler", "Janus et Cie", "James Hardie", "Andersen Windows", "Hunter Douglas",
            ]}
          />
          <BrandColumn
            heading="Pets"
            items={[
              "All the Best Pet Care", "Blue Buffalo", "Freshpet", "Hill’s Pet Nutrition",
              "CBD Dog Health", "Primal Pet Foods", "Hartz", "V-Dog", "I and Love You", "Wellness Pet Food",
            ]}
          />
        </div>

        <p className="mt-6 text-sm text-slate-500">
          We offer you access to data to the three questions for your own brand at no charge.
          Additional deliverables, data access and data filters for cross tabbing purposes are
          available for purchase as noted on Packaging Options &amp; Pricing.
        </p>
      </Panel>
    </FadeUp>
  );
}

