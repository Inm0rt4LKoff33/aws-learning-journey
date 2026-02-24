import Link from "next/link"

const categories = [
  {
    name: "Pokémon",
    slug: "pokemon",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    name: "Yu-Gi-Oh!",
    slug: "yugioh",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    name: "Magic: The Gathering",
    slug: "mtg",
    gradient: "from-green-500 to-emerald-600",
  },
]

export default function Categories() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Shop by Category
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalog?category=${category.slug}`}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div
                className={`h-64 bg-gradient-to-br ${category.gradient} flex items-center justify-center`}
              >
                <h3 className="text-2xl font-bold text-white">
                  {category.name}
                </h3>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}