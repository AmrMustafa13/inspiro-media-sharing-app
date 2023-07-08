import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/authContext";

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);

  const [userData, setUserData] = useState(null);
  const [postedByUserData, setPostedByUserData] = useState(null);

  const { user } = useContext(AuthContext);

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
    const getPostedByUserData = async () => {
      const userDoc = doc(db, "users", pin?.postedBy);
      const userDocSnap = await getDoc(userDoc);
      setPostedByUserData(userDocSnap.data());
    };
    getPostedByUserData();
  }, [pin]);

  const saved = userData?.saves?.includes(pin.id);

  const handleSavePin = async (e) => {
    e.stopPropagation();
    const userDoc = doc(db, "users", user?.uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      const userSavedPins = userSnap.data().saves;
      await setDoc(userDoc, {
        ...userSnap.data(),
        saves: [...userSavedPins, pin.id],
      });
    }
  };

  const handleDeletePin = async (e) => {
    e.stopPropagation();
    const userDoc = doc(db, "users", user?.uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      const userSavedPins = userSnap.data().saves;
      const filteredPins = userSavedPins.filter(
        (savedPin) => savedPin !== pin.id
      );
      await setDoc(userDoc, {
        ...userSnap.data(),
        saves: filteredPins,
      });
    }
  };

  return (
    <div className="w-max m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${pin.id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-out"
      >
        <img
          src="https://images.pexels.com/photos/16952091/pexels-photo-16952091/free-photo-of-wood-landscape-field-summer.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          className="rounded-lg w-80"
          alt="user-post"
        />
        {postHovered && (
          <div
            className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{
              height: "100%",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${pin?.photoURL}`}
                  target="_blank"
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {saved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={handleSavePin}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {pin?.destination && (
                <a
                  href={`${pin?.destination}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {pin?.destination.length > 20
                    ? pin?.destination.slice(8, 20)
                    : pin?.destination.slice(8)}
                </a>
              )}
              {pin?.postedBy === user?.uid && (
                <button
                  type="button"
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  onClick={handleDeletePin}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedByUserData?.uid}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedByUserData?.photoURL}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">
          {postedByUserData?.displayName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;