import { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineLogout, AiFillFile } from "react-icons/ai";
import { Link } from "react-router-dom"; // Correcting import for Link
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { NavLink } from "react-router-dom";
import { GiProgression } from "react-icons/gi";
import axiosInstance from "../../../../axios-instance";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);
  const [myAdvancement, setMyAdvancement] = useState({});


  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="hidden md:w-64 md:block  bg-gray-900 text-gray-200">
      <div className="py-10 px-4  ">
        <Link to="/">
          <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
            Home
          </h1>
        </Link>

        <div className="flex items-center justify-center flex-col gap-4 p-8 ">
          <img
            src="/images/user.jpg"
            alt="user"
            className=" h-16 w-16 rounded-full"
          />
          <div className="flex items-center justify-center flex-col">
            <span className="block text-2xl capitalize font-bold">
              {user.nom}
            </span>
            <span className="block text-xs capitalize font-meduim">
              {user.role}
            </span>
          </div>
        </div>

        <ul className="flex  flex-col justify-center  w-full mt-6">
        
          <li className="flex items-center gap-1  text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
            <NavLink to="/etudiant" className=" text-sm font-medium">
              liste des stages
            </NavLink>
          </li>
          <li className="flex items-center gap-1  text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
            <NavLink to="/etudiant/liste-candidature" className=" text-sm font-medium">
              liste de mes candidatures
            </NavLink>
          </li>

          
            <NavLink
              to="/etudiant/avancement"
              className=" text-sm font-medium"
            >
              <li className="flex  text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
               <p>
               Tache des stage
                </p> 
               
              </li>
            </NavLink>
          
        </ul>

        <Link
          to="/"
          onClick={handleLogout}
          className="absolute bottom-5 flex items-center text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md"
        >
          <AiOutlineLogout className="text-lg" />
          <span className="ml-4 text-sm font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
