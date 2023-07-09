import React from "react";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logotext.png";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    const userDoc = doc(db, "users", res.user.uid);
    const userDocSnap = await getDoc(userDoc);

    if (!userDocSnap.exists()) {
      await setDoc(userDoc, {
        uid: res.user.uid,
        email: res.user.email,
        photoURL: res.user.photoURL,
        displayName: res.user.displayName,
        createdAt: new Date(),
        saves: [],
      });
    }
    navigate("/");
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          autoPlay
          loop
          muted
          controls={false}
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center inset-0 backdrop-brightness-50">
          <div className="p-5">
            <img src={logo} alt="logo" width={130} />
          </div>
          <div>
            <button
              className="bg-white text-black rounded-full px-5 py-3 flex items-center"
              onClick={handleSignIn}
            >
              <FcGoogle className="mr-2" />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
