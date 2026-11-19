import Hero from "@/components/Hero";

export default function ReportsHero() {
  return (
    <Hero
      variant="solutions"
      size="normal"
      contentWidth="wide"
      badge="Reports & insights"
      headline={<><span className="block">EcoFocus Proprietary Reports</span><span className="block">to help you understand the consumer</span><span className="block bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">and move your business forward.</span></>}
      subhead="Explore sustainability research on the attitudes, choices, and behaviors shaping your market. Find the insights to guide your next decision."
      ctaSecondary={{ label: "Discuss your research needs", href: "/contact" }}
      videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
      posterSrc="/images/hero-6-poster.jpg"
      overlay="dense"
    />
  );
}
