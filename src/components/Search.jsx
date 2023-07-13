import React, { useState, useEffect } from "react";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const Search = ({ searchQuery }) => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    setLoading(true);
    const pinsCol = collection(db, "pins");

    const unsubscibe = onSnapshot(
      searchQuery
        ? query(pinsCol, where("title", "==", searchQuery))
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
  }, [searchQuery]);

  return (
    <div>
      {loading && <Spinner message="Please wait..." />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchQuery !== "" && !loading && (
        <div className="mt-10 text-center text-xl">
          No results found for{" "}
          <span className="font-semibold">{searchQuery}</span>
        </div>
      )}
    </div>
  );
};

export default Search;
