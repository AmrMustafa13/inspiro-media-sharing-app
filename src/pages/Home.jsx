import React, { useState, useRef, useEffect, useContext } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import Sidebar from "../components/Sidebar";
import Pins from "../components/Pins";
import logo from "../assets/logo.png";
import { AuthContext } from "../contexts/authContext";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const [userData, setUserData] = useState(null);

  const { user } = useContext(AuthContext);

  const scrollRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const userDoc = doc(db, "users", user?.uid);
      const userDocSnap = await getDoc(userDoc);
      setUserData(userDocSnap.data());
    };
    getUserData();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar setToggleSidebar={setToggleSidebar} userData={userData} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${userData?.uid}`}>
            <img
              src={userData?.photoURL}
              alt="logo"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 ">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                onClick={() => setToggleSidebar(false)}
                className="cursor-pointer"
              />
            </div>
            <Sidebar setToggleSidebar={setToggleSidebar} userData={userData} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins />} />
        </Routes>
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Home;
