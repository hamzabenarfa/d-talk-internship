import React from 'react';
import { AiOutlineUser, AiOutlineLogout, AiFillFile } from 'react-icons/ai';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/authActions';
import { MdCategory, MdOutlineAssignmentInd } from 'react-icons/md';
import { PiStudentFill } from 'react-icons/pi';

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);

  // Define the navigation links
  const navLinks = [
    {
      path: '/admin/dashboard',
      icon: <AiOutlineUser className="text-lg" />,
      label: 'Dashboard',
    },
    {
      path: '/admin/gestion-users',
      icon: <AiOutlineUser className="text-lg" />,
      label: 'Gestion Users',
    },
    {
      path: '/admin/gestion-sujet',
      icon: <AiFillFile className="text-lg" />,
      label: 'Gestion Sujet',
    },
    {
      path: '/admin/category',
      icon: <MdCategory className="text-lg" />,
      label: 'Gestion Category',
    },
    {
      path: '/admin/candidats',
      icon: <MdOutlineAssignmentInd className="text-lg" />,
      label: 'Candidats Stagiaires',
    },
    {
      path: '/admin/stagaire',
      icon: <PiStudentFill className="text-lg" />,
      label: 'Stagiaires Acceptes',
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-gray-200">
      <div className="w-60 p-5">
        {/* User Info */}
        <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
          <AiOutlineUser className="text-lg text-blue-500 hover:text-blue-700 cursor-pointer" />
          <div className="flex-1 ml-4">
            <span className="block text-sm font-medium">{user.nom}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="mt-6 space-y-2">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md ${
                    isActive ? 'bg-gray-700' : ''
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
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