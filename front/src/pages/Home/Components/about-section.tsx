import { Calendar, GraduationCap, Users } from "lucide-react"

export const AboutSection = () => (
  <section className="py-20 bg-white">
    <div className="container px-4 mx-auto">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">About Our Internship Program</h2>
        <p className="text-lg text-gray-600">
          D-Talk's internship program offers a unique opportunity to work alongside experienced artists and designers,
          gaining hands-on experience in the creative industry while developing your artistic skills.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="p-6 transition-all duration-300 bg-[#f9f5f0] rounded-xl hover:shadow-md">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#b89048]/10">
            <GraduationCap className="w-8 h-8 text-[#b89048]" />
          </div>
          <h3 className="mb-2 text-lg font-bold">Learn & Grow</h3>
          <p className="text-gray-600">
            Develop your skills under the guidance of professional artists and designers who will mentor you throughout
            your journey.
          </p>
        </div>

        <div className="p-6 transition-all duration-300 bg-[#f9f5f0] rounded-xl hover:shadow-md">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#b89048]/10">
            <Users className="w-8 h-8 text-[#b89048]" />
          </div>
          <h3 className="mb-2 text-lg font-bold">Build Connections</h3>
          <p className="text-gray-600">
            Network with industry professionals and fellow interns, creating valuable connections that will benefit your
            future career.
          </p>
        </div>

        <div className="p-6 transition-all duration-300 bg-[#f9f5f0] rounded-xl hover:shadow-md">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#b89048]/10">
            <Calendar className="w-8 h-8 text-[#b89048]" />
          </div>
          <h3 className="mb-2 text-lg font-bold">Real Projects</h3>
          <p className="text-gray-600">
            Work on real client projects and build a professional portfolio that showcases your talents and abilities.
          </p>
        </div>
      </div>
    </div>
  </section>
)

