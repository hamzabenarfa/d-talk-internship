import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface InternshipCardProps {
  id:number;
  title: string;
  department: string;
  duration: string;
  type: "Remote" | "On-site" | "Hybrid";
  description: string;
  deadline: string;
}

export default function InternshipCard({
  id,
  title,
  department,
  duration,
  type,
  description,
  deadline,
}: InternshipCardProps) {
  return (
    <div className="flex flex-col h-full p-6 transition-all duration-300 bg-white rounded-xl shadow-sm hover:shadow-md">
      <div className="mb-4">
        <Badge className="mb-2 bg-[#b89048] hover:bg-[#b89048]/90">
          {type}
        </Badge>
        <h3 className="mb-1 text-xl font-bold">{title}</h3>
        <p className="text-sm text-[#b89048] capitalize  ">{department}</p>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Application Deadline: {deadline}</span>
        </div>
      </div>

      <p className="mb-6 text-gray-600 grow">{description}</p>

      <Link to={`/sujet/${id}`}>
        <Button className="mt-auto w-full bg-[#b89048] hover:bg-[#a07a30] text-white">
          View Details
        </Button>
      </Link>
    </div>
  );
}
