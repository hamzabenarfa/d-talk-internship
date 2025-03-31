import { Bookmark, MapPin, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface JobCardProps {
  company: string
  title: string
  location: string
  type: string
  category: string
  salary: string
  postedTime: string
  backgroundColor?: string
  logo?: string
}

export function JobCard({
  company,
  title,
  location,
  type,
  category,
  salary,
  postedTime,
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
          <span className="text-lg font-medium">{company}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="my-4" />
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{salary ? `$${salary}/monthly` : "Salary not specified"}</span>
        </div>
      </div>
      <Button className="w-full rounded-full bg-black text-white hover:bg-black/90">Apply</Button>
      <p className="mt-3 text-center text-sm text-gray-500">POSTED {postedTime}</p>
    </div>
  )
}

