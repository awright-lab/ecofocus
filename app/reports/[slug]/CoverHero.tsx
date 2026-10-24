import Image from "next/image";
import Hero from "@/components/Hero";
import type { ReportDetail } from "@/lib/reports-repo";

export default function CoverHero({ report }: { report: ReportDetail }) {
  return <Hero
    variant="report"
    size="normal"
    badge={report.access === "Free" ? "Free report" : "Research report"}
    headline={report.title}
    subhead={report.subtitle || report.description}
    rightVisual={report.cover ? <div className="relative mx-auto w-48 overflow-hidden rounded-xl border border-white/20 shadow-2xl md:w-60"><Image src={report.cover} alt={`${report.title} cover`} width={480} height={640} className="h-auto w-full" priority /></div> : undefined}
    videoSrc="https://pub-3816c55026314a19bf7805556b182cb0.r2.dev/hero-6.mp4"
    posterSrc="/images/hero-6-poster.jpg"
    overlay="dense"
  />;
}
