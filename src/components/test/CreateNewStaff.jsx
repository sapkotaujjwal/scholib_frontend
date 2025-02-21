import React, { useRef, useState } from "react";
import "./createNewStaff.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../basicComponents/Dropdown";

import {
  POST_UPDATE_SCHOOL,
  POST_UPDATE_SCHOOL_SUCCESS,
  POST_UPDATE_SCHOOL_FAIL,
  ERROR_REMOVE,
} from "../../redux/UpdateSchoolSlice";

import addImage from "../../images/addImage.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loading from "../layout/loading";
import Success from "../layout/Success";
import Error from "../layout/error";
import { GET_USER_SUCCESS } from "../../redux/UserSlice";
import DatePicker from "../layout/DatePicker";

const CreateNewStaff = ({
  data,
  closeFunction,
  _id,
  roleChange = false,
  title = "Add New Staff",
  selfUpdate = false,
  email = true,
}) => {
  if (data && data.dob) {
    data.dob = formatDate(data.dob);
  }

  const dispatch = useDispatch();

  const school = useSelector((state) => state.Home.school.payload);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(undefined);

  const error = useSelector((state) => state.UpdateSchool.error.payload);
  const loading = useSelector((state) => state.UpdateSchool.loading);

  // for dropdown options
  const options = [
    { value: "Administrator", label: "Administrator" },
    { value: "Coordinator", label: "Coordinator" },
    { value: "Moderator", label: "Moderator" },
    { value: "Staff", label: "Staff" },
    { value: "Teacher", label: "Teacher" },
    { value: "Worker", label: "Worker" },
  ];

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

  function handleSelect(index) {
    setAdmin((prevAdmin) => {
      return { ...prevAdmin, role: options[index].value };
    });
  }

  function closeSuccess() {
    dispatch(ERROR_REMOVE());
  }

  //now taking the inputs for school-admin
  const [admin, setAdmin] = useState(
    data
      ? data
      : {
          name: "",
          title: "",
          email: "",
          phone: "",
          address: "",
          qualification: "",
          about: "",
          dob: null,
          gender: "Male",
          pPhoto: undefined,
          password: "",
          role: "Worker",
        }
  );

  const adminPhotoRef = useRef(null);

  // not for self
  async function handleStaffSubmit() {
    // Here is something the future developer might want to look for while updating the app
    // the thing is i actually use the same redux actions and reducer as in registering the school so make sure to consider this thing too and yeah don't be confused okay.. Now proceed Good luck

    //for date format check
    var dateRegex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/;

    if (!dateRegex.test(admin.dob)) {
      return alert(
        "The DOB you entered is in incorrect format use year/month/day"
      );
    }

    const formDataObject = new FormData();

    formDataObject.append(
      "admin",
      JSON.stringify({
        loginId: 123456,
        password: "password22@",
      })
    );

    if (admin.pPhoto && !admin.pPhoto.secure_url)
      formDataObject.append(
        "pPhoto",
        await blobToFile(admin.pPhoto),
        "pPhoto.jpg"
      );

    const MyData2 = { ...admin };
    delete MyData2.pPhoto;

    formDataObject.append("staff", JSON.stringify(MyData2));

    if (!data) {
      dispatch(POST_UPDATE_SCHOOL());
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/staff/new`,
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
    } else {
      dispatch(POST_UPDATE_SCHOOL());
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/staff/profile/update/${_id}`,
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
  }

  //for self
  async function handleUpdateMyProfile() {
    //for date format check
    var dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(admin.dob)) {
      return alert(
        "The DOB you entered is in incorrect format use year/month/day"
      );
    }

    const formDataObject = new FormData();

    if (admin.pPhoto && !admin.pPhoto.secure_url)
      formDataObject.append(
        "pPhoto",
        await blobToFile(admin.pPhoto),
        "pPhoto.jpg"
      );

    const MyData2 = { ...admin };
    delete MyData2.pPhoto;

    formDataObject.append("staff", JSON.stringify(MyData2));

    dispatch(POST_UPDATE_SCHOOL());
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/staff/${school.schoolCode}/profile/update`,
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
          dispatch(GET_USER_SUCCESS(response.data.data));
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  return (
    <div className="CreateNewStaff36268 flex1">
      {loading && <Loading />}
      {isSuccess && (
        <Success
          closeSuccess={() => {
            closeFunction();
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
        <div className="inside29039 flex1">
          <p
            className="h6 text-center w600 pt-2"
            style={{ marginBottom: "0px" }}
          >
            {title}
          </p>

          <div className="content-req custom-scrollbar">
            <div className="our-form3636">
              <div className="form-content6">
                <div className="each width2">
                  <p> Full Name </p>
                  <input
                    type="text"
                    name=""
                    value={admin.name}
                    placeholder="John Doe"
                    onChange={(event) =>
                      setAdmin({
                        ...admin,
                        name: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Title </p>
                  <input
                    type="text"
                    name=""
                    value={admin.title}
                    placeholder="Physics Teacher"
                    onChange={(event) =>
                      setAdmin({
                        ...admin,
                        title: event.target.value,
                      })
                    }
                  />
                </div>

                {email && (
                  <div className="each width2">
                    <p> Email </p>
                    <input
                      type="text"
                      name=""
                      value={admin.email}
                      placeholder="someone@gmail.com"
                      onChange={(event) =>
                        setAdmin({
                          ...admin,
                          email: event.target.value,
                        })
                      }
                    />
                  </div>
                )}

                <div className="each width2">
                  <p> Phone </p>
                  <input
                    type="text"
                    name=""
                    value={admin.phone}
                    placeholder="9821234567"
                    onChange={(event) => {
                      const numericValue = event.target.value.replace(
                        /\D/g,
                        ""
                      ); // Remove non-numeric characters
                      setAdmin({
                        ...admin,
                        phone: numericValue,
                      });
                    }}
                  />
                </div>

                <div className="each width4">
                  <p> Address </p>
                  <input
                    type="text"
                    name=""
                    value={admin.address}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setAdmin({
                        ...admin,
                        address: event.target.value,
                      })
                    }
                  />
                </div>

                {(!data || roleChange) && (
                  <div className="each width1">
                    <p> Role </p>
                    <div className="wobbler" style={{ padding: "0px 3px" }}>
                      <Dropdown
                        options={options}
                        title={admin.role}
                        onSelect={handleSelect}
                      />
                    </div>
                  </div>
                )}

                <div className="each width2">
                  <p>Gender</p>

                  <div
                    className="d-flex gender-div"
                    style={{ marginTop: "8px", marginLeft: "3px" }}
                  >
                    <label
                      className="d-flex"
                      style={{
                        margin: "0px 5px 0px 0px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={admin.gender === "Male"}
                        onChange={() => setAdmin({ ...admin, gender: "Male" })}
                      />
                      <p
                        className="h6 w600"
                        style={{ marginLeft: "5px", marginBottom: "0px" }}
                      >
                        Male
                      </p>
                    </label>

                    <label
                      className="d-flex"
                      style={{ margin: "0px 10px", cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={admin.gender === "Female"}
                        onChange={() =>
                          setAdmin({ ...admin, gender: "Female" })
                        }
                      />
                      <p
                        className="h6 w600"
                        style={{ marginLeft: "5px", marginBottom: "0px" }}
                      >
                        Female
                      </p>
                    </label>

                    <label
                      className="d-flex"
                      style={{ margin: "0px 10px", cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={admin.gender === "Other"}
                        onChange={() => setAdmin({ ...admin, gender: "Other" })}
                      />
                      <p
                        className="h6 w600"
                        style={{ marginLeft: "5px", marginBottom: "0px" }}
                      >
                        Other
                      </p>
                    </label>
                  </div>
                </div>

                <div className="each width2">
                  <p> DOB (y/m/d) BS </p>


                  <DatePicker
                    data={admin.dob}
                    setData={(value) =>
                      setAdmin({
                        ...admin,
                        dob: value,
                      })
                    }
                  />
                </div>

                <div className="each width4">
                  <p> Qualification </p>
                  <input
                    type="text"
                    name=""
                    value={admin.qualification}
                    placeholder="B. Tech Computer Science"
                    onChange={(event) =>
                      setAdmin({
                        ...admin,
                        qualification: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width4">
                  <p> About </p>
                  <textarea
                    style={{ minHeight: "180px" }}
                    value={admin.about}
                    onChange={(event) =>
                      setAdmin({
                        ...admin,
                        about: event.target.value,
                      })
                    }
                    cols="30"
                    placeholder="Something you want to share..."
                    rows="10"
                  ></textarea>
                </div>

                <div className="each width4">
                  <hr style={{ color: "grey" }} />
                </div>

                <div className="each width1">
                  <div className="selectImage">
                    <p className="h6 w500"> Profile Picture </p>
                    {!admin.pPhoto && (
                      <img
                        src={addImage}
                        alt=""
                        onClick={() => adminPhotoRef.current.click()}
                      />
                    )}

                    {admin.pPhoto && (
                      <img
                        src={
                          admin.pPhoto.secure_url
                            ? admin.pPhoto.secure_url
                            : URL.createObjectURL(admin.pPhoto)
                        }
                        alt=""
                        onClick={() => adminPhotoRef.current.click()}
                      />
                    )}

                    <input
                      ref={adminPhotoRef}
                      type="file"
                      name="image"
                      id=""
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];

                        if (selectedFile) {
                          setAdmin({ ...admin, pPhoto: selectedFile });
                        }
                      }}
                      className="d-none"
                    />

                    <button
                      className="btn btn-secondary"
                      onClick={() => adminPhotoRef.current.click()}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "6px", fontSize: "13px" }}
                        icon={faPen}
                      />
                      {admin.pPhoto ? "Change Image" : "Select Image"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons flex1">
            <button className="bg-gray-300" onClick={() => closeFunction()}>
              Close
            </button>
            <button
              onClick={() => {
                if (selfUpdate) {
                  handleUpdateMyProfile();
                } else {
                  handleStaffSubmit();
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewStaff;
