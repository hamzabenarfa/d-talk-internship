// @ts-nocheck
import {  MapPin, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

interface JobCardProps {
  company: string
  titre: string
  location: string
  type: string
  category: string

  backgroundColor?: string
  logo?: string
}

export function JobCard({
  id,
  company,
  titre,
  location,
  type,
  category,

  backgroundColor,
  logo,
}: JobCardProps) {
  return (
    <div className={`rounded-xl p-6 ${backgroundColor ? backgroundColor : "bg-gray-50"}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {logo && (
            <img
              src={logo || "/placeholder.svg"}
              alt={`${company} logo`}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <span className="text-lg font-medium">{"Internship"}</span>
        </div>
   
      </div>
      <Separator className="my-4" />
      <h3 className="mb-4 text-xl font-semibold">{titre}</h3>
      <div className="mb-4 grid grid-cols-2 gap-3 font-semibold">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{type}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{category}</span>
        </div>
        
    
      </div>
      <Link to={`/sujet/${id}`}>
        <Button className="w-full rounded-full bg-black text-white hover:bg-black/90">Details</Button>
      </Link>

    </div>
  )
}

