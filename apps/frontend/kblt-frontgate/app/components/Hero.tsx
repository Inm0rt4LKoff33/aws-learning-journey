import Link from "next/link"
import RotatingHeroCard from "@/app/components/RotatingHeroCard"

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-6 pt-24 pb-16 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Radial glow — crimson left */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{ background: "var(--crimson)" }}
      />
      {/* Radial glow — gold right */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
        style={{ background: "var(--gold)" }}
      />

      {/* Text side */}
      <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">

        {/* Eyebrow */}
        <span
          className="inline-block mb-5 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border"
          style={{
            color: "var(--gold)",
            borderColor: "var(--gold-muted)",
            background: "var(--gold-glow)",
            fontFamily: "var(--font-cinzel-decorative)",
          }}
        >
          Rare · Authentic · Curated
        </span>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
          style={{ fontFamily: "var(--font-cinzel-decorative)", color: "var(--text-primary)" }}
        >
          Collect
          <br />
          <span className="text-gold-shimmer">Better.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl mb-10 max-w-md" style={{ color: "var(--text-secondary)" }}>
          Discover rare and authentic trading cards curated for serious collectors.
          From Base Set Charizards to Alpha Black Lotus.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/catalog"
            className="btn-crimson rounded-2xl px-8 py-4 text-base font-semibold"
          >
            Explore Collection
          </Link>
          <Link
            href="/catalog"
            className="rounded-2xl px-8 py-4 text-base font-medium border transition-colors"
            style={{
              borderColor: "var(--bg-border)",
              color: "var(--text-secondary)",
              background: "var(--bg-elevated)",
            }}
          >
            New Arrivals
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex gap-8">
          {[["500+", "Rare Cards"], ["3", "Game Systems"], ["100%", "Authenticated"]].map(([val, label]) => (
            <div key={label}>
              <p
                className="text-2xl font-black"
                style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
              >
                {val}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card side */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--crimson-dark)" }}
        />
        <RotatingHeroCard />
      </div>

    </section>
  )
}