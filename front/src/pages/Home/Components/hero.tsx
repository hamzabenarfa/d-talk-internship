import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  return (
    <div className=" flex items-center justify-center  flex-col text-center mx-auto mb-12 min-h-screen bg-gradient-to-br from-pink-50 to-pink-200 rounded-3xl">
      <div className="max-w-3xl p-8">
        <h1 className="text-7xl font-normal tracking-tight mb-6">
          Modernizing the Job Search Experience
        </h1>
        <p className="text-gray-600 mb-8">
          Search and find your dream job now easier than ever, you can simply
          browse and find a job if you need it
        </p>

        {/* Search Bar */}
        <div className="flex gap-1.5 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search for a Job..."
            className="flex-1 bg-white h-11 rounded-full"
          />
          <Button className=" rounded-full h-11" size="lg">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
