// @ts-nocheck
"use client"

import { Button } from "@/components/ui/button"

export function Categories({ categories = [], selectedCategory, onCategoryChange }) {
  // If no categories are provided, use a default empty array
  const displayCategories = Array.isArray(categories) ? categories : []

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {/* Add an "All" option */}
      <Button
        key="all"
        variant={selectedCategory === null ? "secondary" : "outline"}
        className={`rounded-full ${selectedCategory === null ? "bg-pink-100 hover:bg-pink-200" : ""}`}
        onClick={() => onCategoryChange(null)}
      >
        All
      </Button>

      {displayCategories.map((category) => {
        const isActive = selectedCategory === category.id

        return (
          <Button
            key={category.id || category.name}
            variant={isActive ? "secondary" : "outline"}
            className={`rounded-full ${isActive ? "bg-pink-100 hover:bg-pink-200" : ""}`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        )
      })}
    </div>
  )
}

