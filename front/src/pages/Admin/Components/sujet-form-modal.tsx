// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import * as yup from "yup"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"
import axiosInstance from "../../../../axios-instance"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// ✅ Yup Validation Schema
const sujetSchema = yup.object().shape({
  titre: yup.string().required("Le titre est requis"),
  description: yup.string().required("La description est requise"),
  location: yup.string().optional(),
  categoryId: yup
    .number()
    .min(1, "Veuillez sélectionner une catégorie")
    .required("La catégorie est requise"),
  duration: yup
    .number()
    .typeError("La durée doit être un nombre")
    .positive("La durée doit être positive")
    .integer("La durée doit être un entier")
    .required("La durée est requise"),
  deadline: yup
    .date()
    .min(new Date(), "La date limite doit être dans le futur")
    .required("La date limite est requise"),
  work: yup
    .string()
    .oneOf(["ONSITE", "REMOTE", "HYBRID"], "Type de travail invalide")
    .required("Le type de travail est requis"),
})

const SujetFormModal = ({ sujet, closeModal, setSujets, editMode, token, categories = [] }) => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categoryId: 0,
    duration: "",
    deadline: "",
    work: "ONSITE",
    location: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editMode && sujet) {
      setFormData({
        titre: sujet.titre || "",
        description: sujet.description || "",
        categoryId: sujet.categoryId || 0,
        duration: sujet.duration || "",
        deadline: sujet.deadline
          ? new Date(sujet.deadline).toISOString().split("T")[0]
          : "",
        work: sujet.work || "ONSITE",
        location: sujet.location || "",
      })
    }
  }, [editMode, sujet])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = await sujetSchema.validate(formData, {
        abortEarly: false,
      })

      let response
      if (editMode) {
        response = await axiosInstance.put(`sujet/update/${sujet.id}`, validatedData)
        toast.success("Sujet modifié avec succès")
      } else {
        response = await axiosInstance.post("sujet/create", validatedData)
        toast.success("Sujet ajouté avec succès")
      }

      setSujets((prev) =>
        editMode
          ? prev.map((item) =>
              item.id === sujet.id ? response.data : item
            )
          : [...prev, response.data]
      )

      closeModal()
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {}
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message
        })
        setErrors(newErrors)
      } else {
        toast.error("Une erreur est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Modifier le sujet" : "Ajouter un sujet"}</DialogTitle>
          <DialogDescription>
            {editMode
              ? "Modifiez les détails du sujet ci-dessous"
              : "Remplissez les informations pour créer un nouveau sujet"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Titre du sujet"
            />
            {errors.titre && <p className="text-red-500 text-sm">{errors.titre}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du sujet"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Lieu */}
          <div>
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Lieu (facultatif)"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          {/* Catégorie */}
          <div>
            <Label>Catégorie</Label>
            <Select
              value={formData.categoryId.toString()}
              onValueChange={(val) => handleSelectChange("categoryId", parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id || cat._id} value={(cat.id || cat._id).toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
          </div>

          {/* Durée */}
          <div>
            <Label htmlFor="duration">Durée (jours)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Durée en jours"
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>

          {/* Date limite */}
          <div>
            <Label htmlFor="deadline">Date limite</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
            />
            {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}
          </div>

          {/* Type de travail */}
          <div>
            <Label>Type de travail</Label>
            <Select
              value={formData.work}
              onValueChange={(val) => handleSelectChange("work", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de travail" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONSITE">Sur site</SelectItem>
                <SelectItem value="REMOTE">À distance</SelectItem>
                <SelectItem value="HYBRID">Hybride</SelectItem>
              </SelectContent>
            </Select>
            {errors.work && <p className="text-red-500 text-sm">{errors.work}</p>}
          </div>

          {/* Boutons */}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editMode ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SujetFormModal
