import Hero from "@/app/components/Hero"
import FeaturedProducts from "@/app/components/FeaturedProducts"
import Categories from "@/app/components/Categories"
import TrustSection from "@/app/components/TrustSection"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Hero />
      
      <Suspense
        fallback={
          <div
            className="py-24"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="mx-auto max-w-7xl px-6">
              <div
                className="h-8 w-48 rounded-lg animate-pulse mb-12"
                style={{ background: "var(--bg-elevated)" }}
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[610/835] rounded-2xl animate-pulse"
                    style={{ background: "var(--bg-elevated)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <FeaturedProducts />
      </Suspense>

      <Categories />
      <TrustSection />
    </main>
  )
}