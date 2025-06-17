// @ts-nocheck

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import axiosInstance from "@/axios-instance"
import { HeroSection } from "./Components/hero-section"
import { AboutSection } from "./Components/about-section"
import { InternshipSection } from "./Components/internship-section"
import { ApplicationProcessSection } from "./Components/application-process-section"
import { TestimonialsSection } from "./Components/testimonials-section"
import { FAQSection } from "./Components/faq-section"
import { CTASection } from "./Components/cta-section"


export type Category = {
  id: number
  name: string
}

export type Internship = {
  id: number
  titre: string
  description: string
  duration: string
  deadline: string
  work: string
  userId: number
  categoryId: number
  category: Category
}


const Home = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch internship data with improved error handling
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axiosInstance.get("/sujet")
        setInternships(response.data)
      } catch (err) {
        console.error("Error fetching internships:", err)
        setError(
          err instanceof Error
            ? `Error fetching internship data: ${err.message}`
            : "An unknown error occurred while fetching internship data",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchInternships()
  }, [])

  return (
    <div className="min-h-screen bg-[#f9f5f0]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <InternshipSection internships={internships} loading={loading} error={error} />
      <ApplicationProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Home

