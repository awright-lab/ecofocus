{/* Right: layered cards (image + intro text) */}
<div className="md:col-span-7 relative md:min-h-[var(--stack-h)] pb-32 md:pb-0">
  <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 shadow-2xl">
    <div className="relative h-72 md:h-[var(--stack-h)] w-full rounded-2xl overflow-hidden shadow-lg">
      <Image
        src="/images/intro-bg.png"
        alt="EcoFocus sustainability research"
        fill
        className="object-cover"
        priority
      />
    </div>
  </div>

  {/* The floating copy card */}
  <div className="absolute bottom-0 left-0 md:-left-12 translate-y-1/3 md:translate-y-1/4 w-[90%] md:w-[70%]">
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-6 md:p-8">
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
        EcoFocus® Research delivers research-backed consumer insights that can
        help companies turn purpose into a competitive edge. Our syndicated
        and custom studies explore how attitudes, behaviors, and sentiment
        around sustainability influence purchase decisions. With a special
        focus on the Purpose-Driven Generation, EcoFocus data can help
        companies build loyalty, reduce churn, and increase market share
        through purpose-aligned strategy and messaging.
      </p>
    </div>
  </div>
</div>











