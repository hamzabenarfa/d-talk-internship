

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  image: string
}

export default function TestimonialCard({ quote, name, role, image }: TestimonialCardProps) {
  return (
    <div className="flex flex-col h-full p-6 transition-all duration-300 bg-white rounded-xl shadow-sm hover:shadow-md">
      <div className="mb-6">
        <svg
          className="w-8 h-8 text-[#b89048]/40"
          fill="currentColor"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.7 25.4c-1.9 0-3.5-0.7-4.8-2s-2-3-2-5c0-1.3 0.2-2.6 0.7-3.8s1.1-2.4 1.9-3.5c0.8-1.1 1.9-2.1 3.1-3 1.3-0.9 2.7-1.7 4.2-2.4l1.6 2.8c-2.2 1.2-3.9 2.4-5 3.5-1.1 1.2-1.7 2.3-1.7 3.5 0 0.4 0.1 0.8 0.2 1.1s0.3 0.5 0.5 0.7c0.1 0.2 0.4 0.3 0.7 0.4 0.3 0.1 0.6 0.1 0.9 0.1 1.4 0 2.5-0.5 3.4-1.4s1.4-2.1 1.4-3.4c0-0.8-0.1-1.5-0.4-2.2s-0.7-1.3-1.1-1.8l2.5-1.8c0.7 0.9 1.3 1.9 1.7 3s0.6 2.3 0.6 3.5c0 1.4-0.3 2.7-0.8 3.8s-1.2 2.1-2.1 2.9c-0.9 0.8-1.9 1.4-3.1 1.8s-2.4 0.6-3.7 0.6zM26.7 25.4c-1.9 0-3.5-0.7-4.8-2s-2-3-2-5c0-1.3 0.2-2.6 0.7-3.8s1.1-2.4 1.9-3.5c0.8-1.1 1.9-2.1 3.1-3 1.3-0.9 2.7-1.7 4.2-2.4l1.6 2.8c-2.2 1.2-3.9 2.4-5 3.5-1.1 1.2-1.7 2.3-1.7 3.5 0 0.4 0.1 0.8 0.2 1.1s0.3 0.5 0.5 0.7c0.1 0.2 0.4 0.3 0.7 0.4 0.3 0.1 0.6 0.1 0.9 0.1 1.4 0 2.5-0.5 3.4-1.4s1.4-2.1 1.4-3.4c0-0.8-0.1-1.5-0.4-2.2s-0.7-1.3-1.1-1.8l2.5-1.8c0.7 0.9 1.3 1.9 1.7 3s0.6 2.3 0.6 3.5c0 1.4-0.3 2.7-0.8 3.8s-1.2 2.1-2.1 2.9c-0.9 0.8-1.9 1.4-3.1 1.8s-2.4 0.6-3.7 0.6z"></path>
        </svg>
      </div>

      <p className="mb-6 italic text-gray-600 grow">{quote}</p>

      <div className="flex items-center mt-auto">
        <div className="relative w-12 h-12 mr-4 overflow-hidden rounded-full">
          {/* <img src={image || "/placeholder.svg"} alt={name} fill className="object-cover" /> */}
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  )
}

