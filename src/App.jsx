import React, { useContext } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthContext } from "./contexts/authContext";
import Spinner from "./components/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { pending, user } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            !pending ? (
              !user ? (
                <Login />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <div className="flex justify-center items-center h-screen">
                <Spinner />
              </div>
            )
          }
        ></Route>
        <Route
          path="/*"
          element={
            !pending ? (
              user ? (
                <Home />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <div className="flex justify-center items-center h-screen">
                <Spinner />
              </div>
            )
          }
        ></Route>
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
