import React, { useEffect, useRef, useState } from "react";
import "./updateSchool.scss";
import MetaData from "../layout/MetaData";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import logoImg from "../../images/logo.png";

import addImage from "../../images/addImage.svg";
import {
  POST_UPDATE_SCHOOL,
  POST_UPDATE_SCHOOL_SUCCESS,
  POST_UPDATE_SCHOOL_FAIL,
  ERROR_REMOVE,
} from "../../redux/UpdateSchoolSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Success from "../layout/Success";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Error from "../layout/error";
import Loading from "../layout/loading";

const UpdateSchool = ({ data, edit = true }) => {
  const [progress, setProgress] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [progress]);

  //now taking the inputs for school_main
  const [Mydata, setMydata] = useState(data ? data : []);

  const programsAvailableInputRef = useRef(null);
  const logoRef = useRef(null);
  const principlePhotoRef = useRef(null);
  const contactNoRef = useRef(null);
  const emailsRef = useRef(null);
  const policiesRef = useRef(null);
  const schoolImage1Ref = useRef(null);
  const schoolImage2Ref = useRef(null);
  const schoolImage3Ref = useRef(null);
  const schoolImage4Ref = useRef(null);

  //for our legendary programs available
  function handleRemovePrograms(index) {
    let updatedTags = Mydata.programs.filter((_, i) => i !== index);
    setMydata({ ...Mydata, programs: updatedTags });
  }

  //for our legendary contacts available
  function handleRemoveContactNo(index) {
    let updatedTags = Mydata.phone.filter((_, i) => i !== index);
    setMydata({ ...Mydata, phone: updatedTags });
  }

  //for our legendary emails available
  function handleRemoveEmail(index) {
    let updatedTags = Mydata.email.filter((_, i) => i !== index);
    setMydata({ ...Mydata, email: updatedTags });
  }

  //for our legendary policies available
  function handleRemovePolicy(index) {
    let updatedTags = Mydata.policies.filter((_, i) => i !== index);
    setMydata({ ...Mydata, policies: updatedTags });
  }

  // const updateSchool = useSelector((state) => state.UpdateSchool.updateSchool.payload);
  const error = useSelector((state) => state.UpdateSchool.error.payload);
  const loading = useSelector((state) => state.UpdateSchool.loading);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(undefined);

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

  // Main submitt is actually here so make things work from here.. let's go

  async function handleSubmit() {
    if (
      !Mydata.sName ||
      !Mydata.name ||
      !Mydata.address ||
      !Mydata.estd ||
      !Mydata.coordinates
    ) {
      alert("All fields with * are required");
      return;
    }

    const formDataObject = new FormData();

    if (Mydata.logo && !Mydata.logo.secure_url)
      formDataObject.append("logo", await blobToFile(Mydata.logo), "logo.jpg");

    if (Mydata.principle.image && !Mydata.principle.image.secure_url) {
      formDataObject.append(
        "principlePhoto",
        await blobToFile(Mydata.principle.image),
        "principleImage.jpg"
      );
    }

    let leftImages = [];

    if (Mydata.images && Mydata.images.length > 0) {
      await Promise.all(
        Mydata.images.map(async (image, index) => {
          if (image && !image.secure_url) {
            formDataObject.append(
              `images`,
              await blobToFile(image),
              `image_${index}.jpg`
            );
          }

          if (image && image.secure_url) {
            leftImages.push({ image, index });
          }
        })
      );
    }

    // setMydata((prevData) => {
    //   const { images, ...updatedData } = prevData;
    //   return updatedData;
    // });

    let MyData2 = { ...Mydata };

    if (leftImages && leftImages.length > 0) {
      MyData2.leftImages = leftImages;
    }

    delete MyData2.images;
    delete MyData2.logo;

    formDataObject.append("school", JSON.stringify(MyData2));

    dispatch(POST_UPDATE_SCHOOL());
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/admin/${data.schoolCode}/updateSchool`,
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
          dispatch(POST_UPDATE_SCHOOL_SUCCESS(response.data.data));
          setSuccessData({
            status: response.data.status,
            message: response.data.message,
          });

          setIsSuccess(true);
        } else {
          dispatch(POST_UPDATE_SCHOOL_FAIL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(POST_UPDATE_SCHOOL_FAIL(error.response.data));
          return;
        }
        dispatch(POST_UPDATE_SCHOOL_FAIL(data));
      });
  }

  function closeSuccess() {
    dispatch(ERROR_REMOVE());
  }

  return (
    <>
      {loading && <Loading />}
      {isSuccess && (
        <Success
          closeSuccess={() => {
            history.push(`/school/${data.schoolCode}/`);
          }}
          data={successData}
        />
      )}

      {error && (
        <Error
          status={error.status}
          message={error.message}
          errorRemove={closeSuccess}
        />
      )}

      {!isSuccess && !loading && !error && (
        <div className="registerSchool326">
          <MetaData title={" Update your school || Scholib"} />

          <div className="top-parent">
            <div className="top flex3">
              <div className="each rm-on-big">
                <p className="h5 w600 mainP"> Scholib. </p>
              </div>
              <div className="each rm-on-big">
                <p className="h6 text-secondary f3">
                  Update Your School Info...
                </p>
              </div>
              <div className="each buttons-div">
                <div className="buttons">
                  {progress === 1 && (
                    <button onClick={() => history.goBack()}>Close</button>
                  )}
                  {progress > 1 && (
                    <button onClick={() => setProgress(progress - 1)}>
                      Previous
                    </button>
                  )}
                  {progress < 4 && (
                    <button
                      className="ms-2"
                      onClick={() => setProgress(progress + 1)}
                    >
                      Next
                    </button>
                  )}
                  {progress === 4 && (
                    <button className="ms-2" onClick={() => handleSubmit()}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="content flex4" style={{ alignItems: "flex-start" }}>
            <div className="each first rm-on-big">
              <div className="further">
                <div
                  className={`status-each ${progress === 1 ? "active" : ""}`}
                  onClick={() => setProgress(1)}
                >
                  <FontAwesomeIcon icon={faCircle} />
                  <p className="d-inline-block ms-2"> Basic Information </p>
                </div>

                <div
                  className={`status-each ${progress === 2 ? "active" : ""}`}
                  onClick={() => setProgress(2)}
                >
                  <FontAwesomeIcon icon={faCircle} />
                  <p className="d-inline-block ms-2"> Detailed Information </p>
                </div>

                <div
                  className={`status-each ${progress === 3 ? "active" : ""}`}
                  onClick={() => setProgress(3)}
                >
                  <FontAwesomeIcon icon={faCircle} />
                  <p className="d-inline-block ms-2"> Contact Information </p>
                </div>

                <div
                  className={`status-each ${progress === 4 ? "active" : ""}`}
                  onClick={() => setProgress(4)}
                >
                  <FontAwesomeIcon icon={faCircle} />
                  <p className="d-inline-block ms-2"> Few More </p>
                </div>
              </div>
            </div>

            {/* main work is actually here  */}

            <div className="each second">
              <div className="further">
                <div className="forForm">
                  {progress === 1 && (
                    <div className="our-form3636">
                      <p className="h5 w600 text-center"> Basic Information </p>
                      <div className="form-content6">
                        <div className="each width2">
                          <p> School Name * </p>

                          <input
                            type="text"
                            name=""
                            value={Mydata.name}
                            placeholder="Shree Chetana Secondary School"
                            onChange={(event) =>
                              setMydata({ ...Mydata, name: event.target.value })
                            }
                          />
                        </div>

                        <div className="each width1">
                          <p> Short Name *</p>
                          <input
                            type="text"
                            name=""
                            value={Mydata.sName}
                            id=""
                            placeholder="SCSS"
                            onChange={(event) =>
                              setMydata({
                                ...Mydata,
                                sName: event.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="each width1">
                          <p> Students Taught </p>
                          <input
                            type="text"
                            name=""
                            value={Mydata.studentsTaught}
                            id=""
                            placeholder="5000"
                            onInput={(event) =>
                              setMydata({
                                ...Mydata,
                                studentsTaught: event.target.value.replace(
                                  /\D/g,
                                  ""
                                ),
                              })
                            }
                          />
                        </div>

                        <div className="each width4">
                          <p> Address *</p>
                          <input
                            type="text"
                            name=""
                            value={Mydata.address}
                            id=""
                            placeholder="Buddhashanti 2 Budhabare Jhapa"
                            onChange={(event) =>
                              setMydata({
                                ...Mydata,
                                address: event.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="each width2">
                          <p> Facilities Available </p>
                          <div className="checkbox-div">
                            <ul>
                              {[
                                { label: "Bus", value: "Bus" },
                                { label: "Canteen", value: "Canteen" },
                                { label: "Hostel", value: "Hostel" },
                                { label: "Lab", value: "Lab" },
                                { label: "Medical", value: "Medical" },
                                { label: "Playground", value: "Playground" },
                              ].map((facility, index) => (
                                <li key={index}>
                                  <input
                                    type="checkbox"
                                    id={`option${index}`}
                                    checked={Mydata.facilities.includes(
                                      facility.value
                                    )}
                                    onChange={() =>
                                      setMydata({
                                        ...Mydata,
                                        facilities: Mydata.facilities.includes(
                                          facility.value
                                        )
                                          ? Mydata.facilities.filter(
                                              (item) => item !== facility.value
                                            )
                                          : [
                                              ...Mydata.facilities,
                                              facility.value,
                                            ],
                                      })
                                    }
                                  />
                                  <label htmlFor={`option${index}`}>
                                    {facility.label}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="each width4">
                          <p> Description </p>
                          <p
                            className="text-secondary me-2"
                            style={{ fontSize: "10px", float: "right" }}
                          >
                            {" "}
                            {Mydata.text1
                              ? 1800 - Mydata.text1.length
                              : 1800}{" "}
                            characters left{" "}
                          </p>
                          <textarea
                            name=""
                            id=""
                            cols="30"
                            value={Mydata.text1}
                            rows="1" // Set to 1 for auto-expansion
                            onChange={(event) => {
                              if (event.target.value.length > 1800) {
                                return;
                              }

                              setMydata({
                                ...Mydata,
                                text1: event.target.value,
                              });
                            }}
                            style={{
                              width: "100%",
                              minHeight: "50px", // Adjust the initial height
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

                        <div className="each width4">
                          <p> Programs Available </p>

                          <div className="title">
                            <div className="contents">
                              {!Mydata.programs.length > 0 && (
                                <p className="h6 w500 text-secondary py-2">
                                  No Programs Added
                                </p>
                              )}

                              {Mydata.programs.map((data, index) => {
                                return (
                                  <div className="each" key={index}>
                                    <p className="w300"> {data} </p>
                                    <div
                                      className="closes32 flex1"
                                      onClick={() =>
                                        handleRemovePrograms(index)
                                      }
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grouping">
                            <input
                              className="inputAdv"
                              type="text"
                              placeholder="Add a Program"
                              ref={programsAvailableInputRef}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault(); // Prevent default behavior (e.g., form submission)

                                  const tempValue =
                                    programsAvailableInputRef.current.value.trim();

                                  if (tempValue !== "") {
                                    setMydata((prev) => ({
                                      ...prev,
                                      programs: [...prev.programs, tempValue],
                                    }));
                                    programsAvailableInputRef.current.value =
                                      ""; // Clear the input field
                                  }
                                }
                              }}
                            />

                            <div
                              className="enterBtn flex1"
                              onClick={() => {
                                let tempValue =
                                  programsAvailableInputRef.current.value;

                                setMydata({
                                  ...Mydata,
                                  programs: [...Mydata.programs, tempValue],
                                });

                                programsAvailableInputRef.current.value = "";
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="each width4">
                          <hr style={{ color: "grey" }} />
                        </div>

                        <div className="each width1">
                          <div className="selectImage">
                            <p className="h6 w500"> School's Logo </p>
                            {!Mydata.logo && (
                              <img
                                src={addImage}
                                alt=""
                                onClick={() => logoRef.current.click()}
                              />
                            )}

                            {Mydata.logo && !Mydata.logo.secure_url && (
                              <img
                                src={URL.createObjectURL(Mydata.logo)}
                                alt=""
                                onClick={() => logoRef.current.click()}
                              />
                            )}

                            {Mydata.logo && Mydata.logo.secure_url && (
                              <img
                                src={Mydata.logo.secure_url}
                                alt=""
                                onClick={() => logoRef.current.click()}
                              />
                            )}

                            <input
                              ref={logoRef}
                              type="file"
                              name="image"
                              id=""
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];

                                if (selectedFile) {
                                  setMydata({ ...Mydata, logo: selectedFile });
                                }
                              }}
                              className="d-none"
                            />

                            <button
                              className="btn btn-secondary"
                              onClick={() => logoRef.current.click()}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "6px", fontSize: "13px" }}
                                icon={faPen}
                              />
                              {Mydata.logo ? "Change Image" : "Select Image"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {progress === 2 && (
                    <div className="our-form3636">
                      <p className="h5 w600 text-center">
                        {" "}
                        Detailed Information{" "}
                      </p>
                      <div className="form-content6">
                        <div className="each width2">
                          <p> ESTD (BS) *</p>

                          <input
                            type="text"
                            name=""
                            value={Mydata.estd}
                            placeholder="Shree Chetana Secondary School"
                            onChange={(event) =>
                              setMydata({ ...Mydata, estd: event.target.value })
                            }
                          />
                        </div>

                        <div className="each width2">
                          <p> Principal Name </p>

                          <input
                            type="text"
                            name=""
                            value={Mydata.principle.name}
                            placeholder="Shree Chetana Secondary School"
                            onChange={(event) =>
                              setMydata({
                                ...Mydata,
                                principle: {
                                  ...Mydata.principle,
                                  name: event.target.value,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="each width4">
                          <p> Quote </p>

                          <input
                            type="text"
                            name=""
                            value={Mydata.principle.quote}
                            placeholder="Shree Chetana Secondary School"
                            onChange={(event) =>
                              setMydata({
                                ...Mydata,
                                principle: {
                                  ...Mydata.principle,
                                  quote: event.target.value,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="each width4">
                          <p> Mission In Short </p>
                          <p
                            className="text-secondary me-2"
                            style={{ fontSize: "10px", float: "right" }}
                          >
                            {" "}
                            {Mydata.text2
                              ? 600 - Mydata.text2.length
                              : 600}{" "}
                            characters left{" "}
                          </p>
                          <textarea
                            value={Mydata.text2}
                            placeholder="Shree Chetana Secondary School"
                            onChange={(event) => {
                              if (event.target.value.length > 600) {
                                return;
                              }

                              setMydata({
                                ...Mydata,
                                text2: event.target.value,
                              });
                            }}
                            style={{
                              width: "100%",
                              minHeight: "50px", // Initial height, you can adjust this
                              overflow: "hidden",
                              resize: "none", // Disable manual resizing
                              padding: "8px",
                            }}
                            onInput={(event) => {
                              event.target.style.height = "auto"; // Reset height to auto
                              event.target.style.height = `${event.target.scrollHeight}px`; // Adjust height to fit content
                            }}
                          />
                        </div>

                        <div className="each width4">
                          <p> Map Coordinates *</p>
                          <input
                            type="text"
                            name=""
                            value={Mydata.coordinates}
                            placeholder="Shree Chetana Secondary School"
                            onChange={(event) =>
                              setMydata({
                                ...Mydata,
                                coordinates: event.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="each width4">
                          <p> Describe the motto of school </p>
                          <p
                            className="text-secondary me-2"
                            style={{ fontSize: "10px", float: "right" }}
                          >
                            {" "}
                            {Mydata.text3
                              ? 2000 - Mydata.text3.length
                              : 2000}{" "}
                            characters left{" "}
                          </p>
                          <textarea
                            name=""
                            value={Mydata.text3}
                            id=""
                            cols="30"
                            rows="1" // Start with 1 row for auto-expansion
                            onChange={(event) => {
                              if (event.target.value.length > 2000) {
                                return;
                              }

                              setMydata({
                                ...Mydata,
                                text3: event.target.value,
                              });
                            }}
                            style={{
                              width: "100%",
                              minHeight: "50px", // Initial height, adjust as needed
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

                        <div className="each width4">
                          <p> Explain the role of school staffs </p>
                          <p
                            className="text-secondary me-2"
                            style={{ fontSize: "10px", float: "right" }}
                          >
                            {" "}
                            {Mydata.teamText
                              ? 1200 - Mydata.teamText.length
                              : 1200}{" "}
                            characters left{" "}
                          </p>
                          <textarea
                            name=""
                            value={Mydata.teamText}
                            id=""
                            cols="30"
                            rows="1" // Start with 1 row for auto-expansion
                            onChange={(event) => {
                              if (event.target.value.length > 200) {
                                return;
                              }

                              setMydata({
                                ...Mydata,
                                teamText: event.target.value,
                              });
                            }}
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

                        <div className="each width4">
                          <hr style={{ color: "grey" }} />
                        </div>

                        <div className="each width1">
                          <div className="selectImage">
                            <p className="h6 w500">Principle's Photo </p>
                            {!Mydata.principle.image && (
                              <img
                                src={addImage}
                                alt=""
                                onClick={() =>
                                  principlePhotoRef.current.click()
                                }
                              />
                            )}

                            {Mydata.principle.image &&
                              !Mydata.principle.image.secure_url && (
                                <img
                                  src={URL.createObjectURL(
                                    Mydata.principle.image
                                  )}
                                  alt=""
                                  onClick={() =>
                                    principlePhotoRef.current.click()
                                  }
                                />
                              )}

                            {Mydata.principle.image &&
                              Mydata.principle.image.secure_url && (
                                <img
                                  src={Mydata.principle.image.secure_url}
                                  alt=""
                                  onClick={() =>
                                    principlePhotoRef.current.click()
                                  }
                                />
                              )}

                            <input
                              ref={principlePhotoRef}
                              type="file"
                              name="image"
                              id=""
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];

                                if (selectedFile) {
                                  setMydata({
                                    ...Mydata,
                                    principle: {
                                      ...Mydata.principle,
                                      image: selectedFile,
                                    },
                                  });
                                }
                              }}
                              className="d-none"
                            />

                            <button
                              className="btn btn-secondary"
                              onClick={() => principlePhotoRef.current.click()}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "6px", fontSize: "13px" }}
                                icon={faPen}
                              />
                              {Mydata.principle.image
                                ? "Change Image"
                                : "Select Image"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {progress === 3 && (
                    <div className="our-form3636">
                      <p className="h5 w600 text-center">
                        {" "}
                        Contact Information{" "}
                      </p>
                      <div className="form-content6">
                        <div className="each width4">
                          <p> Contact No. </p>

                          <div className="title">
                            <div className="contents">
                              {!Mydata.phone.length > 0 && (
                                <p className="h6 w500 text-secondary py-2">
                                  No Contact Numbers Added
                                </p>
                              )}

                              {Mydata.phone.map((data, index) => {
                                return (
                                  <div className="each" key={index}>
                                    <p className="w300"> {data} </p>
                                    <div
                                      className="closes32 flex1"
                                      onClick={() =>
                                        handleRemoveContactNo(index)
                                      }
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grouping">
                            <input
                              className="inputAdv"
                              type="text"
                              placeholder="Add a Contact No."
                              ref={contactNoRef}
                              onKeyDown={(e) => {
                                // Allow only numbers and Enter key
                                if (e.key === "Enter") {
                                  e.preventDefault(); // Prevent default behavior
                                  const tempValue = contactNoRef.current.value;
                                  if (tempValue.trim() !== "") {
                                    setMydata((prev) => ({
                                      ...prev,
                                      phone: [...prev.phone, tempValue],
                                    }));
                                    contactNoRef.current.value = ""; // Clear the input field
                                  }
                                } else if (
                                  !/[0-9]/.test(e.key) &&
                                  e.key !== "Backspace"
                                ) {
                                  e.preventDefault(); // Block non-numeric characters
                                }
                              }}
                              onChange={(e) => {
                                // Ensure the value is always numeric (extra precaution)
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                            />
                            <div
                              className="enterBtn flex1"
                              onClick={() => {
                                let tempValue = contactNoRef.current.value;

                                setMydata({
                                  ...Mydata,
                                  phone: [...Mydata.phone, tempValue],
                                });

                                contactNoRef.current.value = "";
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="each width4">
                          <p> Email </p>

                          <div className="title">
                            <div className="contents">
                              {!Mydata.email.length > 0 && (
                                <p className="h6 w500 text-secondary py-2">
                                  No Email Addresses Added
                                </p>
                              )}

                              {Mydata.email.map((data, index) => {
                                return (
                                  <div className="each" key={index}>
                                    <p
                                      className="w300"
                                      style={{ textTransform: "lowercase" }}
                                    >
                                      {" "}
                                      {data}{" "}
                                    </p>
                                    <div
                                      className="closes32 flex1"
                                      onClick={() => handleRemoveEmail(index)}
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grouping">
                            <input
                              className="inputAdv"
                              type="text"
                              placeholder="Add an email address."
                              ref={emailsRef}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault(); // Prevent default behavior

                                  const tempValue =
                                    emailsRef.current.value.trim();

                                  // Basic email validation
                                  if (
                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                      tempValue
                                    ) &&
                                    !Mydata.email.includes(tempValue) // Avoid duplicate emails
                                  ) {
                                    setMydata((prev) => ({
                                      ...prev,
                                      email: [...prev.email, tempValue],
                                    }));
                                    emailsRef.current.value = ""; // Clear the input field
                                  } else {
                                    alert(
                                      "Please enter a valid and unique email address."
                                    );
                                  }
                                }
                              }}
                            />
                            <div
                              className="enterBtn flex1"
                              onClick={() => {
                                let tempValue = emailsRef.current.value;

                                setMydata({
                                  ...Mydata,
                                  email: [...Mydata.email, tempValue],
                                });

                                emailsRef.current.value = "";
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="each width4">
                          <hr style={{ color: "grey" }} />
                        </div>

                        <div className="each width4">
                          <div className="grouping">
                            <div
                              className="enterBtn flex1"
                              style={{
                                borderRadius: "5px",
                                width: "45px",
                                marginRight: "5px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faFacebook}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>

                            <input
                              className="inputAdv"
                              type="text"
                              name=""
                              value={Mydata.social.facebook}
                              placeholder="Facebook Url"
                              style={{ borderRadius: "5px" }}
                              onChange={(event) =>
                                setMydata({
                                  ...Mydata,
                                  social: {
                                    ...Mydata.social,
                                    facebook: event.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="each width4">
                          <div className="grouping">
                            <div
                              className="enterBtn flex1"
                              style={{
                                borderRadius: "5px",
                                width: "45px",
                                marginRight: "5px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faInstagram}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>

                            <input
                              className="inputAdv"
                              type="text"
                              name=""
                              value={Mydata.social.instagram}
                              placeholder="Instagram Url"
                              style={{ borderRadius: "5px" }}
                              onChange={(event) =>
                                setMydata({
                                  ...Mydata,
                                  social: {
                                    ...Mydata.social,
                                    instagram: event.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="each width4">
                          <div className="grouping">
                            <div
                              className="enterBtn flex1"
                              style={{
                                borderRadius: "5px",
                                width: "45px",
                                marginRight: "5px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTwitter}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>

                            <input
                              className="inputAdv"
                              type="text"
                              name=""
                              value={Mydata.social.twitter}
                              placeholder="Twitter Url"
                              style={{ borderRadius: "5px" }}
                              onChange={(event) =>
                                setMydata({
                                  ...Mydata,
                                  social: {
                                    ...Mydata.social,
                                    twitter: event.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="each width4">
                          <div className="grouping">
                            <div
                              className="enterBtn flex1"
                              style={{
                                borderRadius: "5px",
                                width: "45px",
                                marginRight: "5px",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faYoutube}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>

                            <input
                              className="inputAdv"
                              type="text"
                              name=""
                              value={Mydata.social.youtube}
                              placeholder="Youtube Url"
                              style={{ borderRadius: "5px" }}
                              onChange={(event) =>
                                setMydata({
                                  ...Mydata,
                                  social: {
                                    ...Mydata.social,
                                    youtube: event.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {progress === 4 && (
                    <div className="our-form3636">
                      <p className="h5 w600 text-center"> Few More </p>

                      <div className="form-content6">
                        <div className="each width4">
                          <p> Domain Name </p>
                          <input
                            type="text"
                            name=""
                            value={Mydata.domain}
                            id=""
                            placeholder="scholib.edu.np"
                            onChange={(event) =>
                              setMydata({
                                ...Mydata,
                                domain: event.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="each width4">
                          <p> School Policies </p>

                          <div className="title">
                            <div className="contents">
                              {!Mydata.policies.length > 0 && (
                                <p className="h6 w500 text-secondary py-2">
                                  No Policies Added
                                </p>
                              )}

                              {Mydata.policies.map((data, index) => {
                                return (
                                  <div className="each" key={index}>
                                    <p className="w300"> {data} </p>
                                    <div
                                      className="closes32 flex1"
                                      onClick={() => handleRemovePolicy(index)}
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grouping">
                            <input
                              className="inputAdv"
                              type="text"
                              placeholder="Add a New Policy."
                              ref={policiesRef}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault(); // Prevent default behavior (e.g., form submission)

                                  const tempValue =
                                    policiesRef.current.value.trim();

                                  if (tempValue !== "") {
                                    setMydata((prev) => ({
                                      ...prev,
                                      policies: [...prev.policies, tempValue],
                                    }));
                                    policiesRef.current.value = ""; // Clear the input field
                                  }
                                }
                              }}
                            />

                            <div
                              className="enterBtn flex1"
                              onClick={() => {
                                let tempValue = policiesRef.current.value;

                                setMydata({
                                  ...Mydata,
                                  policies: [...Mydata.policies, tempValue],
                                });

                                policiesRef.current.value = "";
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{ marginBottom: "0px" }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="each width4">
                          <hr />
                        </div>

                        <div className="each width4">
                          <p> School Images </p>
                        </div>

                        <div className="each width2">
                          <div className="selectImage">
                            <p className="h6 w500">Image 1</p>

                            {!Mydata.images ||
                              (!Mydata.images[0] && (
                                <img
                                  src={addImage}
                                  alt=""
                                  onClick={() =>
                                    schoolImage1Ref.current.click()
                                  }
                                />
                              ))}

                            {Mydata.images &&
                              Mydata.images[0] &&
                              !Mydata.images[0].secure_url && (
                                <img
                                  src={URL.createObjectURL(Mydata.images[0])}
                                  alt=""
                                  onClick={() =>
                                    schoolImage1Ref.current.click()
                                  }
                                />
                              )}

                            {Mydata.images &&
                              Mydata.images[0] &&
                              Mydata.images[0].secure_url && (
                                <img
                                  src={Mydata.images[0].secure_url}
                                  alt=""
                                  onClick={() =>
                                    schoolImage1Ref.current.click()
                                  }
                                />
                              )}

                            <input
                              ref={schoolImage1Ref}
                              type="file"
                              name="image"
                              id=""
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];

                                if (selectedFile) {
                                  setMydata({
                                    ...Mydata,
                                    images: [
                                      selectedFile,
                                      ...Mydata.images.slice(1),
                                    ],
                                  });
                                }
                              }}
                              className="d-none"
                            />

                            <button
                              className="btn btn-secondary"
                              onClick={() => schoolImage1Ref.current.click()}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "6px", fontSize: "13px" }}
                                icon={faPen}
                              />
                              {Mydata.images && Mydata.images[0]
                                ? "Change Image"
                                : "Select Image"}
                            </button>
                          </div>
                        </div>

                        <div className="each width2">
                          <div className="selectImage">
                            <p className="h6 w500">Image 2</p>
                            {!Mydata.images ||
                              (!Mydata.images[1] && (
                                <img
                                  src={addImage}
                                  alt=""
                                  onClick={() =>
                                    schoolImage2Ref.current.click()
                                  }
                                />
                              ))}

                            {Mydata.images &&
                              Mydata.images[1] &&
                              !Mydata.images[1].secure_url && (
                                <img
                                  src={URL.createObjectURL(Mydata.images[1])}
                                  alt=""
                                  onClick={() =>
                                    schoolImage2Ref.current.click()
                                  }
                                />
                              )}

                            {Mydata.images &&
                              Mydata.images[1] &&
                              Mydata.images[1].secure_url && (
                                <img
                                  src={Mydata.images[1].secure_url}
                                  alt=""
                                  onClick={() =>
                                    schoolImage2Ref.current.click()
                                  }
                                />
                              )}

                            <input
                              ref={schoolImage2Ref}
                              type="file"
                              name="image"
                              id=""
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];

                                if (selectedFile) {
                                  setMydata({
                                    ...Mydata,
                                    images: [
                                      Mydata.images[0],
                                      selectedFile,
                                      ...Mydata.images.slice(2),
                                    ],
                                  });
                                }
                              }}
                              className="d-none"
                            />

                            <button
                              className="btn btn-secondary"
                              onClick={() => schoolImage2Ref.current.click()}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "6px", fontSize: "13px" }}
                                icon={faPen}
                              />
                              {Mydata.images && Mydata.images[1]
                                ? "Change Image"
                                : "Select Image"}
                            </button>
                          </div>
                        </div>

                        <div className="each width2">
                          <div className="selectImage">
                            <p className="h6 w500">Image 3</p>

                            {!Mydata.images ||
                              (!Mydata.images[2] && (
                                <img
                                  src={addImage}
                                  alt=""
                                  onClick={() =>
                                    schoolImage3Ref.current.click()
                                  }
                                />
                              ))}

                            {Mydata.images &&
                              Mydata.images[2] &&
                              !Mydata.images[2].secure_url && (
                                <img
                                  src={URL.createObjectURL(Mydata.images[2])}
                                  alt=""
                                  onClick={() =>
                                    schoolImage3Ref.current.click()
                                  }
                                />
                              )}

                            {Mydata.images &&
                              Mydata.images[2] &&
                              Mydata.images[2].secure_url && (
                                <img
                                  src={Mydata.images[2].secure_url}
                                  alt=""
                                  onClick={() =>
                                    schoolImage3Ref.current.click()
                                  }
                                />
                              )}

                            <input
                              ref={schoolImage3Ref}
                              type="file"
                              name="image"
                              id=""
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];

                                if (selectedFile) {
                                  setMydata({
                                    ...Mydata,
                                    images: [
                                      Mydata.images[0],
                                      Mydata.images[1],
                                      selectedFile,
                                      ...Mydata.images.slice(3),
                                    ],
                                  });
                                }
                              }}
                              className="d-none"
                            />

                            <button
                              className="btn btn-secondary"
                              onClick={() => schoolImage3Ref.current.click()}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "6px", fontSize: "13px" }}
                                icon={faPen}
                              />
                              {Mydata.images && Mydata.images[2]
                                ? "Change Image"
                                : "Select Image"}
                            </button>
                          </div>
                        </div>

                        <div className="each width2">
                          <div className="selectImage">
                            <p className="h6 w500">Image 4</p>

                            {!Mydata.images ||
                              (!Mydata.images[3] && (
                                <img
                                  src={addImage}
                                  alt=""
                                  onClick={() =>
                                    schoolImage4Ref.current.click()
                                  }
                                />
                              ))}

                            {Mydata.images &&
                              Mydata.images[3] &&
                              !Mydata.images[3].secure_url && (
                                <img
                                  src={URL.createObjectURL(Mydata.images[3])}
                                  alt=""
                                  onClick={() =>
                                    schoolImage4Ref.current.click()
                                  }
                                />
                              )}

                            {Mydata.images &&
                              Mydata.images[3] &&
                              Mydata.images[3].secure_url && (
                                <img
                                  src={Mydata.images[3].secure_url}
                                  alt=""
                                  onClick={() =>
                                    schoolImage4Ref.current.click()
                                  }
                                />
                              )}

                            <input
                              ref={schoolImage4Ref}
                              type="file"
                              name="image"
                              id=""
                              accept="image/*"
                              onChange={(e) => {
                                const selectedFile =
                                  e.target.files && e.target.files[0];

                                if (selectedFile) {
                                  setMydata({
                                    ...Mydata,
                                    images: [
                                      Mydata.images[0],
                                      Mydata.images[1],
                                      Mydata.images[2],
                                      selectedFile,
                                      ...Mydata.images.slice(4),
                                    ],
                                  });
                                }
                              }}
                              className="d-none"
                            />

                            <button
                              className="btn btn-secondary"
                              onClick={() => schoolImage4Ref.current.click()}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "6px", fontSize: "13px" }}
                                icon={faPen}
                              />
                              {Mydata.images && Mydata.images[3]
                                ? "Change Image"
                                : "Select Image"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="buttons">
                  {progress === 1 && (
                    <button onClick={() => history.goBack()}>Close</button>
                  )}
                  {progress > 1 && (
                    <button onClick={() => setProgress(progress - 1)}>
                      Previous
                    </button>
                  )}
                  {progress < 4 && (
                    <button
                      className="ms-2"
                      onClick={() => setProgress(progress + 1)}
                    >
                      Next
                    </button>
                  )}
                  {progress === 4 && (
                    <button className="ms-2" onClick={() => handleSubmit()}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="each third rm-on-big">
              <div className="further">
                <div className="above">
                  <p className="h5"> Status </p>

                  <p className="h6"> Status </p>
                  <div className="myDiv"> Active </div>
                  <p className="h7 mt-2 ms-1"> We welcome you to Scholib </p>

                  <p className="h6"> Registered Date </p>
                  <p className="h7 mt-2 ms-1"> 2080/01/12 </p>
                </div>

                <div className="below pb-4">
                  <div className="image">
                    <img
                      src={logoImg}
                      alt=""
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <p className="h6 text-center" style={{ color: "#3E198D" }}>
                    Scholib.com
                  </p>
                  <p className="h7 text-center">
                    An initiative to bring all online
                  </p>

                  <hr />

                  <p className="h6 text-center w600"> contact </p>
                  <p className="h7 text-center" style={{ marginBottom: "0px" }}>
                    9836673351
                  </p>
                  <p className="h7 text-center" style={{ marginBottom: "0px" }}>
                    9836673351
                  </p>
                  <p className="h7 text-center" style={{ marginBottom: "0px" }}>
                    9836673351
                  </p>

                  <p className="h6 text-center w600 mt-3"> Email </p>
                  <p className="h7 text-center" style={{ marginBottom: "0px" }}>
                    contact@scholib.com
                  </p>
                  <p className="h7 text-center" style={{ marginBottom: "0px" }}>
                    bisiness.ujjwal@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateSchool;
