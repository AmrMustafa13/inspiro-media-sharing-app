import React, { useState, useEffect, useContext } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import MasonryLayout from "../components/MasonryLayout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Spinner from "../components/Spinner";
import { AuthContext } from "../contexts/authContext";
import Avatar from "../assets/avatar.png";

const PinDetail = () => {
  const { pinId } = useParams();

  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState([]);
  const [postedByUserData, setPostedByUserData] = useState([]);
  const [pinNotExists, setPinNotExists] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getPin = async () => {
      setLoading(true);
      const pinDoc = doc(db, "pins", pinId);
      const pinDocSnap = await getDoc(pinDoc);
      if (!pinDocSnap.exists()) {
        setPinNotExists(true);
        setLoading(false);
        return;
      }
      setLoading(false);
      setPin({ ...pinDocSnap.data(), id: pinDocSnap.id });
    };
    getPin();
  }, [pinId]);

  useEffect(() => {
    // get postedBy user data from comment userId property
    const getPostedByUserData = async () => {
      pin?.comments.forEach(async (comment) => {
        const userDoc = doc(db, "users", comment.userId);
        const userDocSnap = await getDoc(userDoc);
        setPostedByUserData((prevState) => [
          ...prevState,
          { ...userDocSnap.data(), id: userDocSnap.id },
        ]);
      });
    };
    getPostedByUserData();
  }, [pin]);

  if (loading) return <Spinner message="Loading Pin..." />;

  if (pinNotExists) {
    return (
      <h1 className="text-3xl text-center font-bold text-gray-500 mt-10">
        Pin Not Found
      </h1>
    );
  }

  return (
    <div
      className="flex xl:flex-row flex-col m-auto bg-white"
      style={{
        maxWidth: "1500px",
        borderRadius: "32px",
      }}
    >
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img
          src={pin?.photoURL}
          className="rounded-t-3xl rounded-b-lg"
          alt="user-post"
        />
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-[620px]">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a
              href={`${pin?.photoURL}`}
              target="_blank"
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-black text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MdDownloadForOffline />
            </a>
          </div>
          <a href={pin?.destination} target="_blank" rel="noreferrer">
            {pin?.destination}
          </a>
        </div>
        <div>
          <h1 className="text-4xl font-bold break-words mt-3">{pin?.title}</h1>
          <p className="mt-3">{pin?.about}</p>
        </div>
        <Link
          to={`/user-profile/${user?.uid}`}
          className="flex gap-2 mt-5 items-center bg-white rounded-lg"
        >
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={user?.photoURL || Avatar}
            alt="user-profile"
          />
          <p className="font-semibold capitalize">{user?.displayName}</p>
        </Link>
        <h2 className="mt-5 text-2xl">Comments</h2>
        <div className="max-h-32 overflow-y-auto">
          {pin?.comments.map((comment, i) => (
            <div
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
              key={i}
            >
              <img
                src={postedByUserData[i]?.photoURL || Avatar}
                alt="user-profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <div className="flex flex-col">
                <p className="font-bold">{comment?.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
