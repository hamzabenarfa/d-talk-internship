// @ts-nocheck

import type React from "react"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { Building2, Clock, FileText, MapPin, Upload } from "lucide-react"
import axiosInstance from "@/axios-instance"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"

interface Sujet {
  id: string
  titre: string
  description: string
  location?: string
  duration?: string
  category?: string
  type?: string
}

export default function Sujet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() // Capture the current location
  const role = useSelector((state) => state.auth.user?.user?.role)

  const [sujet, setSujet] = useState<Sujet | null>(null)
  const [cvFile, setCvFile] = useState<FileList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    getSujetById()
  }, [id])

  async function getSujetById() {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get(`sujet/${id}`)
      setSujet(res.data)
    } catch (error) {
      console.error("Error fetching sujet:", error)
      toast.error("Failed to load internship details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files)
    }
  }

  const handleApplyClick = () => {
    if (role !== "CANDIDAT") {
      // Redirect to login page with the current location stored in state
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    setShowApplicationForm(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!cvFile || cvFile.length === 0) {
      toast.error("Please select at least one file")
      return
    }

    setIsSubmitting(true)
    const data = new FormData()

    for (let i = 0; i < cvFile.length; i++) {
      data.append("files", cvFile[i])
    }

    try {
      await axiosInstance.post(`/candidature/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Application submitted successfully!")
      navigate("/etudiant/liste-candidature")
    } catch (error: any) {
      console.error("Error submitting application:", error)
      toast.error(error.response?.data?.error || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!sujet) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Internship not found</p>
      </div>
    )
  }

  return (
    <div className="w-full  min-h-screen bg-gray-50">
      <Navbar />
    

    
      <div className="relative flex flex-col items-center justify-center h-80 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl text-white font-bold tracking-wider mb-4">{sujet.titre}</h1>
          <p className="text-lg md:text-xl font-medium text-white/90 max-w-2xl mx-auto">{sujet.description}</p>
        </div>
      </div>

      <div className="container mx-auto w-full lg:max-w-5xl p-4 md:p-6 -mt-20 relative z-20">
        <Card className="p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-semibold mb-4">Internship Details</h3>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{sujet.location || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{sujet.duration || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{sujet.category?.name || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{sujet.work || "Not specified"}</p>
              </div>
            </div>
          </div>
        </Card>

        {!showApplicationForm && (
          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleApplyClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium"
            >
              Apply for this Internship
            </Button>
          </div>
        )}

{showApplicationForm && role === "CANDIDAT" && (
  <Card className="p-6 shadow-lg">
    <h3 className="text-2xl font-semibold mb-4">Submit Your Application</h3>
    <Separator className="mb-6" />
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700">
          Upload Documents (CV, Cover Letter, etc.)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative hover:border-blue-500 transition-colors">
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Drag and drop files here or click to browse</p>
          <input
            type="file"
            id="cvFile"
            name="cvFile"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleCvFileChange}
            required
          />
          {cvFile && (
            <div className="mt-2 text-sm text-gray-600">
              {Array.from(cvFile).map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  </Card>
)}

        {role !== "CANDIDAT" && (
          <Card className="p-6 shadow-lg text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Please log in as a CANDIDAT to apply for this internship.
            </h3>
            <p className="text-gray-500">Only candidates can submit applications for internship opportunities.</p>
          </Card>
        )}
      </div>

   
    </div>
  )
}

