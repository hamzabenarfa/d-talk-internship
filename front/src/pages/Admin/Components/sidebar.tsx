// @ts-nocheck

import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink } from "react-router-dom"
import { logout } from "../../../redux/actions/authActions"
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  GraduationCap,
  UserCheck,
  LogOut,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user.user)

  // Define the navigation links with Lucide icons
  const navLinks = [
    {
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/admin/gestion-users",
      icon: Users,
      label: "Gestion Users",
    },
    {
      path: "/admin/gestion-sujet",
      icon: FileText,
      label: "Gestion Sujet",
    },
    {
      path: "/admin/category",
      icon: FolderKanban,
      label: "Gestion Category",
    },
    {
      path: "/admin/candidats",
      icon: UserCheck,
      label: "Candidats Stagiaires",
    },
    {
      path: "/admin/stagaire",
      icon: GraduationCap,
      label: "Stagiaires Acceptes",
    },
    {
      path: "/admin/profile",
      icon: Settings,
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        cn("flex items-center gap-3 w-full", isActive && "bg-primary text-primary-foreground")
                      }
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                asChild
              >
                <Link to="/">
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Link>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
