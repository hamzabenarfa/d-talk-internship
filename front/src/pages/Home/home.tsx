import { useState, useEffect } from "react";
import { ArrowRight, Calendar, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import InternshipCard from "@/components/internship-card";
import TestimonialCard from "@/components/testimonial-card";
import axiosInstance from "@/axios-instance";
const Home = () => {
  type Internship = {
    id: number;
    titre: string;
    description: string;
    duration: string;
    deadline: string;
    work: string;
    userId: number;
    categoryId: number;
  };
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch internship data
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axiosInstance("/sujet");

        setInternships(response.data);
      } catch (err) {
        setError("Error fetching internship data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);
  return (
    <div className="min-h-screen  bg-[#f9f5f0]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#b89048]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b89048]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div
          className="container relative z-10 px-4 lg:py-40 
      lg:px-20 py-24 mx-auto"
        >
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 text-sm font-medium text-[#b89048] bg-[#b89048]/10 rounded-full">
                Join Our Creative Team
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Start Your Artistic{" "}
                <span className="text-[#b89048]">Journey</span> With Us
              </h1>
              <p className="text-xl text-gray-600">
                Gain valuable experience and develop your skills through our
                internship program designed for emerging artists and designers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#b89048] hover:bg-[#a07a30] text-white">
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="border-[#b89048] text-[#b89048]"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/images/internship.jpg"
                  alt="Internship Program"
                  className="object-cver"
                />
              </div>
              <div className="absolute -bottom-28 -left-6 w-48 h-48 bg-white/30 backdrop-blur-sm  rounded-lg shadow-lg flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">
                    Applications Open
                  </p>
                  <p className="text-lg font-bold text-gray-900">Spring 2025</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#b89048] rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-xs font-medium">Apply</p>
                  <p className="text-lg font-bold">Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f9f5f0] to-transparent"></div>
      </section>

      {/* About Our Internship Program */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              About Our Internship Program
            </h2>
            <p className="text-lg text-gray-600">
              D-Talk's internship program offers a unique opportunity to work
              alongside experienced artists and designers, gaining hands-on
              experience in the creative industry while developing your artistic
              skills.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 transition-all duration-300 bg-[#f9f5f0] rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#b89048]/10">
                <GraduationCap className="w-8 h-8 text-[#b89048]" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Learn & Grow</h3>
              <p className="text-gray-600">
                Develop your skills under the guidance of professional artists
                and designers who will mentor you throughout your journey.
              </p>
            </div>

            <div className="p-6 transition-all duration-300 bg-[#f9f5f0] rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#b89048]/10">
                <Users className="w-8 h-8 text-[#b89048]" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Build Connections</h3>
              <p className="text-gray-600">
                Network with industry professionals and fellow interns, creating
                valuable connections that will benefit your future career.
              </p>
            </div>

            <div className="p-6 transition-all duration-300 bg-[#f9f5f0] rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#b89048]/10">
                <Calendar className="w-8 h-8 text-[#b89048]" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Real Projects</h3>
              <p className="text-gray-600">
                Work on real client projects and build a professional portfolio
                that showcases your talents and abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Internships */}
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
              {internships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  title={internship.titre}
                  department={`${internship.category.name}`}
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

      {/* Application Process */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Application Process
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0 bg-[#b89048]">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">
                      Submit Your Application
                    </h3>
                    <p className="text-gray-600">
                      Fill out our online application form and upload your
                      portfolio showcasing your best work.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0 bg-[#b89048]">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">Portfolio Review</h3>
                    <p className="text-gray-600">
                      Our team will review your portfolio and application to
                      assess your skills and potential fit.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0 bg-[#b89048]">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">Interview</h3>
                    <p className="text-gray-600">
                      Selected candidates will be invited for an interview to
                      discuss their experience, goals, and expectations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0 bg-[#b89048]">
                    4
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">
                      Offer & Onboarding
                    </h3>
                    <p className="text-gray-600">
                      Successful candidates will receive an offer and go through
                      our onboarding process to begin their internship journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/images/happy.jpg"
                  alt="Application Process"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-white rounded-xl shadow-lg max-w-xs">
                <h3 className="mb-2 text-lg font-bold">Ready to Apply?</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Take the first step towards your creative career with D-Talk.
                </p>
                <Button className="w-full bg-[#b89048] hover:bg-[#a07a30] text-white">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f9f5f0]">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Hear From Our Past Interns
            </h2>
            <p className="text-lg text-gray-600">
              Discover what previous interns have to say about their experience
              at D-Talk.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="My internship at D-Talk was a transformative experience. I gained valuable skills and made connections that helped me launch my career as a graphic designer."
              name="Sarah Johnson"
              role="Former Graphic Design Intern"
              img="/placeholder.svg?height=100&width=100"
            />

            <TestimonialCard
              quote="The mentorship I received during my internship was invaluable. The team was supportive and encouraged me to explore my creativity while providing constructive feedback."
              name="Michael Chen"
              role="Former Digital Art Intern"
              img="/placeholder.svg?height=100&width=100"
            />

            <TestimonialCard
              quote="Working on real client projects gave me practical experience that I couldn't have gained elsewhere. D-Talk's internship program truly prepares you for the industry."
              name="Aisha Patel"
              role="Former UI/UX Design Intern"
              img="/placeholder.svg?height=100&width=100"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our internship program.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-[#f9f5f0] rounded-xl">
              <h3 className="mb-2 text-lg font-bold">Are internships paid?</h3>
              <p className="text-gray-600">
                Yes, all our internships offer competitive stipends based on the
                role, duration, and your experience level.
              </p>
            </div>

            <div className="p-6 bg-[#f9f5f0] rounded-xl">
              <h3 className="mb-2 text-lg font-bold">
                What are the eligibility requirements?
              </h3>
              <p className="text-gray-600">
                Our internships are open to students and recent graduates with
                relevant skills and a passion for art and design.
              </p>
            </div>

            <div className="p-6 bg-[#f9f5f0] rounded-xl">
              <h3 className="mb-2 text-lg font-bold">
                Can international students apply?
              </h3>
              <p className="text-gray-600">
                Yes, we welcome applications from international students who
                meet the visa requirements for working in our location.
              </p>
            </div>

            <div className="p-6 bg-[#f9f5f0] rounded-xl">
              <h3 className="mb-2 text-lg font-bold">
                Is there a possibility of full-time employment after the
                internship?
              </h3>
              <p className="text-gray-600">
                Outstanding interns are often considered for full-time positions
                based on their performance and our hiring needs.
              </p>
            </div>

            <div className="p-6 bg-[#f9f5f0] rounded-xl">
              <h3 className="mb-2 text-lg font-bold">
                What software skills are required?
              </h3>
              <p className="text-gray-600">
                Required skills vary by position, but proficiency in
                industry-standard design software is generally expected.
              </p>
            </div>

            <div className="p-6 bg-[#f9f5f0] rounded-xl">
              <h3 className="mb-2 text-lg font-bold">
                How many hours per week will I work?
              </h3>
              <p className="text-gray-600">
                Most internships require 20-40 hours per week, depending on the
                position and whether it's part-time or full-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-[#b89048]">
        <div className="container px-4 mx-auto">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Ready to Start Your Creative Journey?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-white/90">
            Join our internship program and take the first step towards a
            successful career in art and design.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#b89048] hover:bg-gray-100"
          >
            Apply for an Internship
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
