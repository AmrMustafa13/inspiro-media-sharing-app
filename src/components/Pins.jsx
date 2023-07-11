import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Feed from "./Feed";
import PinDetail from "../pages/PinDetail";
import CreatePin from "../pages/CreatePin";
import Search from "./Search";

const Pins = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/pin-detail/:pinId" element={<PinDetail />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route
            path="/search"
            element={
              <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route
            path="*"
            element={
              <h1
                className="
          text-3xl text-center font-bold text-gray-500 mt-10
          "
              >
                Page Not Found
              </h1>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
