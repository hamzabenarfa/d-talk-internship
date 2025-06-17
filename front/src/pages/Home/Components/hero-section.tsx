// @ts-nocheck
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#b89048]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b89048]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
    </div>

    <div className="container relative z-10 px-4 lg:py-40 lg:px-20 py-24 mx-auto">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 text-sm font-medium text-[#b89048] bg-[#b89048]/10 rounded-full">
            Join Our Creative Team
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Start Your Artistic <span className="text-[#b89048]">Journey</span> With Us
          </h1>
          <p className="text-xl text-gray-600">
            Gain valuable experience and develop your skills through our internship program designed for emerging
            artists and designers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="search">
              <Button className="bg-[#b89048] hover:bg-[#a07a30] text-white">Apply Now</Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img src="/images/internship.jpg" alt="Internship Program" className="object-cover w-full h-full" />
          </div>
          <div className="absolute -bottom-28 -left-6 w-48 h-48 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Applications Open</p>
              <p className="text-xl font-bold text-yellow-500 text-border">Summer 2025</p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#b89048] rounded-full flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-xs font-medium">Apply</p>
              <p className="text-lg font-bold">Now</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f9f5f0] to-transparent"></div>
  </section>
)

