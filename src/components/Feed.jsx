import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);

  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    const pinsCol = collection(db, "pins");

    const unsubscibe = onSnapshot(
      categoryId
        ? query(pinsCol, where("category", "==", categoryId))
        : query(pinsCol),
      (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setPins(docs);
        setLoading(false);
      }
    );

    return () => unsubscibe();
  }, [categoryId]);

  if (loading) return <Spinner message="Please wait..." />;

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
