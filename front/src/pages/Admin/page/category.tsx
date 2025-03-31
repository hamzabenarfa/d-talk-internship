
import { useState, useEffect } from "react"
import axiosInstance from "@/axios-instance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const API_URL = "category" // Replace with your backend URL

const Category = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [editCategory, setEditCategory] = useState({ id: null, name: "" })
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all categories
  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(API_URL)
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
 
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Create a new category
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axiosInstance.post(API_URL, { name: newCategory })
      setNewCategory("")
      fetchCategories()
   
    } catch (error) {
      console.error("Error creating category:", error)
 
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing category
  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axiosInstance.put(`${API_URL}/${editCategory.id}`, { name: editCategory.name })
      setEditCategory({ id: null, name: "" })
      fetchCategories()
   
    } catch (error) {
      console.error("Error updating category:", error)
   
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a category
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    setIsLoading(true)
    try {
      await axiosInstance.delete(`${API_URL}/${id}`)
      fetchCategories()
      
    } catch (error) {
      console.error("Error deleting category:", error)
    
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditCategory({ id: null, name: "" })
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl">Category Management</CardTitle>
          <CardDescription>Create, edit and manage your categories</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Create Category Form */}
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium mb-4">Add New Category</h3>
              <form onSubmit={handleCreateCategory} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </form>
            </div>

            {/* Edit Category Form */}
            {editCategory.id && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h3 className="text-lg font-medium mb-4">Edit Category</h3>
                <form onSubmit={handleUpdateCategory} className="flex gap-2">
                  <Input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" variant="default" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </form>
              </div>
            )}

            {/* Display Categories */}
            <div>
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No categories found. Add your first category above.
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[180px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {category.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditCategory({ id: category.id, name: category.name })}
                              className="h-8 w-8 p-0 mr-2"
                            >
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Category

