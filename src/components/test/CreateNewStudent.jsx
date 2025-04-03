import React, { useEffect, useRef, useState } from "react";
import "./createNewStudent.scss";
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
import { AFTER_ADMISSION_WORK } from "../../redux/HomeSlice";
import DatePicker from "../layout/DatePicker";

const CreateNewStudent = ({
  data,
  closeFunction,
  _id,
  title = "Edit Student's Info",
  course = false,
}) => {
  if (data && data.dob) {
    data.dob = formatDate(data.dob);
  }

  const dispatch = useDispatch();
  const course1 = useSelector((state) => state.Course.course.payload.course);
  const school = useSelector((state) => state.Home.school.payload);

  if (!course) {
    course = course1;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(undefined);

  const error = useSelector((state) => state.UpdateSchool.error.payload);
  const loading = useSelector((state) => state.UpdateSchool.loading);

  const blobToFile = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result;
        if (dataURL) {
          const fileType = blob.type.split("/")[1];

          // Generate a unique filename using a timestamp
          const timestamp = new Date().getTime();
          const fileName = `image_${timestamp}.${fileType}`;

          const file = new File([blob], fileName, {
            type: `image/${fileType}`,
          });

          resolve(file);
        } else {
          reject(new Error("Error reading the Blob."));
        }
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

  const sampleSt = {
    // Student's Personal data
    name: "",
    dob: "",
    gender: "Male",

    course: {
      class: "",
      group: "",
    },

    email: "",
    phone: "",
    address: "",
    psName: "",
    psAddress: "",
    gpa: undefined,
    photo1: undefined,
    photo2: undefined,
    photo3: undefined,
    photo4: undefined,

    // Parent's Info
    fName: "",
    mName: "",
    phone2: "",
    fProfession: "",
    mProfession: "",

    // Bus
    bus: {
      sataus: "",
      location: "",
    },
  };

  const [student, setStudent] = useState(data ? data : sampleSt);

  const [confirmPassword, setConfirmPassword] = useState("");

  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  const photo3Ref = useRef(null);
  const photo4Ref = useRef(null);

  async function handleStaffSubmit() {
    // Here is something the future developer might want to look for while updating the app
    // the thing is i actually use the same redux actions and reducer as in registering the school so make sure to consider this thing too and yeah don't be confused okay.. Now proceed Good luck

    if (!data) {
      if (student.password.length < 8) {
        return alert("Password must be of atleast 8 characters");
      }

      if (student.password !== confirmPassword) {
        return alert("Password and Confirm Password Don't Match");
      }
    }

    //for date format check
    var dateRegex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/;

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
        `${process.env.REACT_APP_API_URL}/adminStudent/${school.schoolCode}/admission/${_id}`,
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
          dispatch(AFTER_ADMISSION_WORK(_id));
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

  const [groupOptions, setGroupOptions] = useState([]);

  useEffect(() => {
    if (student.course.class) {
      const newGroupOptions = course
        .filter((crc) => crc._id === student.course.class)
        .flatMap((crc) =>
          crc.groups.map((grp) => ({
            label: grp.name,
            value: grp._id,
          }))
        );

      setGroupOptions(newGroupOptions);
    }
  }, [student.course.class]);

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

                <div className="each width1">
                  <p> Class </p>
                  <div className="wobbler" style={{ padding: "0px 3px" }}>
                    <Dropdown
                      options={course.map((crc) => {
                        return {
                          label: crc.class,
                          value: crc._id,
                        };
                      })}
                      title={
                        course.find((obj) => obj._id === student.course.class)
                          .class
                      }
                      onSelect={(a, b, _id) => {
                        let courseFound = course.find((crc) => {
                          return crc._id === _id;
                        });

                        setStudent({
                          ...student,
                          course: {
                            class: _id,
                            group: `${
                              courseFound.groups.length === 1
                                ? courseFound.groups[0]._id
                                : ""
                            }`,
                          },
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="each width1">
                  <p> Group </p>
                  <div className="wobbler" style={{ padding: "0px 3px" }}>
                    <Dropdown
                      options={course
                        .find((crc) => crc._id === student.course.class)
                        .groups.map((grp) => ({
                          label: grp.name,
                          value: grp._id,
                        }))}
                      title={
                        student.course.group
                          ? course
                              .find((obj) => obj._id === student.course.class)
                              .groups.find(
                                (obj2) => obj2._id === student.course.group
                              ).name
                          : "Select One"
                      }
                      onSelect={(a, b, _id) => {
                        setStudent({
                          ...student,
                          course: {
                            ...student.course,
                            group: _id,
                          },
                        });
                      }}
                    />
                  </div>
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

                  <DatePicker
                    data={student.dob}
                    setData={(value) =>
                      setStudent({
                        ...student,
                        dob: value,
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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

                {!data && (
                  <>
                    <div className="each width4">
                      <hr style={{ color: "grey" }} />
                    </div>

                    <div className="each width4">
                      <p> Create A Password </p>
                      <input
                        type="password"
                        name=""
                        value={student.password}
                        placeholder="*******"
                        onChange={(event) =>
                          setStudent({
                            ...student,
                            password: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="each width4">
                      <p> Confirm Password </p>
                      <input
                        type="password"
                        name=""
                        value={confirmPassword.password}
                        placeholder="*******"
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="buttons flex1">
            <button className="bg-gray-200 hover:bg-gray-300" onClick={() => closeFunction()}>Close</button>
            <button onClick={() => handleStaffSubmit()}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewStudent;
