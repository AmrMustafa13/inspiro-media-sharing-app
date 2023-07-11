import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import MasonryLayout from "./MasonryLayout";
import Avatar from "../assets/avatar.png";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const randomImage = "https://source.unsplash.com/1600x900/?nature";

const UserProfile = () => {
  const { userId } = useParams();

  const [userData, setUserData] = useState(null);
  const [btnText, setBtnText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("Created");
  const [createdPins, setCreatedPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);

  const navigate = useNavigate();

  // useEffect(() => {
  // const getUserData = async () => {
  //   const userDoc = doc(db, "users", userId);
  //   const userDocSnap = await getDoc(userDoc);
  //   if (userDocSnap.exists()) {
  //     setUserData(userDocSnap.data());
  //   } else {
  //     console.log("No such document!");
  //   }
  // };
  // getUserData();
  // const q = query(doc(db, "users", userId));
  // const unsubscribe = onSnapshot(q, (doc) => {
  //   setUserData(doc.data());
  // }
  // return unsubscribe;
  // }, [userId]);

  useEffect(() => {
    const q = query(doc(db, "users", userId));
    const unsubscribe = onSnapshot(q, (doc) => {
      setUserData(doc.data());
    });
    return () => {
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (btnText === "Created") {
      // filter the pins posted by the current user
      const fetchCreatedPins = async () => {
        const pinsCol = collection(db, "pins");
        const pinsSnapshot = await getDocs(pinsCol);
        const pinsList = pinsSnapshot.docs
          .filter((doc) => doc.data().postedBy === userId)
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        setCreatedPins(pinsList);
      };
      fetchCreatedPins();
    }
    if (btnText === "Saved") {
      // fetch all the pins saved by the user
      const fetchSavedPins = async () => {
        const savedPinsIds = userData?.saves;
        const pinsCol = collection(db, "pins");
        const pinsSnapshot = await getDocs(pinsCol);
        const pinsList = pinsSnapshot.docs
          .filter((doc) => savedPinsIds.includes(doc.id))
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        setSavedPins(pinsList);
      };
      fetchSavedPins();
    }
  }, [btnText, userId, userData?.saves]);

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="banner-img"
              className="w-full h-[370px] 2xl:h-[510px] shadow-lg object-cover"
            />
            <img
              src={userData?.photoURL || Avatar}
              alt="user-pic"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl shadow-gray-300  object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {userData?.displayName}
            </h1>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setBtnText(e.target.textContent);
                setActiveBtn("Created");
              }}
              className={`${
                activeBtn === "Created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setBtnText(e.target.textContent);
                setActiveBtn("Saved");
              }}
              className={`${
                activeBtn === "Saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          <div className="px-2">
            <MasonryLayout
              pins={btnText === "Created" ? createdPins : savedPins}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
