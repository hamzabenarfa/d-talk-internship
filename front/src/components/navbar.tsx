// @ts-nocheck
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // Safely retrieve and parse user data from localStorage
  const authed = localStorage.getItem("user");
  const authedd = authed ? JSON.parse(authed) : null;

  // Safely extract the role
  const role = authedd?.user?.role || null; // Default to null if user or role is undefined
  console.log("🚀 ~ Navbar ~ role:", role)

  const goToDashboard = () => {
    switch (role) {
      case "RESPONSABLE":
        navigate("/admin/dashboard");
        break;
      case "CANDIDAT":
      case "INTERN":
        navigate("/etudiant");
        break;
      case "PROF_SUPERVISOR":
        navigate("/encadrant");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Internship", to: "/search" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f9f5f0]/80 backdrop-blur-md border-b border-[#b89048]/10">
      <div className="container flex items-center justify-between lg:justify-evenly h-16 px-4 mx-auto">
        <Link to="/">
          <img src="/public/logo.png" alt="logo" className="w-20" />
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-[#b89048]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          {/* Check if authedd exists */}
          {!authedd ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="hidden md:inline-flex rounded-full"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="lg"
                  className="hidden bg-[#b89048] hover:bg-[#a07a30] text-white md:inline-flex rounded-full"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
              <Button
                onClick={goToDashboard}
                size="lg"
                className="hidden bg-[#b89048] hover:bg-[#a07a30] text-white md:inline-flex rounded-full"
              >
                Dashboard
              </Button>
     
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                  <Link
                    to="/"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-2xl font-bold text-[#b89048]">
                      D-Talk
                    </span>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col py-6 space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="text-lg font-medium text-gray-700 transition-colors hover:text-[#b89048]"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-6 border-t flex flex-col gap-2">
                  {!authedd ? (
                    <>
                      <Link to="/login">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full rounded-full"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button
                          size="lg"
                          className="bg-[#b89048] hover:bg-[#a07a30] text-white w-full rounded-full"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : (
             
                      <Button
                        onClick={goToDashboard}
                        size="lg"
                        className="bg-[#b89048] hover:bg-[#a07a30] text-white w-full rounded-full"
                      >
                        Dashboard
                      </Button>
                 
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
