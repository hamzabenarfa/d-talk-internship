"use client"

// @ts-nocheck
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import axiosInstance from "../../../../axios-instance"
import { logout } from "../../../redux/actions/authActions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, GraduationCap, CheckCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"

// Types
interface Advancement {
  id: number
  valide: boolean
  sujet: {
    titre: string
  }
}

interface User {
  nom: string
  email: string
}

export function EncadrantSidebar() {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.auth.user?.user)
  const [myAdvancement, setMyAdvancement] = useState<Advancement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch advancement data on component mount
  useEffect(() => {
    getMyAdvancement()
  }, [])

  const getMyAdvancement = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("candidature/avancement/supervisor")
      setMyAdvancement(response.data)
    } catch (error) {
      console.error("Error fetching advancement data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout action
  const handleLogout = () => {
    dispatch(logout())
  }

  // Helper function to extract initials from a name
  const getInitials = (name?: string): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Filter active (non-validated) internships
  const activeInternships = myAdvancement.filter((advancement) => !advancement.valide)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user?.nom)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">{user?.nom}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Assigned Internships Section */}
        {(isLoading || activeInternships.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Stages Affectés
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading
                  ? // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuSkeleton />
                      </SidebarMenuItem>
                    ))
                  : // Active internships
                    activeInternships.map((advancement) => (
                      <SidebarMenuItem key={advancement.id}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={`/encadrant/stage/${advancement.id}`}
                            className={({ isActive }) =>
                              cn("flex items-center gap-3 w-full", isActive && "bg-primary text-primary-foreground")
                            }
                          >
                            <GraduationCap className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{advancement.sujet.titre}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Actions Section */}
        {!isLoading && myAdvancement.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/encadrant/validation-stage"
                      className={({ isActive }) =>
                        cn("flex items-center gap-3 w-full", isActive && "bg-primary text-primary-foreground")
                      }
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Validation Stage</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Paramètres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/encadrant/profil"
                    className={({ isActive }) =>
                      cn("flex items-center gap-3 w-full", isActive && "bg-primary text-primary-foreground")
                    }
                  >
                    <Settings className="h-4 w-4" />
                    <span>Mon Profil</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
                aria-label="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
