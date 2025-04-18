import { Button } from "@/components/ui/button";
import InternshipCard from "@/components/internship-card";
import type { Internship } from "@/types/internship";

export type InternshipSectionProps = {
  internships: Internship[];
  loading: boolean;
  error: string | null;
};

export const InternshipSection = ({
  internships,
  loading,
  error,
}: InternshipSectionProps) => {
  if(internships.length=== 0) return <></>
  return (
    <section className="py-20 bg-[#f9f5f0]">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Available Internships
          </h2>
          <p className="text-lg text-gray-600">
            Explore our current internship opportunities and find the perfect
            match for your skills and interests.
          </p>
        </div>
        {loading ? (
          <div className="col-span-full text-center py-10">
            <p>Loading internship opportunities...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : internships.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p>No internship opportunities available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internships &&internships.slice(0, 3).map((internship) => (
              <InternshipCard
                id={internship.id}
                key={internship.id}
                title={internship.titre}
                department={`${internship.category?.name}`}
                duration={internship.duration}
                type={internship.work}
                description={internship.description}
                deadline={new Date(internship.deadline).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
