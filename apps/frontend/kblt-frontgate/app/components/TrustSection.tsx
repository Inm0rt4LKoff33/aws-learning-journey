import { ShieldCheck, Truck, BadgeCheck, Users } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "All transactions are encrypted and protected.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Quick and reliable delivery worldwide.",
  },
  {
    icon: BadgeCheck,
    title: "Authentic Cards",
    description: "Every card is verified for quality and authenticity.",
  },
  {
    icon: Users,
    title: "Community Trusted",
    description: "Loved by collectors and competitive players.",
  },
]

export default function TrustSection() {
  return (
    <section className="bg-white py-20 border-t">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex flex-col items-start space-y-4"
              >
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm">
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