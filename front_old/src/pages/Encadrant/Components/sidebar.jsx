import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { GiProgression } from "react-icons/gi";
import axiosInstance from "../../../../axios-instance";
const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);
  const [myAdvancement, setMyAdvancement] = useState({});

  useEffect(() => {
    getMyAdvancement();
  }, []);
  
  async function getMyAdvancement() {
    try {
      const res = await axiosInstance.get("candidature/avancement/supervisor");
      console.log(res.data)
      setMyAdvancement(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-gray-900 text-gray-200 overflow-hidden">
      <div className="flex flex-col h-full justify-between p-4">
        <div>
          <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text p-4">
            Home
          </h1>
          <div className="flex items-center justify-center flex-col gap-4 p-8">
            <Link to="profil">
              <img
                src="/images/user.jpg"
                alt="user"
                className="h-16 w-16 rounded-full"
              />
            </Link>
            <div className="text-center">
              <span className="block text-2xl capitalize font-bold">
                {user.nom}
              </span>
              <span className="block text-xs capitalize font-medium">
                Encadrant
              </span>
            </div>
          </div>

          {myAdvancement.length > 0 && (
            <ul>
              <p className="flex items-center font-bold text-blue-500  p-2 rounded-md">
                Stage affectes :
              </p>
              {myAdvancement.map((advancement) => (
                <NavLink
                  key={advancement.id}
                  to={`/encadrant/stage/${advancement.id}`}
                  className="ml-4 "
                >
                  <li className="flex items-center  ml-4 text-blue-500 hover:text-blue-700 cursor-pointer">
                    {advancement.sujet.titre}
                  </li>
                </NavLink>
              ))}
            </ul>
          )}

          <ul>
          <NavLink
                  to={`/encadrant/validation-stage`}
                  className=""
                  >
                  <li className="flex items-center  mt-6 ml-2 font-bold text-blue-500 hover:text-blue-700 cursor-pointer">
                    Validation Stage
                  </li>
                </NavLink>
          </ul>
                  </div>
        <div>
          <Link
            to="/"
            onClick={handleLogout}
            className="flex items-center justify-start text-blue-500 hover:text-blue-700 cursor-pointer p-2 rounded-md w-full"
          >
            <AiOutlineLogout className="text-lg" />
            <span className="ml-4 text-sm font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
