import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/logotexticon.png";
import { AuthContext } from "../contexts/authContext";
import { GrClose } from "react-icons/gr";
import { IoLogOutOutline } from "react-icons/io5";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import Avatar from "../assets/avatar.png";

const categories = [
  {
    name: "cars",
    image:
      "https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg",
  },
  {
    name: "fitness",
    image:
      "https://i.pinimg.com/236x/25/14/29/251429345940a47490cc3d47dfe0a8eb.jpg",
  },
  {
    name: "wallpaper",
    image:
      "https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg",
  },
  {
    name: "websites",
    image:
      "https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg",
  },
  {
    name: "photo",
    image:
      "https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg",
  },
  {
    name: "food",
    image:
      "https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg",
  },
  {
    name: "nature",
    image:
      "https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg",
  },
  {
    name: "art",
    image:
      "https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg",
  },
  {
    name: "travel",
    image:
      "https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg",
  },
  {
    name: "quotes",
    image:
      "https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg",
  },
  {
    name: "cats",
    image:
      "https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg",
  },
  {
    name: "dogs",
    image:
      "https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg",
  },
  {
    name: "others",
    image:
      "https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg",
  },
];

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
