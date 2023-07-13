import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/logotexticon.png";
import { AuthContext } from "../contexts/authContext";
import { IoLogOutOutline } from "react-icons/io5";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { categories } from "../data/categories";

const notActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-4 rounded-r border-black  transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ setToggleSidebar }) => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleCloseSidebar = () => {
    if (setToggleSidebar) setToggleSidebar(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll hover:min-w-[210]">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-[190] items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-28" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : notActiveStyle
            }
            onCanPlay={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : notActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-8 h-8 rounded-full"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <div className="bg-white rounded-lg mb-4 p-2 shadow-lg mx-3">
          <Link
            to={`/user-profile/${user.uid}`}
            className="flex my-5 gap-2 items-center"
            onClick={handleCloseSidebar}
          >
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <p className="flex items-center gap-2">
              {user.displayName} <IoIosArrowForward />
            </p>
          </Link>
          <button className="flex items-center gap-2" onClick={handleSignOut}>
            Sign Out
            <IoLogOutOutline />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
