import Hero from "@/app/components/Hero"
import FeaturedProducts from "@/app/components/FeaturedProducts"
import Categories from "@/app/components/Categories"
import TrustSection from "@/app/components/TrustSection"

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <TrustSection />
    </main>
  )
}