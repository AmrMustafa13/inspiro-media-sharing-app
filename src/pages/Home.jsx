import React, { useState, useRef, useEffect, useContext } from "react";
import { HiMenu } from "react-icons/hi";
import { GrFormClose } from "react-icons/gr";
import { Link, Route, Routes } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import Sidebar from "../components/Sidebar";
import Pins from "../components/Pins";
import logo from "../assets/logotexticon.png";
import { AuthContext } from "../contexts/authContext";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const { user } = useContext(AuthContext);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar setToggleSidebar={setToggleSidebar} />
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
          <Link to={`user-profile/${user?.uid}`}>
            <img
              src={user?.photoURL}
              alt="logo"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
        <AnimatePresence>
          {toggleSidebar && (
            <motion.div
              className="fixed w-2/3 bg-white h-screen overflow-y-auto shadow-md z-10"
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              exit={{
                x: "-100%",
              }}
            >
              <div className="absolute w-full flex justify-end items-center p-2">
                <GrFormClose
                  fontSize={30}
                  onClick={() => setToggleSidebar(false)}
                  className="cursor-pointer m-4"
                />
              </div>
              <Sidebar setToggleSidebar={setToggleSidebar} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
