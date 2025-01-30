import React, { useEffect } from "react";
import { useRef } from "react";
import "./uploadImages.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ERROR_REMOVE,
  POST_GALLERY,
  POST_GALLERY_SUCCESS,
  POST_GALLERY_FAIL,
} from "../../redux/GallerySlice";
import Error from "../layout/error";
import axios from "axios";
import Alert2 from "../layout/Alert2";
import Success from "../layout/Success";

const UploadImages = ({ closeFunction }) => {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();

  const school = useSelector((state) => state.Home.school.payload);
  const error = useSelector((state) => state.Gallery.error.payload);
  const loading = useSelector((state) => state.Gallery.loading);
  const schoolCode = school.schoolCode;

  function dsudwsu() {
    if (loading || error) {
      mainDiv.current.classList.add("d-none");
    } else if (!loading && !error) {
      mainDiv.current.classList.remove("d-none");
    }
  }

  useEffect(() => {
    dsudwsu();
  }, [loading, error]);

  function handleUpdateClose() {}

  function handleTagClick(data) {
    if (tags.includes(data)) {
      return;
    }

    const updatedTags = [...tags, data];
    setTags(updatedTags);
  }

  function handleRemoveTag(index) {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    console.log(updatedTags);
  }
  const array1 = [
    "team",
    "infrastructure",
    "events",
    "students",
    "services",
    "general",
    "others",
  ];

  //for general

  function removeError() {
    dispatch(ERROR_REMOVE());
  }

  // for images
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const mainDiv = useRef(null);

  function handleImageDeleteClick(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  }

  function handleAddImageClick() {
    inputRef.current.click();
  }

  const handleImageUpload = (event) => {
    const selectedImages = event.target.files;
    const updatedImages = [...images];

    for (let i = 0; i < selectedImages.length; i++) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedImages[i]);

      reader.onload = () => {
        const arrayBuffer = reader.result;
        const fileType = selectedImages[i].type.split("/")[1]; // Extract file extension
        const blob = new Blob([arrayBuffer], { type: `image/${fileType}` });
        updatedImages.push(blob);
        if (updatedImages.length === images.length + selectedImages.length) {
          setImages(updatedImages);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading the file:", error);
        alert("File Reading Failed !!");
      };
    }
  };

  const blobToFile = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set maximum dimensions
          const maxWidth = 2880;
          const maxHeight = 1620;

          // Calculate new dimensions while preserving aspect ratio
          let newWidth = img.width;
          let newHeight = img.height;

          if (newWidth > maxWidth) {
            newHeight *= maxWidth / newWidth;
            newWidth = maxWidth;
          }

          if (newHeight > maxHeight) {
            newWidth *= maxHeight / newHeight;
            newHeight = maxHeight;
          }

          // Set canvas dimensions
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Get compressed image as data URL with desired quality
          const compressedDataURL = canvas.toDataURL("image/jpeg", 0.6); // Adjust quality as needed

          // Convert data URL to Blob
          const byteString = atob(compressedDataURL.split(",")[1]);
          const mimeString = compressedDataURL
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          const compressedBlob = new Blob([ab], { type: mimeString });

          // Log original and compressed file size
          // console.log('Original file size:', blob.size, 'bytes');
          // console.log('Compressed file size:', compressedBlob.size, 'bytes');

          // Generate a unique filename using a timestamp
          const timestamp = new Date().getTime();
          const fileName = `image_${timestamp}.jpg`;

          // Create a new File object
          const file = new File([compressedBlob], fileName, {
            type: mimeString,
          });

          resolve(file);
        };

        img.src = reader.result;
      };

      reader.onerror = (error) => {
        reject(new Error("Error reading the Blob:", error));
      };

      reader.readAsDataURL(blob);
    });
  };

  async function handleCreate() {
    const formDataObject = new FormData();
    const myTags = tags;

    if (myTags.length < 1) {
      myTags.unshift("others");
    }

    // Add images to FormData individually
    for (let i = 0; i < images.length; i++) {
      let newImageFile = await blobToFile(images[i]);
      formDataObject.append("photo", newImageFile);
    }

    formDataObject.append("categories", myTags);

    // Implement the function here....

    dispatch(POST_GALLERY());
    setSuccessData(null);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/staff/${schoolCode}/gallery/upload`,
        formDataObject,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(POST_GALLERY_SUCCESS(response.data.data));

          setSuccessData(response.data);
          setIsSuccess(true);
        } else {
          dispatch(POST_GALLERY_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(POST_GALLERY_FAIL(error.response.data));
          return;
        }
        dispatch(POST_GALLERY_FAIL(data));
      });
  }

  //handling uploadSuccess

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  function closeSuccess() {
    setIsSuccess(false);
    closeFunction();
  }

  //OTHERS

  const [alert2, setAlert2] = useState(false);
  function closeAlert2() {
    setAlert2(false);
  }

  function handleUpdateClose() {
    if (images.length < 1) {
      dispatch(ERROR_REMOVE());
      closeFunction();
      return;
    }

    setAlert2(true);
  }

  return (
    <>
      {alert2 && (
        <Alert2
          alert2True={closeFunction}
          alert2False={closeAlert2}
          text1={`Discard Uplaoding Images`}
          text2={`If you close, all changes you made will be lost. Are you sure to close?`}
        />
      )}

      {isSuccess && <Success closeSuccess={closeSuccess} data={successData} />}

      <div className="uploadImages8329">
        {loading && (
          <div
            className="spinner-container flex1"
            style={{ width: "100%", height: "80vh" }}
          >
            <div
              className="spinner-border text-primary my-4 loading452"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <Error
            status={error.status}
            message={error.message}
            errorRemove={removeError}
          />
        )}

        <div className="main" ref={mainDiv}>
          <div className="close flex1" onClick={handleUpdateClose}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
          <div className="py-2">
            <p className="h5 text-center py-5">Upload Images</p>
          </div>

          <div className="title">
            <p className="h6 text-secondary"> Tags : </p>
            <div className="contentsds" style={{ background: "red" }}>
              {!tags.length > 0 && (
                <p className="h6 w500 text-secondary"> No Tags Selected </p>
              )}

              {tags.map((data, index) => {
                return (
                  <div className="each" key={index}>
                    <p className="w300"> {data} </p>
                    <div
                      className="closes32 flex1"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="addTags">
            <p className="h6 text-secondary"> Select Tags : </p>
            <div className="contentsds">
              {array1.map((data, index) => {
                return (
                  <div
                    className={`each bg1`}
                    key={index}
                    onClick={() => handleTagClick(data)}
                  >
                    <p className="w300"> {data} </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="images custom-scrollbar">
            {images.map((image, index) => (
              <div className="img" key={index}>
                <div
                  className="delete flex1"
                  onClick={() => handleImageDeleteClick(index)}
                >
                  X
                </div>
                <img src={URL.createObjectURL(image)} alt="hehe" />
              </div>
            ))}
          </div>

          <div className="addImage ms-2" onClick={handleAddImageClick}>
            <button className="btn">
              <input
                type="file"
                id="fileInput"
                multiple
                style={{ display: "none" }}
                ref={inputRef}
                accept="image/*"
                onChange={handleImageUpload}
              />
              <FontAwesomeIcon icon={faPen} /> &nbsp; Add Images
            </button>
          </div>

          <div className="buttons flex1">
            <button
              className="btn btn-secondary mx-1"
              onClick={handleUpdateClose}
            >
              {" "}
              Cancel{" "}
            </button>
            <button
              className="btn btn-primary mx-1"
              disabled={images.length < 1}
              onClick={handleCreate}
            >
              Upload To Gallery
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadImages;
