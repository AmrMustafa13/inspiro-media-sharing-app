import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);

  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const getPins = async () => {
        const pinsCol = collection(db, "pins");
        const pinsSnapshot = await getDocs(pinsCol);
        const pinsList = pinsSnapshot.docs
          .filter((doc) => doc.data().category === categoryId)
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        setPins(pinsList);
      };
      getPins();
    } else {
      const getPins = async () => {
        const pinsCol = collection(db, "pins");
        const pinsSnapshot = await getDocs(pinsCol);
        const pinsList = pinsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPins(pinsList);
      };
      getPins();
    }
    setLoading(false);
  }, [categoryId]);

  if (loading)
    return (
      <Spinner message="We are fetching the pins for you. Please wait..." />
    );

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
