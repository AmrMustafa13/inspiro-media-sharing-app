import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";

import Spinner from "../components/Spinner";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const categories = [
  {
    name: "cars",
    image:
      "https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg",
  },
  {
    name: "fitness",
    image:
      "https://i.pinimg.com/236x/25/14/29/251429345940a47490cc3d47dfe0a8eb.jpg",
  },
  {
    name: "wallpaper",
    image:
      "https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg",
  },
  {
    name: "websites",
    image:
      "https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg",
  },
  {
    name: "photo",
    image:
      "https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg",
  },
  {
    name: "food",
    image:
      "https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg",
  },
  {
    name: "nature",
    image:
      "https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg",
  },
  {
    name: "art",
    image:
      "https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg",
  },
  {
    name: "travel",
    image:
      "https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg",
  },
  {
    name: "quotes",
    image:
      "https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg",
  },
  {
    name: "cats",
    image:
      "https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg",
  },
  {
    name: "dogs",
    image:
      "https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg",
  },
  {
    name: "others",
    image:
      "https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg",
  },
];

const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImageError, setUploadingImageError] = useState(null);

  const types = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg",
    "image/gif",
    "image/tiff",
  ];

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const handleImage = (e) => {
    if (e.target.files[0] && types.includes(e.target.files[0].type)) {
      setImage(e.target.files[0]);
      setWrongImageType(null);
    } else {
      setImage(null);
      setWrongImageType(
        "Please select an image file (png, jpeg, jpg, svg, gif, tiff)"
      );
    }
    uploadImageToStorage(e.target.files[0]);
  };

  const uploadImageToStorage = async (image) => {
    if (!image) return;
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
    } catch (error) {
      setUploadingImageError(
        "Error uploading image, Refresh the page and try again."
      );
    }
    setUploadingImage(false);
  };

  const handleUploadPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "pins"), {
        title,
        about,
        destination,
        category,
        photoURL,
        postedBy: user.uid,
        likes,
        comments,
      });
      navigate(`/pin-detail/${docRef.id}`);
    } catch (error) {
      setError("Error uploading pin, Refresh the page and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="p-3 flex w-full ">
          <div className="flex justify-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-[420px]">
            {wrongImageType && <p>Wrong Image Type.</p>}
            {!image ? (
              <label htmlFor="upload-image">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl font-bold">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload image</p>
                  </div>
                  <p className="mt-32 text-gray-400 text-center">
                    use high-quality JPG, PNG, SVG or GIF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImage}
                  accept="image/*"
                  id="upload-image"
                />
              </label>
            ) : uploadingImage ? (
              <Spinner />
            ) : uploadingImageError ? (
              <p className="text-red-500 mb-5 text-xl text-center transition-all duration-150 ease-in ">
                {uploadingImageError}
              </p>
            ) : (
              <div className="relative h-full">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : "https://via.placeholder.com/150"
                  }
                  alt="upload-image"
                  className=" h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImage(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <form className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.photoURL}
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold">{user.displayName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about?"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add your destination here"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose pin category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className="bg-white text-base border-0 outline-none capitalize text-black"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              {loading ? (
                <Spinner />
              ) : error ? (
                <p className="text-red-500 mb-5 text-xl text-center transition-all duration-150 ease-in ">
                  {error}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleUploadPin}
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                  disabled={uploadingImage}
                >
                  Upload Pin
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
