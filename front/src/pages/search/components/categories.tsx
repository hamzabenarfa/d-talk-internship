import { Monitor, BadgeDollarSign, BarChart3, Smartphone, Database, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "UI/UX Design", icon: Smartphone, active: true },
  { name: "Sales", icon: BadgeDollarSign },
  { name: "Development", icon: Monitor },
  { name: "Analytics", icon: BarChart3 },
  { name: "Digital Media Specialist", icon: Smartphone },
  { name: "Data Operator", icon: Database },
  { name: "Project Management", icon: Users },
  { name: "Other", icon: Monitor },
]

export function Categories() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <Button
          key={category.name}
          variant={category.active ? "secondary" : "outline"}
          className={`flex items-center gap-2 rounded-full ${category.active ? "bg-pink-100 hover:bg-pink-200" : ""}`}
        >
          <category.icon className="h-4 w-4" />
          {category.name}
        </Button>
      ))}
    </div>
  )
}

