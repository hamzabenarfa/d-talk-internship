import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserCircleIcon } from "lucide-react"; // Import the icon you want to use
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user?.user);
  const isLoggedIn = !!user; // Checks if the user object exists

  const handleProfileClick = () => {
    if (user) {
      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "CANDIDAT":
          navigate("/etudiant");
          break;
        case "INTERN":
          navigate("/etudiant/dashboard");
          break;
        case "PROF_SUPERVISOR":
          navigate("/encadrant");
          break;
      }
    }
  };

  return (
    <header className="flex items-center justify-between px-10 border-1 border-b p-4">
      <div className="flex items-center gap-20">
      <Link to="/">
        <img src="/public/logo.png" alt="logo" className=" w-20" />
      </Link>
      <div className="flex items-center gap-2">

        <Link to="/stage">
          <Button variants="ghost" className="text-md font-normal ">Job</Button>
        </Link>
        <Link to="/stage">
          <Button variants="ghost" className="text-md font-normal ">Internship</Button>
        </Link>
      </div>
      </div>



      {isLoggedIn ? (
        <button onClick={handleProfileClick}>
          <UserCircleIcon className="size-8" />
        </button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
};

export default Header;
