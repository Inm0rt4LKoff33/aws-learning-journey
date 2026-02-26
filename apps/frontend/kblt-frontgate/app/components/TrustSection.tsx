import { ShieldCheck, Truck, BadgeCheck, Users } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "All transactions are encrypted and protected with industry-standard SSL.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Cards shipped in protective sleeves with tracking included on every order.",
  },
  {
    icon: BadgeCheck,
    title: "Authentic Cards",
    description: "Every card is individually verified for authenticity and graded condition.",
  },
  {
    icon: Users,
    title: "Community Trusted",
    description: "Loved by collectors, tournament players, and investors worldwide.",
  },
]

export default function TrustSection() {
  return (
    <section
      className="py-24 border-t"
      style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block"
            style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
          >
            Our Promise
          </span>
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-cinzel-decorative)" }}
          >
            Why Choose KBLT
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group flex flex-col gap-4 rounded-2xl border p-6 transition-colors hover:border-[--crimson-muted]"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "var(--bg-border)",
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border"
                  style={{
                    background: "var(--crimson-glow)",
                    borderColor: "var(--crimson-muted)",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: "var(--crimson-light)" }} />
                </div>

                <h3
                  className="text-base font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}