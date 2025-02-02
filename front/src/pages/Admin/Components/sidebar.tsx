import React from 'react';
import { AiOutlineUser, AiOutlineLogout, AiFillFile } from 'react-icons/ai';
import { Link } from 'react-router-dom'; // Correcting import for Link
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/authActions';
import { NavLink } from 'react-router-dom';

import { MdOutlineAssignmentInd } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
const Sidebar = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);


  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-gray-200">
      <div className="w-60 p-5">
        <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
          <AiOutlineUser className="text-lg text-blue-500 hover:text-blue-700 cursor-pointer" />
          <div className="flex-1 ml-4">
            <span className="block text-sm font-medium">{user.nom}</span>
          </div>
        </div>
        <ul className="mt-6">
          <NavLink to="/admin/dashboard" className="ml-4 text-sm font-medium">
            <li className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
              <AiOutlineUser className="text-lg" />
              Dashboard 
            </li>
          </NavLink>
        </ul>
        <ul className="mt-6">
          <NavLink to="/admin/gestion-users" className="ml-4 text-sm font-medium">
            <li className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
              <AiOutlineUser className="text-lg" />
              Gestion Users 
            </li>
          </NavLink>
        </ul>
        <ul className="">
          <NavLink to="/admin/gestion-sujet" className="ml-4 text-sm font-medium">
            <li className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
              <AiFillFile className="text-lg" />
              Gestion sujet
            </li>
          </NavLink>
        </ul>
        <ul>
            <NavLink to="/admin/candidats" className="ml-4 text-sm font-medium">
              <li className="flex items-center gap-1 text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
                <MdOutlineAssignmentInd className="text-lg" />
                Candidats Stagiaires
              </li>
            </NavLink>
          </ul>
          <ul>
            <NavLink to="/admin/stagaire" className="ml-4 text-sm font-medium">
              <li className="flex items-center gap-1 text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
                <PiStudentFill className="text-lg" />
                Stagiaires Acceptes
              </li>
            </NavLink>
          </ul>
        <Link to="/" onClick={handleLogout} className=" absolute bottom-5 flex items-center text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md">
          <AiOutlineLogout className="text-lg" />
          <span className="ml-4 text-sm font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
