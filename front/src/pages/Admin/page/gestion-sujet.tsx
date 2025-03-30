"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import axiosInstance from "../../../../axios-instance"
import SujetFormModal from "../Components/sujet-form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export default function GestionSujet() {
  const token = useSelector((state) => state.auth.user.access_token)
  const [sujets, setSujets] = useState([])
  const [categories, setCategories] = useState([])
  const [currentSujet, setCurrentSujet] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSujets, setFilteredSujets] = useState([])
  // Update the state to handle multiple categories
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await axiosInstance.get("sujet")
      setSujets(result.data)
      setFilteredSujets(result.data)
    } catch (error) {
      console.error("Échec du chargement des sujets", error)
      toast.error("Échec du chargement des sujets")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const result = await axiosInstance.get("category")
      setCategories(result.data)
    } catch (error) {
      console.error("Échec du chargement des catégories", error)
      toast.error("Échec du chargement des catégories")
    }
  }

  // Update the filter function to handle the many-to-many relationship
  useEffect(() => {
    // Filter sujets whenever the search term or selected category changes
    let filtered = sujets

    if (searchTerm) {
      filtered = filtered.filter(
        (sujet) =>
          sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sujet.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (sujet) =>
          // Check if the categoryId matches or if the categories array includes this category
          sujet.categoryId === Number.parseInt(selectedCategory) ||
          (sujet.categories &&
            sujet.categories.some(
              (cat) => cat.id === Number.parseInt(selectedCategory) || cat._id === selectedCategory,
            )),
      )
    }

    setFilteredSujets(filtered)
  }, [searchTerm, selectedCategory, sujets])

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce sujet ?")) {
      try {
        const res = await axiosInstance.delete(`sujet/delete/${id}`)
        if (res.status === 200) {
          setSujets((prevSujets) => prevSujets.filter((sujet) => sujet.id !== id))
          toast.success("Sujet supprimé avec succès")
        } else {
          toast.error("Échec de la suppression du sujet")
        }
      } catch (err) {
        toast.error("Échec de la suppression du sujet")
        console.error(err)
      }
    }
  }

  const handleAddOrEdit = (sujet) => {
    setCurrentSujet(sujet)
    setEditMode(sujet !== null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setCurrentSujet(null)
    setModalOpen(false)
    setEditMode(false)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
  }

  // Update the getCategoryName function to handle the many-to-many relationship
  const getCategoryName = (sujet) => {
    // If the sujet has categories array, use that
    if (sujet.categories && sujet.categories.length > 0) {
      return sujet.categories.map((cat) => cat.name).join(", ")
    }

    // Otherwise try to find by categoryId
    const category = categories.find((cat) => cat.id === sujet.categoryId || cat._id === sujet.categoryId)
    return category ? category.name : "Non catégorisé"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl">Gestion des Sujets</CardTitle>
          <CardDescription>Ajoutez, modifiez ou supprimez des sujets</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleAddOrEdit(null)} className="sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Sujet
              </Button>

              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher des sujets..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-8"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrer par catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id || category.id} value={category._id || category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table of Sujets */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-24" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-24 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : filteredSujets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucun sujet trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSujets.map((sujet) => (
                      <TableRow key={sujet.id}>
                        <TableCell className="font-medium">{sujet.titre}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{sujet.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCategoryName(sujet)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddOrEdit(sujet)}
                            className="h-8 w-8 p-0 mr-2"
                          >
                            <span className="sr-only">Modifier</span>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sujet.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <span className="sr-only">Supprimer</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {modalOpen && (
        <SujetFormModal
          sujet={currentSujet}
          closeModal={handleCloseModal}
          setSujets={setSujets}
          editMode={editMode}
          token={token}
          categories={categories}
        />
      )}
    </div>
  )
}

