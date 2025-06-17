// @ts-nocheck
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const CTASection = () => (
  <section className="py-20 text-center bg-[#b89048]">
    <div className="container px-4 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to Start Your Creative Journey?</h2>
      <p className="max-w-2xl mx-auto mb-8 text-lg text-white/90">
        Join our internship program and take the first step towards a successful career in art and design.
      </p>
      <Link to="search">
        <Button size="lg" className="bg-white text-[#b89048] hover:bg-gray-100">
          Apply for an Internship
        </Button>
      </Link>
    </div>
  </section>
)

