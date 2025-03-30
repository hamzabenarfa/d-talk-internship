import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-8 pt-6 pb-2 ">
        <Link to="/">
          <img src="/public/logo.png" alt="logo" className=" w-20" />
        </Link>

      <div className="hidden md:flex items-center gap-8">
      <Link to="/">
          Home
        </Link>
        <Link to="search" className="text-gray-600 hover:text-gray-900">
        Find a Internship
        </Link>
        <Link to="#" className="text-gray-600 hover:text-gray-900">
          About us
        </Link>
        <Link to="#" className="text-gray-600 hover:text-gray-900">
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
      <Link to="/login">

        <Button variant="outline" size="lg" className=" rounded-full">Login</Button>
        </Link>
        <Link to="/signup">

        <Button size="lg" className=" rounded-full">
          Sign Up
        </Button>
        </Link>
      </div>
    </nav>
  );
}
