import React, { useEffect, useRef, useState } from "react";
import "./editStudentProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
// import Dropdown from "../basicComponents/Dropdown";

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

const EditStudentProfile = ({
  data,
  closeFunction,
  _id,
  title = "Edit Student's Info",
}) => {
  if (data && data.dob) {
    data.dob = formatDate(data.dob);
  }

  const dispatch = useDispatch();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const school = useSelector((state) => state.Home.school.payload);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(undefined);

  const error = useSelector((state) => state.UpdateSchool.error.payload);
  const loading = useSelector((state) => state.UpdateSchool.loading);

  const blobToFile = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const img = new Image();
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
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
          const compressedDataURL = canvas.toDataURL('image/jpeg', 0.6); // Adjust quality as needed
  
          // Convert data URL to Blob
          const byteString = atob(compressedDataURL.split(',')[1]);
          const mimeString = compressedDataURL.split(',')[0].split(':')[1].split(';')[0];
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
          const file = new File([compressedBlob], fileName, { type: mimeString });
  
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

  function closeSuccess() {
    dispatch(ERROR_REMOVE());
  }

  //now taking the inputs for school-student
  const [student, setStudent] = useState(data);

  // const [confirmPassword, setConfirmPassword] = useState("");

  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  const photo3Ref = useRef(null);
  const photo4Ref = useRef(null);

  async function handleStaffSubmit() {
    // Here is something the future developer might want to look for while updating the app
    // the thing is i actually use the same redux actions and reducer as in registering the school so make sure to consider this thing too and yeah don't be confused okay.. Now proceed Good luck

    //for date format check
    var dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(student.dob)) {
      return alert(
        "The DOB you entered is in incorrect format use year/month/day"
      );
    }

    const formDataObject = new FormData();

    if (student.photo1 && !student.photo1.secure_url)
      formDataObject.append(
        "photo1",
        await blobToFile(student.photo1),
        "photo1.jpg"
      );

    if (student.photo2 && !student.photo2.secure_url)
      formDataObject.append(
        "photo2",
        await blobToFile(student.photo2),
        "photo2.jpg"
      );

    if (student.photo3 && !student.photo3.secure_url)
      formDataObject.append(
        "photo3",
        await blobToFile(student.photo3),
        "photo3.jpg"
      );

    if (student.photo4 && !student.photo4.secure_url)
      formDataObject.append(
        "photo4",
        await blobToFile(student.photo4),
        "photo4.jpg"
      );

    const MyData2 = { ...student };

    formDataObject.append("student", JSON.stringify(MyData2));

    dispatch(POST_UPDATE_SCHOOL());
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/adminStudent/${school.schoolCode}/students/profile/update/${_id}`,
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

  return (
    <div className="CreateNewStaudent36268 flex1">
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
                    value={student.name}
                    placeholder="John Doe"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        name: event.target.value,
                      })
                    }
                  />
                </div>

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
                        checked={student.gender === "Male"}
                        onChange={() =>
                          setStudent({ ...student, gender: "Male" })
                        }
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
                        checked={student.gender === "Female"}
                        onChange={() =>
                          setStudent({ ...student, gender: "Female" })
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
                        checked={student.gender === "Other"}
                        onChange={() =>
                          setStudent({ ...student, gender: "Other" })
                        }
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
                  <input
                    type="text"
                    name=""
                    value={student.dob}
                    placeholder="2050/12/20"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        dob: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Email </p>
                  <input
                    type="text"
                    name=""
                    value={student.email}
                    placeholder="someone@gmail.com"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        email: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Phone </p>
                  <input
                    type="text"
                    name=""
                    value={student.phone}
                    placeholder="9821234567"
                    onChange={(event) => {
                      const numericValue = event.target.value.replace(
                        /\D/g,
                        ""
                      ); // Remove non-numeric characters
                      setStudent({
                        ...student,
                        phone: numericValue,
                      });
                    }}
                  />
                </div>

                <div className="each width2">
                  <p> Address </p>
                  <input
                    type="text"
                    name=""
                    value={student.address}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        address: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Previous School Name </p>
                  <input
                    type="text"
                    name=""
                    value={student.psName}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        psName: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Previous School Address </p>
                  <input
                    type="text"
                    name=""
                    value={student.psAddress}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        psAddress: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width4">
                  <hr style={{ color: "grey" }} />
                </div>

                <div className="each width2">
                  <p> Father's Name </p>
                  <input
                    type="text"
                    name=""
                    value={student.fName}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        fName: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Father's Profession </p>
                  <input
                    type="text"
                    name=""
                    value={student.fProfession}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        fProfession: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Mother's Name </p>
                  <input
                    type="text"
                    name=""
                    value={student.mName}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        mName: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Mother's Profession </p>
                  <input
                    type="text"
                    name=""
                    value={student.mProfession}
                    placeholder="Buddhashanti 2 Budhabare Jhapa"
                    onChange={(event) =>
                      setStudent({
                        ...student,
                        mProfession: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width4">
                  <hr style={{ color: "grey" }} />
                </div>

                {/* Profile Picture */}

                <div className="each width1">
                  <div className="selectImage">
                    <p className="h6 w500"> Profile Picture </p>
                    {!student.photo1 && (
                      <img
                        src={addImage}
                        alt=""
                        onClick={() => photo1Ref.current.click()}
                      />
                    )}

                    {student.photo1 && (
                      <img
                        src={
                          student.photo1.secure_url
                            ? student.photo1.secure_url
                            : URL.createObjectURL(student.photo1)
                        }
                        alt=""
                        onClick={() => photo1Ref.current.click()}
                      />
                    )}

                    <input
                      ref={photo1Ref}
                      type="file"
                      name="image"
                      id=""
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];

                        if (selectedFile) {
                          setStudent({ ...student, photo1: selectedFile });
                        }
                      }}
                      className="d-none"
                    />

                    <button
                      className="btn btn-secondary"
                      onClick={() => photo1Ref.current.click()}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "6px", fontSize: "13px" }}
                        icon={faPen}
                      />
                      {student.photo1 ? "Change Image" : "Select Image"}
                    </button>
                  </div>
                </div>

                <div className="each width1">
                  <div className="selectImage">
                    <p className="h6 w500"> Government Id </p>
                    {!student.photo2 && (
                      <img
                        src={addImage}
                        alt=""
                        onClick={() => photo2Ref.current.click()}
                      />
                    )}

                    {student.photo2 && (
                      <img
                        src={
                          student.photo2.secure_url
                            ? student.photo2.secure_url
                            : URL.createObjectURL(student.photo2)
                        }
                        alt=""
                        onClick={() => photo2Ref.current.click()}
                      />
                    )}

                    <input
                      ref={photo2Ref}
                      type="file"
                      name="image"
                      id=""
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];

                        if (selectedFile) {
                          setStudent({ ...student, photo2: selectedFile });
                        }
                      }}
                      className="d-none"
                    />

                    <button
                      className="btn btn-secondary"
                      onClick={() => photo2Ref.current.click()}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "6px", fontSize: "13px" }}
                        icon={faPen}
                      />
                      {student.photo2 ? "Change Image" : "Select Image"}
                    </button>
                  </div>
                </div>

                <div className="each width1">
                  <div className="selectImage">
                    <p className="h6 w500"> Previous Class Certificate </p>
                    {!student.photo3 && (
                      <img
                        src={addImage}
                        alt=""
                        onClick={() => photo3Ref.current.click()}
                      />
                    )}

                    {student.photo3 && (
                      <img
                        src={
                          student.photo3.secure_url
                            ? student.photo3.secure_url
                            : URL.createObjectURL(student.photo3)
                        }
                        alt=""
                        onClick={() => photo3Ref.current.click()}
                      />
                    )}

                    <input
                      ref={photo3Ref}
                      type="file"
                      name="image"
                      id=""
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];

                        if (selectedFile) {
                          setStudent({ ...student, photo3: selectedFile });
                        }
                      }}
                      className="d-none"
                    />

                    <button
                      className="btn btn-secondary"
                      onClick={() => photo3Ref.current.click()}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "6px", fontSize: "13px" }}
                        icon={faPen}
                      />
                      {student.photo3 ? "Change Image" : "Select Image"}
                    </button>
                  </div>
                </div>

                <div className="each width1">
                  <div className="selectImage">
                    <p className="h6 w500"> Character Certificate </p>
                    {!student.photo4 && (
                      <img
                        src={addImage}
                        alt=""
                        onClick={() => photo4Ref.current.click()}
                      />
                    )}

                    {student.photo4 && (
                      <img
                        src={
                          student.photo4.secure_url
                            ? student.photo4.secure_url
                            : URL.createObjectURL(student.photo4)
                        }
                        alt=""
                        onClick={() => photo4Ref.current.click()}
                      />
                    )}

                    <input
                      ref={photo4Ref}
                      type="file"
                      name="image"
                      id=""
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];

                        if (selectedFile) {
                          setStudent({ ...student, photo4: selectedFile });
                        }
                      }}
                      className="d-none"
                    />

                    <button
                      className="btn btn-secondary"
                      onClick={() => photo4Ref.current.click()}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "6px", fontSize: "13px" }}
                        icon={faPen}
                      />
                      {student.photo4 ? "Change Image" : "Select Image"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons flex1">
            <button onClick={() => closeFunction()}>Close</button>
            <button onClick={() => handleStaffSubmit()}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStudentProfile;
