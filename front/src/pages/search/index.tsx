"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/axios-instance"
import { SearchSection } from "./components/search-section"
import { Categories } from "./components/categories"
import { JobCard } from "./components/job-card"
import Navbar from "@/components/navbar"

export default function Job() {
  const [sujets, setSujets] = useState([])
  const [categories, setCategories] = useState([])
  console.log("🚀 ~ Job ~ categories:", sujets)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all categories and sujets on component mount
  useEffect(() => {
    fetchCategories()
    fetchAllSujets()
  }, [])

  // Fetch sujets when category changes (except on initial load)
  useEffect(() => {
    if (selectedCategory) {
      fetchSujetsByCategory(selectedCategory)
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      // Using the exact endpoint from your description: "/categories"
      const response = await axiosInstance.get("/category")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllSujets = async () => {
    setIsLoading(true)
    try {
      // Using the exact endpoint from your description: "/"
      const response = await axiosInstance.get("/sujet")
      setSujets(response.data)
    } catch (error) {
      console.error("Error fetching all sujets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSujetsByCategory = async (categoryId) => {
    setIsLoading(true)
    try {
      // Using the exact endpoint from your description: "/category/:categoryId"
      const response = await axiosInstance.get(`/sujet/category/${categoryId}`)
      setSujets(response.data)
    } catch (error) {
      console.error(`Error fetching sujets for category ${categoryId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (categoryId) => {
    if (categoryId === null) {
      // If "All" is selected, fetch all sujets
      setSelectedCategory(null)
      fetchAllSujets()
    } else {
      setSelectedCategory(categoryId)
    }
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="min-h-screen mx-8 my-4 rounded-3xl py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <SearchSection />
          <div className="mx-auto max-w-2xl">
            <Categories
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sujets && sujets.length > 0 ? (
                sujets.map((sujet, index) => (
                  <JobCard
                    key={sujet.id || index}
                    company={sujet.company || "Job"}
                    titre={sujet.titre || "Position"}
                    location={sujet.location || "Not specified"}
                    type={sujet.type || "Full-time"}
                    category={sujet.category || "Technology"}
                    salary={sujet.salary || "N/A"}
                    postedTime={sujet.postedTime || "RECENTLY"}
                    backgroundColor={index % 4 === 0 ? "bg-pink-50/50" : "bg-gray-50"}
                    logo={sujet.logo}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No jobs found for this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

