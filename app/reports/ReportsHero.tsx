import Hero from "@/components/Hero";

export default function ReportsHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      badge="Reports & insights"
      headline={<>Understand the consumer.<br /><span className="text-emerald-400">Move your business forward.</span></>}
      subhead="Explore sustainability research on the attitudes, choices, and behaviors shaping your market. Find the insights to guide your next decision."
      ctaPrimary={{ label: "Explore reports", href: "#report-catalog" }}
      ctaSecondary={{ label: "Discuss your research needs", href: "/contact" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
