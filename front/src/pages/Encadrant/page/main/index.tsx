// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast"
import axiosInstance from "@/axios-instance"
import { logout } from "../../../../redux/actions/authActions"

// Import icons from a compatible package like react-icons or lucide-react
import { Edit, KeyRound, Trash2, Mail, Phone, Calendar, Clock, Loader2 } from "lucide-react"

// Import shadcn components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserData {
  nom: string
  prenom: string
  email: string
  telephone: string
  dateDeNaissance: string
  createdAt: string
  role?: string
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Fetch user profile
  async function getMyProfile() {
    setIsLoading(true)
    try {
      const result = await axiosInstance.get("user/profile")
      setUserData(result.data)
      setFormData({
        nom: result.data.nom,
        prenom: result.data.prenom,
        email: result.data.email,
        telephone: result.data.telephone,
      })
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMyProfile()
  }, [])

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  // Submit updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axiosInstance.put("user/update-profile", formData)
      await getMyProfile()
      setIsEditModalOpen(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Failed to update user profile:", error)
      toast.error(error.response?.data?.error || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    setIsSubmitting(true)
    try {
      await axiosInstance.put("user/change-password", passwordData)
      setIsPwdModalOpen(false)
      toast.success("Password changed successfully")

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsSubmitting(true)
    try {
      await axiosInstance.delete("user/delete-account")
      setIsDeleteModalOpen(false)
      dispatch(logout())
      toast.success("Account deleted successfully")
      navigate("/login")
    } catch (error) {
      console.error("Failed to delete account:", error)
      toast.error(error.response?.data?.error || "Failed to delete account")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!userData) return "U"
    return `${userData.nom.charAt(0)}${userData.prenom.charAt(0)}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">
            {userData?.nom} {userData?.prenom}
          </CardTitle>
          <CardDescription>
            <Badge variant="outline" className="mt-1">
              {userData?.role || "Encadrant"}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{userData?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{userData?.telephone}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Born: {userData?.dateDeNaissance ? new Date(userData.dateDeNaissance).toLocaleDateString() : "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Joined: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-3 pt-6">
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>

          <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => setIsPwdModalOpen(true)}>
            <KeyRound className="h-4 w-4" /> Change Password
          </Button>

          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete Account
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">First Name</Label>
                <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom">Last Name</Label>
                <Input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Phone Number</Label>
              <Input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPwdModalOpen} onOpenChange={setIsPwdModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPwdModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-destructive font-medium">Are you sure you want to delete your account?</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserProfile
