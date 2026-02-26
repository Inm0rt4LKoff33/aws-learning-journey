import Link from "next/link"
import { Sparkles } from "lucide-react"

const categories = [
  {
    name: "Pokémon",
    slug: "Pokemon",
    description: "Base sets, holos, promos & more",
    from: "#b45309",
    to: "#78350f",
    glow: "rgba(180, 83, 9, 0.3)",
  },
  {
    name: "Yu-Gi-Oh!",
    slug: "YuGiOh",
    description: "Ultra rares, secret rares & starlight",
    from: "#6d28d9",
    to: "#3b0764",
    glow: "rgba(109, 40, 217, 0.3)",
  },
  {
    name: "Magic: The Gathering",
    slug: "Magic",
    description: "Power 9, duals, reserved list staples",
    from: "#8b1a1a",
    to: "#450a0a",
    glow: "rgba(139, 26, 26, 0.3)",
  },
]

export default function Categories() {
  return (
    <section className="py-24" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="mb-12">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block"
            style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
          >
            Browse
          </span>
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-cinzel-decorative)" }}
          >
            Shop by Game
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?game=${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden border transition-transform duration-300 hover:-translate-y-1"
              style={{ borderColor: "var(--bg-border)", background: "var(--bg-elevated)" }}
            >
              {/* Gradient fill */}
              <div
                className="h-52 flex flex-col items-start justify-end p-7 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${cat.from}, ${cat.to})`,
                }}
              >
                {/* Glow orb */}
                <div
                  className="absolute top-4 right-4 w-24 h-24 rounded-full blur-2xl opacity-60"
                  style={{ background: cat.glow }}
                />

                <Sparkles
                  className="w-6 h-6 mb-3 opacity-70"
                  style={{ color: "var(--gold-light)" }}
                />

                <h3
                  className="text-2xl font-black text-white leading-tight"
                  style={{ fontFamily: "var(--font-cinzel-decorative)" }}
                >
                  {cat.name}
                </h3>
                <p className="text-sm mt-1 opacity-70 text-white">{cat.description}</p>
              </div>

              {/* Footer row */}
              <div
                className="flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>Browse collection</span>
                <span
                  className="translate-x-0 group-hover:translate-x-1 transition-transform"
                  style={{ color: "var(--crimson-light)" }}
                >
                  →
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl ring-1 ring-inset pointer-events-none"
                style={{ boxShadow: `0 0 0 1px ${cat.glow}` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}