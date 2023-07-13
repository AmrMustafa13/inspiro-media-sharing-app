import React from "react";

const DeleteModal = ({ handleDeletePin, setDeleteModalOpen }) => {
  return (
    <div
      className="
        fixed
        top-0
        left-0
        w-full
        h-full
        flex
        justify-center
        items-center
        bg-black
        bg-opacity-50
        z-50
    "
    >
      <div
        className="bg-white w-2/3 h-64 rounded-lg
        flex
        flex-col
        justify-center
        items-center
        gap-4
        p-4
        z-50
        shadow-2xl
      "
      >
        <p
          className="
            text-2xl
            font-semibold
            text-center
            text-black
            z-50
        "
        >
          Are you sure you want to delete this pin?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-red-500  hover:opacity-75 text-white font-bold px-5 py-2 text-base rounded-3xl hover:shadow-md outline-none"
            onClick={handleDeletePin}
          >
            Delete
          </button>
          <button
            type="button"
            className="bg-white  hover:opacity-75 text-black font-bold px-5 py-2 text-base rounded-3xl hover:shadow-md outline-none"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
