import { Card } from "@/components/ui/card"
import { Bookmark } from "lucide-react"

interface JobCardProps {
  title: string
  company: string
  location: string
  salary?: string
  type?: string
  remote?: boolean
}

export function JobCard({ title, company, location, salary, type, remote }: JobCardProps) {
  return (
    <Card className="p-4 w-[280px] bg-white shadow-lg">
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 bg-pink-100 rounded-full" />
        <Bookmark className="w-5 h-5 text-gray-400" />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{company}</p>
        <div className="flex gap-2 mt-2">
          {type && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{type}</span>}
          {remote && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Remote</span>}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-gray-500">{location}</span>
        </div>
        {salary && (
          <div className="mt-2">
            <span className="font-semibold">${salary}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
        )}
      </div>
    </Card>
  )
}

