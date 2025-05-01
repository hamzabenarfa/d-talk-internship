"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/axios-instance"
import { SearchSection } from "./components/search-section"
import { Categories } from "./components/categories"
import { JobCard } from "./components/job-card"
import Navbar from "@/components/navbar"

export default function Job() {
  const [sujets, setSujets] = useState([])
  const [filteredSujets, setFilteredSujets] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCategories()
    fetchAllSujets()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchSujetsByCategory(selectedCategory)
    }
  }, [selectedCategory])

  // Apply search filter whenever sujets or searchTerm changes
  useEffect(() => {
    filterSujets()
  }, [sujets, searchTerm])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/category")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter sujets based on search term
  const filterSujets = () => {
    if (!searchTerm.trim()) {
      setFilteredSujets(sujets)
      return
    }

    const filtered = sujets.filter(sujet => {
      const searchTermLower = searchTerm.toLowerCase()
      return (
        (sujet.titre && sujet.titre.toLowerCase().includes(searchTermLower)) ||
        (sujet.description && sujet.description.toLowerCase().includes(searchTermLower)) ||
        (sujet.category?.name && sujet.category.name.toLowerCase().includes(searchTermLower)) ||
        (sujet.location && sujet.location.toLowerCase().includes(searchTermLower))
      )
    })

    setFilteredSujets(filtered)
  }

  // Handle search button click
  const handleSearch = () => {
    filterSujets()
  }

  const fetchAllSujets = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/sujet")
      const sujetsWithCategories = response.data.map(sujet => ({
        ...sujet,
        category: sujet.category || { name: "Unknown" } // Ensure category exists
      }))
      setSujets(sujetsWithCategories)
      setFilteredSujets(sujetsWithCategories)
    } catch (error) {
      console.error("Error fetching all sujets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSujetsByCategory = async (categoryId) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/sujet/category/${categoryId}`)
      const sujetsWithCategories = response.data.map(sujet => ({
        ...sujet,
        category: sujet.category || { name: "Unknown" } // Ensure category exists
      }))
      setSujets(sujetsWithCategories)
      setFilteredSujets(sujetsWithCategories)
      // Reset search term when changing category
      setSearchTerm("")
    } catch (error) {
      console.error(`Error fetching sujets for category ${categoryId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (categoryId) => {
    if (categoryId === null) {
      setSelectedCategory(null)
      fetchAllSujets()
    } else {
      setSelectedCategory(categoryId)
    }
    // Reset search term when changing category
    setSearchTerm("")
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="min-h-screen mx-8 my-4 rounded-3xl py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
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
              {filteredSujets && filteredSujets.length > 0 ? (
                filteredSujets.map((sujet, index) => (
                  <JobCard
                    id={sujet.id}
                    key={sujet.id || index}
                    company={sujet.company || "Job"}
                    titre={sujet.titre || "Position"}
                    location={sujet.location || "Not specified"}
                    type={sujet.work || "Full-time"}
                    category={sujet.category?.name || "Technology"} // Safely access category.name

                    backgroundColor={index % 4 === 0 ? "bg-pink-50/50" : "bg-gray-50"}
                    logo={sujet.logo}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? `No jobs found matching "${searchTerm}"` : "No jobs found for this category."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}