// @ts-nocheck
"use client"

import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink, useLocation } from "react-router-dom"
import { logout } from "../../../redux/actions/authActions"
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  GraduationCap,
  UserCheck,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const Sidebar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user.user)
  const location = useLocation()

  // Define the navigation links with Lucide icons
  const navLinks = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      path: "/admin/gestion-users",
      icon: <Users className="h-5 w-5" />,
      label: "Gestion Users",
    },
    {
      path: "/admin/gestion-sujet",
      icon: <FileText className="h-5 w-5" />,
      label: "Gestion Sujet",
    },
    {
      path: "/admin/category",
      icon: <FolderKanban className="h-5 w-5" />,
      label: "Gestion Category",
    },
    {
      path: "/admin/candidats",
      icon: <UserCheck className="h-5 w-5" />,
      label: "Candidats Stagiaires",
    },
    {
      path: "/admin/stagaire",
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Stagiaires Acceptes",
    },
    {
      path: "/admin/profile",
      icon: <Settings className="h-5 w-5" />,
      label: "Mon Profil",
    },
  ]

  const handleLogout = () => {
    dispatch(logout())
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="w-64 h-screen bg-background border-r flex flex-col">
      {/* Header with user info */}
      <div className="p-4">
        <div className="flex items-center space-x-3 py-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.nom)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{user.nom}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer with logout */}
      <div className="p-4 mt-auto">
        <Separator className="mb-4" />
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          asChild
        >
          <Link to="/">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Sidebar

