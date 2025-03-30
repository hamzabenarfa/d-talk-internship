import { SearchSection } from "./components/search-section";
import { Categories } from "./components/categories";
import { JobCard } from "./components/job-card";
import Navbar from "@/components/navbar";

export default function Job() {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <main className="min-h-screen mx-8 my-4 rounded-3xl py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <SearchSection />
          <div className="mx-auto  max-w-2xl">


          <Categories />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <JobCard
              company="Job"
              title="Product Designer"
              location="Jakarta, Indonesia"
              type="Full-time"
              category="Technology"
              salary="400"
              postedTime="YESTERDAY"
              backgroundColor="bg-pink-50/50"
            />
            <JobCard
              company="Internship"
              title="UI/UX Researcher"
              location="Jakarta, Indonesia"
              type="Full-time"
              category="Education"
              salary="280"
              postedTime="2 DAY AGO"
            />
                  <JobCard
              company="Ruang Guru"
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-H29CwvhQOJbI1ta3gpHR9GBcjXVJ1o.png"
              title="UI/UX Researcher"
              location="Jakarta, Indonesia"
              type="Full-time"
              category="Education"
              salary="280"
              postedTime="2 DAY AGO"
            />
                  <JobCard
              company="Ruang Guru"
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-H29CwvhQOJbI1ta3gpHR9GBcjXVJ1o.png"
              title="UI/UX Researcher"
              location="Jakarta, Indonesia"
              type="Full-time"
              category="Education"
              salary="280"
              postedTime="2 DAY AGO"
            />
          </div>
        </div>
      </main>{" "}
    </div>
  );
}
