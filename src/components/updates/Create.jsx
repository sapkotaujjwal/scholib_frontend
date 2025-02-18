import React, { useState, useRef, useEffect } from "react";
import "./create.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import Alert2 from "../layout/Alert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Error from "../layout/error";
import Success from "../layout/Success";

import {
  ERROR_REMOVE,
  POST_UPDATE,
  POST_UPDATE_SUCCESS,
  POST_UPDATE_FAIL,
} from "../../redux/UpdateSlice";

const Create = ({
  data = { images: [], title: "", showTo: "Everyone", emailEverybody: false },
  closeFunction,
  id,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    textAreaRef.current.focus();
    dsudwsu();
  }, [dsudwsu]);

  const [images, setImages] = useState(data.images);
  const [formData, setFormData] = useState({
    title: data.title,
    show: data.showTo,
    emailEverybody: data.emailEverybody,
  });
  const inputRef = useRef(null);
  const textAreaRef = useRef(null);
  const mainDiv = useRef(null);

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

  const school = useSelector((state) => state.Home.school.payload);
  const error = useSelector((state) => state.Update.error.payload);
  const loading = useSelector((state) => state.Update.loading);

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

  // function for submitting the updates
  async function handleCreate() {
    const schoolCode = school.schoolCode;

    if (!formData.title) {
      alert("Title is Required");
      return;
    }

    if (formData.title.length < 3) {
      alert("Title should be greater than 3 characters");
      return;
    }

    let newData = { ...formData, images };

    if (id) {
      newData.images = [];
    }

    let formDataObject = new FormData();

    // Add images to FormData individually
    for (let i = 0; i < newData.images.length; i++) {
      let newImageFile = await blobToFile(newData.images[i]);
      formDataObject.append("images", newImageFile);
    }

    formDataObject.append("title", newData.title);
    formDataObject.append("showTo", newData.show);

    // Implement the function here....
    if (id) {
      dispatch(POST_UPDATE());
      setSuccessData(null);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/staff/${schoolCode}/update/${id}`,
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
            dispatch(POST_UPDATE_SUCCESS(response.data.data));

            setSuccessData(response.data);
            setIsSuccess(true);
          } else {
            dispatch(POST_UPDATE_FAIL(response.data.data));
          }
        });
    } else {
      dispatch(POST_UPDATE());
      setSuccessData(null);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/staff/${schoolCode}/updates/new`,
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
            dispatch(POST_UPDATE_SUCCESS(response.data.data));

            setSuccessData(response.data);
            setIsSuccess(true);
          } else {
            dispatch(POST_UPDATE_FAIL(response.data.data));
          }
        })
        .catch((error) => {
          const data = {
            message: error.message,
            status: "Cannot communicate with the server",
          };

          if (error.response) {
            dispatch(POST_UPDATE_FAIL(error.response.data));
            return;
          }
          dispatch(POST_UPDATE_FAIL(data));
        });
    }
  }

  function handleAddImageClick() {
    inputRef.current.click();
  }

  function handleUpdateClose() {
    if (formData.title.length < 3) {
      dispatch(ERROR_REMOVE());
      closeFunction();
      return;
    }

    setAlert2(true);
  }

  function handleImageDeleteClick(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  }

  function handleTitleChange(event) {
    const newTitle = event.target.value;
    setFormData({ ...formData, title: newTitle });
  }

  function handleShowChange(event) {
    const newShowValue = event.target.value;
    setFormData({ ...formData, show: newShowValue });
  }

  //Alert2

  const [alert2, setAlert2] = useState(false);

  function closeAlert2() {
    setAlert2(false);
  }

  function dsudwsu() {
    if (loading || error) {
      mainDiv.current.classList.add("d-none");
    } else if (!loading && !error) {
      mainDiv.current.classList.remove("d-none");
    }
  }

  function removeError() {
    dispatch(ERROR_REMOVE());
  }

  useEffect(() => {
    dsudwsu();
  }, [loading, error]);

  //handling updateSuccess

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  function closeSuccess() {
    setIsSuccess(false);
    closeFunction();
  }

  return (
    <>
      {alert2 && (
        <Alert2
          alert2True={closeFunction}
          alert2False={closeAlert2}
          text1={`Discard ${!id ? "Creating" : "Updating"}  Update`}
          text2={`If you cancel, all changes you made will be lost. Are you sure to cancel?`}
        />
      )}

      {isSuccess && <Success closeSuccess={closeSuccess} data={successData} />}

      <div className="dboqeewqwwqqp3 flex1">
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

        <div className="main-edit-2363" ref={mainDiv}>
          <div className="update">
            <div className="close flex1" onClick={handleUpdateClose}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
            <div className="py-2">
              <p className="h5 text-center py-5">
                {id ? "Update Your Post" : "Create a post"}
              </p>
            </div>
          </div>
          <div className="title">
            <p className="h6 text-secondary"> Title : </p>
            <textarea
              name="title"
              id=""
              placeholder=""
              value={formData.title}
              onChange={handleTitleChange}
              ref={textAreaRef}
              rows="4" // Start with 1 row for auto-expansion
              style={{
                width: "100%",
                minHeight: "50px", // Initial height
                overflow: "hidden",
                resize: "none", // Disable manual resizing
                padding: "8px",
              }}
              onInput={(event) => {
                event.target.style.height = "auto"; // Reset height to auto
                event.target.style.height = `${event.target.scrollHeight}px`; // Adjust height to fit content
              }}
            ></textarea>
          </div>

          {!id && (
            <div className="images custom-scrollbar">
              {images.map((image, index) => (
                <div className="img" key={index}>
                  <div
                    className="delete flex1"
                    onClick={() => handleImageDeleteClick(index)}
                  >
                    X
                  </div>
                  {!image.secure_url && (
                    <img src={URL.createObjectURL(image)} alt="hehe" />
                  )}
                  {image.secure_url && (
                    <img src={image.secure_url} alt="hehe" />
                  )}
                </div>
              ))}
            </div>
          )}

          {!id && (
            <div className="addImage" onClick={handleAddImageClick}>
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
          )}

          <div className="more">
            <div className="who flex1">
              <p>
                <FontAwesomeIcon icon={faLock} />
              </p>
              <p className="text-secondary h5 mx-3"> Show </p>
              <select value={formData.show} onChange={handleShowChange}>
                <option value="Everyone">Everyone</option>
                <option value="Staffs">Staffs</option>
                <option value="Members">Members</option>
              </select>
            </div>


          </div>
          <div className="buttons flex1">
            <button
              className="btn btn-secondary mx-1 w-[50%]"
              onClick={handleUpdateClose}
            >
              {" "}
              Cancel{" "}
            </button>
            <button className="btn btn-primary mx-1 w-[50%]" onClick={handleCreate}>
              {id ? "Update Post" : "Create Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
