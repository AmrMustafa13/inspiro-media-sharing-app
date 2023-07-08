import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry breakpointCols={breakpointColumnsObj} className="flex">
      {pins?.map((pin) => (
        <Pin key={pin.id} pin={pin} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
