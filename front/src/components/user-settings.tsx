"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axiosInstance from "../../axios-instance"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { updateUserProfile } from "../redux/actions/authActions"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User, Calendar, Clock, KeyRound, Edit, Save } from "lucide-react"

interface UserData {
  id?: number
  nom: string
  prenom: string
  email: string
  telephone: number
  dateDeNaissance?: string
  createdAt?: string
  role?: string
}

const UserSettings = () => {
  const [userData, setUserData] = useState<UserData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: 0,
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false)
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
  const dispatch = useDispatch()

  // Fetch user profile
  async function getMyProfile() {
    try {
      const result = await axiosInstance.get("user/profile")
      setUserData(result.data)
      setFormData({
        nom: result.data.nom,
        prenom: result.data.prenom,
        email: result.data.email,
        telephone: +result.data.telephone.toString(),
      })
    } catch (error: any) {
      console.error("Failed to fetch profile:", error)
      toast.error(error.response?.data?.error || "Failed to load profile data")
    }
  }

  useEffect(() => {
    getMyProfile()
  }, [])

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  // Modal handlers
  const openEditModal = () => setIsEditModalOpen(true)
  const closeEditModal = () => setIsEditModalOpen(false)
  const openPwdModal = () => setIsPwdModalOpen(true)
  const closePwdModal = () => setIsPwdModalOpen(false)

  // API calls
  const handleUpdateProfile = async () => {
    try {
      const response = await axiosInstance.put("user/update-profile", formData)
      if (response.status === 200) {
        toast.success("Profile updated successfully")
        getMyProfile()
        closeEditModal()

        // Update user in Redux store
        dispatch(updateUserProfile(formData))
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.error || "Failed to update profile")
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match")
      return
    }

    try {
      const response = await axiosInstance.put("user/change-password", passwordData)
      if (response.status === 204) {
        toast.success("Password changed successfully")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        closePwdModal()
      }
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error(error.response?.data?.error || "Failed to change password")
    }
  }

  // Get initials for avatar
  const getInitials = () => {
    return `${userData.nom.charAt(0)}${userData.prenom.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-background">
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=80&width=80&query=${userData.prenom}%20${userData.nom}`}
                    alt={`${userData.prenom} ${userData.nom}`}
                  />
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {userData.prenom} {userData.nom}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize text-sm font-medium">
                      {userData.role?.toLowerCase() || "User"}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Full Name</p>
                          <p className="text-sm text-muted-foreground">
                            {userData.prenom} {userData.nom}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{userData.telephone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Information</h3>
                    <div className="space-y-3">
                      {userData.dateDeNaissance && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Date of Birth</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(userData.dateDeNaissance).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {userData.createdAt && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Member Since</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(userData.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="gap-2" onClick={openEditModal}>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Password</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-2" onClick={openPwdModal}>
                <KeyRound className="h-4 w-4" />
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Last Name</Label>
              <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prenom">First Name</Label>
              <Input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telephone">Phone</Label>
              <Input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPwdModalOpen} onOpenChange={setIsPwdModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closePwdModal}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} className="gap-2">
              <Save className="h-4 w-4" />
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserSettings
