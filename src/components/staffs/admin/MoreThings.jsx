import React, { useEffect, useRef, useState } from "react";
import "./moreThings.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import { SET_OTHERS_TAB, DELETE_OTHERS_TAB } from "../../../redux/HomeSlice";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";

const MoreThings = () => {
  const [myTab, setMyTab] = useState({
    tName: "",
    title: "",
    details: "",
  });

  const school = useSelector((state) => state.Home.school.payload);
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleAddImageClick() {
    imagesInputRef.current.click();
  }

  function handleImageDeleteClick(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
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

  const imagesInputRef = useRef(null);

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

  async function handleSubmit() {
    const schoolCode = school.schoolCode;

    if (!myTab.tName) {
      alert("Tab Name is Required");
      return;
    }

    if (myTab.tName.length < 3) {
      alert("Tab name should be greater than 2 characters");
      return;
    }

    if (!myTab.title) {
      alert("Title is required");
      return;
    }

    if (myTab.title.length < 3) {
      alert("Tab title should be greater than 2 characters");
      return;
    }

    if (!myTab.details) {
      alert("Details is required");
      return;
    }

    if (myTab.details.length < 5) {
      alert("Details must be greater than 4 characters");
      return;
    }

    let newData = { ...myTab };

    if (myTab._id) {
      newData.images = [];
    }

    let myTabObject = new FormData();

    // Add images to FormData indivdataually
    for (let i = 0; i < images.length; i++) {
      let newImageFile = await blobToFile(images[i]);
      myTabObject.append("images", newImageFile);
    }

    myTabObject.append("others", JSON.stringify(newData));

    setLoading(true);

    // Implement the function here....
    if (myTab._id) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/others/${myTab._id}`,
          myTab,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            dispatch(SET_ALERT_GLOBAL(response.data));
            dispatch(SET_OTHERS_TAB(response.data.data));
          } else {
            dispatch(SET_ALERT_GLOBAL(response.data));
          }
        })
        .catch((error) => {
          setLoading(false);
          const data = {
            message: error.message,
            status: "Cannot communicate with the server",
          };

          if (error.response) {
            dispatch(SET_ALERT_GLOBAL(error.response.data));
            return;
          }
          dispatch(SET_ALERT_GLOBAL(data));
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/others/new`,
          myTabObject,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            dispatch(SET_ALERT_GLOBAL(response.data));
            setMyTab({
              tName: "",
              title: "",
              details: "",
            });
            setImages([]);
            dispatch(SET_OTHERS_TAB(response.data.data));
          } else {
            dispatch(SET_ALERT_GLOBAL(response.data));
          }
        })
        .catch((error) => {
          setLoading(false);
          const data = {
            message: error.message,
            status: "Cannot communicate with the server",
          };

          if (error.response) {
            dispatch(SET_ALERT_GLOBAL(error.response.data));
            return;
          }
          dispatch(SET_ALERT_GLOBAL(data));
        });
    }
  }

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );

  useEffect(() => {
    if (confirmGlobalStatusState === "accepted") {
      deleteOthersTab();
      dispatch(REMOVE_CONFIRM_GLOBAL());
    } else if (confirmGlobalStatusState === "declined") {
      dispatch(REMOVE_CONFIRM_GLOBAL());
    }
  }, [confirmGlobalStatusState, dispatch]);

  async function deleteOthersTab() {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/others/${myTab._id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(DELETE_OTHERS_TAB(myTab._id));
          dispatch(SET_ALERT_GLOBAL(response.data));
          setMyTab({
            tName: "",
            title: "",
            details: "",
          });
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  return (
    <div className="moreThings2738">
      <div className="text21 pb-3">
        <p className="h4 w600"> More Things </p>
      </div>

      <div className="veryMe2 flex4 mt-2">
        <div className="meLeft1211 all3234">
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

          {!loading && (
            <>
              {myTab._id && (
                <button
                  className="deleteTab bg-white text-danger"
                  style={{ padding: "5px 20px" }}
                  onClick={() =>
                    dispatch(
                      SET_CONFIRM_GLOBAL({
                        message: "Are you sure to delete this tab",
                      })
                    )
                  }
                >
                  <p className="h8 w500">
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ marginRight: "6px" }}
                    />
                    Delete tab
                  </p>
                </button>
              )}

              <div className="our-form3636">
                <p className="h5 w600 text-center">
                  {myTab._id ? `Edit ${myTab.tName} Tab` : "Create New Tab"}
                </p>

                <div className="form-content6">
                  <div className="each width2">
                    <p> Tab Name </p>
                    <input
                      type="text"
                      name=""
                      value={myTab.tName}
                      placeholder=""
                      onChange={(event) =>
                        setMyTab({
                          ...myTab,
                          tName: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="each width2">
                    <p> Title </p>
                    <input
                      type="text"
                      name=""
                      value={myTab.title}
                      placeholder=""
                      onChange={(event) =>
                        setMyTab({
                          ...myTab,
                          title: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="each width4">
                    <p> Details </p>
                    <textarea
                      value={myTab.details}
                      onChange={(event) =>
                        setMyTab({
                          ...myTab,
                          details: event.target.value,
                        })
                      }
                      cols="30"
                      placeholder="Something you want to share..."
                      rows="8" // Start with 1 row for auto-expansion
                      style={{
                        width: "100%",
                        minHeight: "50px", // Adjust the initial height as needed
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
                </div>
              </div>

              {images.length < 1 && !myTab._id && (
                <p
                  className="h6 text-secondary w500 my-2"
                  style={{ paddingLeft: "20px" }}
                >
                  {" "}
                  No Images{" "}
                </p>
              )}

              {myTab._id && (
                <div className="images32322c" style={{ paddingLeft: "20px" }}>
                  {myTab.images.map((image, index) => (
                    <div className="img" key={index}>
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

              {!myTab._id && (
                <div className="images32322c" style={{ paddingLeft: "20px" }}>
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

              {!myTab._id && (
                <div
                  className="addImage"
                  style={{ paddingLeft: "20px" }}
                  onClick={handleAddImageClick}
                >
                  <button className="btn">
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      ref={imagesInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <FontAwesomeIcon icon={faPen} /> &nbsp; Add Images
                  </button>
                </div>
              )}

              <hr className="text-secondary" />

              <div
                className="buttons flex1 py-3"
                style={{ justifyContent: "flex-end" }}
              >
                <button
                  className="btn btn-secondary me-3"
                  style={{ width: "min(48%, 220px)" }}
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "10px", width: "min(48%, 220px)" }}
                  onClick={() => handleSubmit()}
                >
                  {`${myTab._id ? "Update" : "Submit"}`}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="meRight1211 all3234 pb-3 pt-3">
          <p className="h5 w600 text-center pb-3"> ALL TABS </p>

          {school.others.map((ind, index) => {
            return (
              <div key={index} className="indTab" onClick={() => setMyTab(ind)}>
                <p className="h6 w500 text-secondary text-center">
                  {ind.title}
                </p>
              </div>
            );
          })}

          <div className="">
            <hr className="mx-2 text-secondary" />
          </div>

          <div
            className="indTab addNew2133"
            onClick={() => {
              setMyTab({
                tName: "",
                title: "",
                details: "",
              });
            }}
          >
            <p className="h6 w500 text-center"> Add New Tab </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreThings;
