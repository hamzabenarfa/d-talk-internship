"use client"

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { Search, Plus, Pencil, Trash2, Loader2, UserCheck, UserX } from 'lucide-react'
import UserFormModal from '../Components/user-form-modal'
import axiosInstance from '../../../../axios-instance'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GestionUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  const token = useSelector(state => state.auth.user.access_token)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('http://localhost:4000/user')
      setUsers(response.data)
      setFilteredUsers(response.data)
      setError('')
    } catch (error) {
      console.error("Failed to fetch users:", error)
      setError('Failed to fetch users. Please try again.')
      toast.error('Échec du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await axiosInstance.delete(`http://localhost:4000/user/delete/${userId}`)
        fetchUsers()
        toast.success('Utilisateur supprimé avec succès')
      } catch (err) {
        console.error("Failed to delete user:", err)
        toast.error('Échec de la suppression de lutilisateur')
      }
    }
  }

  const handleAddOrEditUser = (user) => {
    setSelectedUser(user)
    setEditMode(user !== null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setModalOpen(false)
    setEditMode(false)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleBadgeVariant = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'default'
      case 'USER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl">Gestion des Utilisateurs</CardTitle>
          <CardDescription>
            Ajoutez, modifiez ou supprimez des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => handleAddOrEditUser(null)} 
                className="sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Utilisateur
              </Button>
              
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher des utilisateurs..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                {error}
              </div>
            )}

            {/* Users Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date de Naissance</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array(5).fill(0).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur disponible'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium capitalize">{user.nom}</TableCell>
                        <TableCell className="capitalize">{user.prenom}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telephone || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.dateDeNaissance)}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAddOrEditUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteUser(user.id)}
                                disabled={user.role === 'ADMIN'}
                                className={user.role === 'ADMIN' ? 'text-muted-foreground' : 'text-destructive'}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
        <UserFormModal
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdate={fetchUsers}
          token={token}
          editMode={editMode}
        />
      )}
    </div>
  )
}

export default GestionUsers
