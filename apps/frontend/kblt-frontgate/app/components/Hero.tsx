import Link from "next/link"
import RotatingHeroCard from "@/app/components/RotatingHeroCard"

export default function HomePage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-gray-50">

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
        Collect Better.
      </h1>

      {/* Subtext */}
      <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10">
        Discover rare and authentic trading cards curated for serious collectors.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 mb-16">
        <Link
          href="/catalog"
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-600 transition"
        >
          Explore Collection
        </Link>

        <Link
          href="/catalog"
          className="border border-gray-300 px-8 py-4 rounded-2xl text-lg hover:border-gray-900 transition"
        >
          Browse New Arrivals
        </Link>
      </div>

      {/* Featured Card */}
      <RotatingHeroCard />

    </section>
  )
}