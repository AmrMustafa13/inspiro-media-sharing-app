import React, { useState, useEffect, useContext, useRef } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import MasonryLayout from "../components/MasonryLayout";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Spinner from "../components/Spinner";
import { AuthContext } from "../contexts/authContext";
import { motion } from "framer-motion";

const PinDetail = () => {
  const { pinId } = useParams();

  const commentsRef = useRef(null);

  const [pin, setPin] = useState(null);
  const [moreLikeThis, setMoreLikeThis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState([]);
  const [postedByUserData, setPostedByUserData] = useState([]);
  const [pinNotExists, setPinNotExists] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const q = query(doc(db, "pins", pinId));
    const unsubscribe = onSnapshot(q, (doc) => {
      if (doc.exists()) {
        setPin(doc.data());
        setLoading(false);
      } else {
        setPinNotExists(true);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [pinId]);

  // get more like this pins
  useEffect(() => {
    const getMoreLikeThis = async () => {
      const pinsRef = collection(db, "pins");
      const pinsSnapshot = await getDocs(pinsRef);
      const pins = pinsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const moreLikeThis = pins.filter(
        (pin) => pin.category === pin.category && pin.id !== pinId
      );
      setMoreLikeThis(moreLikeThis);
    };
    getMoreLikeThis();
  }, [pin]);

  useEffect(() => {
    // get postedBy user data from comment userId property
    const getPostedByUserData = async () => {
      pin?.comments?.forEach(async (comment) => {
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

  // scroll to bottom of comments when new comment is added
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [pin?.comments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setAddingComment(true);
    const newComment = {
      userId: user?.uid,
      text: comment,
    };
    const pinDoc = doc(db, "pins", pinId);
    await updateDoc(
      pinDoc,
      pin.comments
        ? { comments: [...pin.comments, newComment] }
        : { comments: [newComment] }
    );
    setComment("");
    setAddingComment(false);
  };

  if (loading) return <Spinner message="Loading Pin..." />;

  if (pinNotExists) {
    return (
      <h1 className="text-3xl text-center font-bold text-gray-500 mt-10">
        Pin Not Found
      </h1>
    );
  }

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{
          maxWidth: "1500px",
          borderRadius: "32px",
        }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <motion.img
            src={pin?.photoURL}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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
            <h1 className="text-4xl font-bold break-words mt-3">
              {pin?.title}
            </h1>
            <p className="mt-3">{pin?.about}</p>
          </div>
          <div className="flex gap-2 mt-5 items-center rounded-lg">
            <Link to={`/user-profile/${user?.uid}`}>
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={user?.photoURL}
                alt="user-profile"
              />
            </Link>
            <p className="font-semibold capitalize">{user?.displayName}</p>
          </div>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-48 overflow-y-auto">
            {pin?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <Link to={`/user-profile/${postedByUserData[i]?.uid}`}>
                  <img
                    src={postedByUserData[i]?.photoURL}
                    alt="user-profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold">{comment?.text}</p>
                </div>
              </div>
            ))}
            <span ref={commentsRef}></span>
          </div>
          <form className="flex flex-wrap items-center mt-6 gap-3">
            <Link to={`/user-profile/${user?.uid}`}>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={user?.photoURL}
                alt="user-profile"
              />
            </Link>
            <input
              type="text"
              className="flex-1 border-gray-100 outline-none border-2 rounded-2xl p-2 focus:border-gray-300"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-red-500 text-white rounded-full px-6 py-2  font-semibold text-base outline-none"
              onClick={handleAddComment}
            >
              {addingComment ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
      {moreLikeThis.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl my-8 mb-4">
            More Like This
          </h2>
          <MasonryLayout pins={moreLikeThis} />
        </>
      ) : (
        <Spinner message="Loading More Like This Pins..." />
      )}
    </>
  );
};

export default PinDetail;
