// @ts-nocheck
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const ApplicationProcessSection = () => (
  <section className="py-20 bg-white">
    <div className="container px-4 mx-auto">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Application Process</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0 bg-[#b89048]">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">Submit Your Application</h3>
                <p className="text-gray-600">
                  Fill out our online application form and upload your portfolio showcasing your best work.
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
                  Our team will review your portfolio and application to assess your skills and potential fit.
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
                  Selected candidates will be invited for an interview to discuss their experience, goals, and
                  expectations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 text-white rounded-full shrink-0 bg-[#b89048]">
                4
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">Offer & Onboarding</h3>
                <p className="text-gray-600">
                  Successful candidates will receive an offer and go through our onboarding process to begin their
                  internship journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img src="/images/happy.jpg" alt="Application Process" className="object-cover w-full h-full" />
          </div>
          <div className="absolute -bottom-6 -right-6 p-6 bg-white rounded-xl shadow-lg max-w-xs">
            <h3 className="mb-2 text-lg font-bold">Ready to Apply?</h3>
            <p className="mb-4 text-sm text-gray-600">Take the first step towards your creative career with D-Talk.</p>
            <Link to="search">
              <Button className="w-full bg-[#b89048] hover:bg-[#a07a30] text-white">Apply Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
)

