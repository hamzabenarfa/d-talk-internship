"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const SujetFormModal = ({ sujet, closeModal, setSujets, editMode, token, categories = [] }) => {
  // Update the formData state to include categoryId
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categoryId: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update the useEffect to handle the data structure correctly
  useEffect(() => {
    if (editMode && sujet) {
      setFormData({
        titre: sujet.titre || "",
        description: sujet.description || "",
        categoryId: sujet.categoryId || 0
      })
    }
  }, [editMode, sujet])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Update the handleCategoryChange function
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: Number.parseInt(value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let response
      if (editMode) {
        response = await axiosInstance.put(`sujet/update/${sujet.id}`, formData)
        toast.success("Sujet modifié avec succès")
      } else {
        response = await axiosInstance.post("sujet/create", formData)
        toast.success("Sujet ajouté avec succès")
      }

      // Update the sujets list
      setSujets((prev) => {
        if (editMode) {
          return prev.map((item) => (item.id === sujet.id ? response.data : item))
        } else {
          return [...prev, response.data]
        }
      })

      closeModal()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error)
      toast.error(editMode ? "Échec de la modification du sujet" : "Échec de l'ajout du sujet")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Modifier le sujet" : "Ajouter un nouveau sujet"}</DialogTitle>
          <DialogDescription>
            {editMode ? "Modifiez les détails du sujet ci-dessous" : "Remplissez les détails du nouveau sujet"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Titre du sujet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du sujet"
              required
              rows={4}
            />
          </div>

          {/* Update the Select component to use categoryId */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Catégorie</Label>
            <Select value={formData.categoryId.toString()} onValueChange={handleCategoryChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id || category.id} value={(category._id || category.id).toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editMode ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SujetFormModal

