import React from "react";
import Pin from "./Pin";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryLayout = ({ pins }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
    >
      <Masonry gutter="20px">
        {pins?.map((pin) => (
          <Pin key={pin.id} pin={pin} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryLayout;
