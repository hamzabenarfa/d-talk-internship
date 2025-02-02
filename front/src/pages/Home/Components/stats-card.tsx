import { Card } from "@/components/ui/card"

export function StatsCard() {
  return (
    <Card className="p-4 bg-white shadow-lg">
      <h3 className="font-semibold mb-4">Top Job Categories</h3>
      <div className="flex gap-4 items-end h-32">
        <div className="flex flex-col items-center">
          <div className="w-12 bg-pink-100 rounded-t" style={{ height: "65%" }} />
          <span className="text-xs mt-1">Product</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 bg-pink-200 rounded-t" style={{ height: "79%" }} />
          <span className="text-xs mt-1">Content</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 bg-pink-300 rounded-t" style={{ height: "48%" }} />
          <span className="text-xs mt-1">Finance</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 bg-pink-400 rounded-t" style={{ height: "93%" }} />
          <span className="text-xs mt-1">Design</span>
        </div>
      </div>
    </Card>
  )
}

