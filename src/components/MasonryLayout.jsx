import React from "react";
import Pin from "./Pin";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryLayout = ({ pins }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
    >
      <Masonry gutter="20px">
        {pins?.length === 0 && (
          <p
            className="
        text-2xl
        text-center
        text-gray-500
        font-semibold
        mt-10
        mb-20
        "
          >
            No pins found.
          </p>
        )}
        {pins?.map((pin) => (
          <Pin key={pin.id} pin={pin} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryLayout;
