import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="border-t py-12"
      style={{ background: "var(--bg-surface)", borderColor: "var(--bg-border)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <p
              className="text-xl font-black tracking-widest mb-3"
              style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel-decorative)" }}
            >
              KBLT
            </p>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-muted)" }}>
              Rare and authentic trading cards curated for serious collectors. Pokémon, Yu-Gi-Oh!, and Magic: The Gathering.
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Shop
            </p>
            <div className="flex flex-col gap-2">
              {[["Catalog", "/catalog"], ["Pokémon", "/catalog?game=Pokemon"], ["Yu-Gi-Oh!", "/catalog?game=YuGiOh"], ["Magic", "/catalog?game=Magic"]].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Account
            </p>
            <div className="flex flex-col gap-2">
              {[["Sign In", "/auth"], ["Profile", "/profile"], ["Order History", "/profile"], ["Cart", "/cart"]].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: "var(--bg-border)", color: "var(--text-muted)" }}
        >
          <p>© {new Date().getFullYear()} KBLT. All rights reserved.</p>
          <p>Built with Next.js · Deployed on AWS</p>
        </div>
      </div>
    </footer>
  )
}