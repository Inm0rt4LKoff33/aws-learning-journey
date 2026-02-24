import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16">
        
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              TCG Market
            </h3>
            <p className="text-sm text-gray-400">
              The modern marketplace for collectors and competitive players.
              Buy rare, verified trading cards with confidence.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-white transition">
                  All Cards
                </Link>
              </li>
              <li>
                <Link href="/catalog?featured=true" className="hover:text-white transition">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog?category=pokemon" className="hover:text-white transition">
                  Pokémon
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=yugioh" className="hover:text-white transition">
                  Yu-Gi-Oh!
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=mtg" className="hover:text-white transition">
                  Magic: The Gathering
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-800 pt-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} TCG Market. All rights reserved.
        </div>
      </div>
    </footer>
  )
}