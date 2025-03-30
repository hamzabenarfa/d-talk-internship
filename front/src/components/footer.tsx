
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-[#f0ebe2] border-t border-[#b89048]/10">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-[#b89048]">D-Talk</span>
            </Link>
            <p className="text-sm text-gray-600">
              D-talk is a design distribution channel that enables designers to generate sustainable income by
              industrializing their art.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#b89048]">Site map</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Services
                </Link>
              </li>
              <li>
                <Link to="#offers" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="#products" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Products
                </Link>
              </li>
              <li>
                <Link to="#designers" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Designers Profile
                </Link>
              </li>
              <li>
                <Link to="#join" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Join D-Talk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#b89048]">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#contact" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#careers" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#team" className="text-sm text-gray-600 hover:text-[#b89048]">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-[#b89048]">Connect</h3>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-600 hover:text-[#b89048]">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-gray-600 hover:text-[#b89048]">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-gray-600 hover:text-[#b89048]">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center text-gray-500 border-t border-gray-200">
          <p>Copyright © {new Date().getFullYear()} D-talk</p>
        </div>
      </div>
    </footer>
  )
}

