import React from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/*" element={<Home />}></Route>
    </Routes>
  );
};

export default App;
