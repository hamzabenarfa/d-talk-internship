import TestimonialCard from "@/components/testimonial-card"

export const TestimonialsSection = () => (
  <section className="py-20 bg-[#f9f5f0]">
    <div className="container px-4 mx-auto">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Hear From Our Past Interns</h2>
        <p className="text-lg text-gray-600">
          Discover what previous interns have to say about their experience at D-Talk.
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
)

