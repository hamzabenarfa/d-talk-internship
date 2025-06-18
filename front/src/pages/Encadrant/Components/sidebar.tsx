// @ts-nocheck
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../../../axios-instance";
import { logout } from "../../../redux/actions/authActions";

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// Types (optional: if using TypeScript)
interface Advancement {
  id: number;
  sujet: {
    titre: string;
  };
}

interface User {
  nom: string;
  email: string;
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user?.user);
  const [myAdvancement, setMyAdvancement] = useState<Advancement[]>([]);

  // Fetch advancement data on component mount
  useEffect(() => {
    getMyAdvancement();
  }, []);

  const getMyAdvancement = async () => {
    try {
      const response = await axiosInstance.get(
        "candidature/avancement/supervisor"
      );
      setMyAdvancement(response.data);
    } catch (error) {
      console.error("Error fetching advancement data:", error);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    dispatch(logout());
  };

  // Helper function to extract initials from a name
  const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-64 h-screen bg-background border-r flex flex-col">
      {/* Header with user info */}
      <header className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user?.nom)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nom}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </header>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        {myAdvancement.length > 0 && (
          <>
            <>
              <p className=" py-2 font-bold text-xl capitalize ">
                Les stage affectés :
              </p>
              <ul className="space-y-1">
                {myAdvancement.map((advancement) => (
                  !advancement.valide &&
                  <li key={advancement.id}>
                    <NavLink
                      to={`/encadrant/stage/${advancement.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      {advancement.sujet.titre}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>

            <Separator className="my-2 px-0" />

            <NavLink
              to="/encadrant/validation-stage"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              Validation Stage
            </NavLink>
          </>
        )}

        <NavLink
          to="/encadrant/profil"
          className={({ isActive }) =>
            cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          Settings
        </NavLink>
      </nav>

      {/* Footer with logout button */}
      <footer className="p-4 border-t mb-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          aria-label="Déconnexion"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </footer>
    </div>
  );
};

export default Sidebar;
