import React, { useRef, useState } from "react";
import "./admission.scss";

import formImg from "../../images/form illustration.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import MetaData from "../layout/MetaData";
import Dropdown from "../basicComponents/Dropdown";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import addImage from "../../images/addImage.svg";

import {
  POST_STUDENT_ADMISSION,
  POST_STUDENT_ADMISSION_SUCCESS,
  POST_STUDENT_ADMISSION_FAIL,
  ERROR_REMOVE,
  CLEAR_STUDENT_ADMISSION_DATA,
} from "../../redux/StudentAdmissionSlice";

import Loading from "../layout/loading";
import Success from "../layout/Success";
import Error from "../layout/error";
import axios from "axios";
import DatePicker from "../layout/DatePicker";

const Admission = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const dispatch = useDispatch();

  const scrollRef = useRef(null);

  const school = useSelector((state) => state.Home.school.payload);
  // const course = useSelector((state) => state.Course.course.payload.course);
  const course = school.course;

  const studentAdmission = useSelector(
    (state) => state.StudentAdmission.data.payload
  );
  const loading = useSelector((state) => state.StudentAdmission.loading);
  const error = useSelector((state) => state.StudentAdmission.error.payload);

  const formInstructions = [
    "Carefully read through all instructions provided with the form to understand the requirements.",
    "Collect all necessary information and documents before starting to fill out the form.",
    "If filling out a paper form, ensure your handwriting is clear and legible. If online, type information accurately.",
    "Verify if there are any updates or changes to the form requirements or instructions before filling it out.",
    "Complete the form in the specified sequence.",
  ];

  // for the main form part
  const [progress, setProgress] = useState(1);

  //previous and next
  function handlePrevious() {
    setProgress(progress - 1);
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleNext() {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setProgress(progress + 1);
  }

  const sampleSt = {
    // Student's Personal data
    name: "Arjun Kumar",
    dob: "2012/12/12",
    gender: "Male",

    course: {
      class: "",
      group: "",
    },

    email: "srenuka288@gmail.com",
    phone: "9807879871",
    address: "shadhsadsa",
    psName: "",
    psAddress: "",
    gpa: undefined,
    photo1: undefined,
    photo2: undefined,
    photo3: undefined,
    photo4: undefined,

    // Parent's Info
    fName: "sdasdsadsadsa",
    mName: "dssadsa",
    phone2: "1232132131",
    fProfession: "",
    mProfession: "",

    // Bus
    bus: {
      location: "",
    },
  };

  const [student, setStudent] = useState({
    // Student's Personal data
    name: "Arjun Kumar",
    dob: "2010/12/12",
    gender: "Male",

    course: {
      class: "",
      group: "",
    },

    email: "srenuka288@gmail.com",
    phone: "9808989876",
    address: "Budddhshanti 2 Budhabare Jhapa",
    psName: "",
    psAddress: "",
    gpa: undefined,
    photo1: undefined,
    photo2: undefined,
    photo3: undefined,
    photo4: undefined,

    // Parent's Info
    fName: "hgdsadsa",
    mName: "dhsajdsa",
    phone2: "1234212121",
    fProfession: "jdhsasa",
    mProfession: "jhdsadsa",

    // Bus
    bus: {
      location: "",
    },
  });

  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  const photo3Ref = useRef(null);
  const photo4Ref = useRef(null);

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

  async function handleFinalSubmit() {
    //for date format check
    var dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(student.dob)) {
      return alert(
        "The DOB you entered is in incorrect format use year/month/day"
      );
    }

    const formDataObject = new FormData();

    if (student.photo1)
      formDataObject.append(
        "photo1",
        await blobToFile(student.photo1),
        "Profile Pic.jpg"
      );

    if (student.photo2)
      formDataObject.append(
        "photo2",
        await blobToFile(student.photo2),
        "photo2.jpg"
      );

    if (student.photo3)
      formDataObject.append(
        "photo3",
        await blobToFile(student.photo3),
        "photo3.jpg"
      );

    if (student.photo4)
      formDataObject.append(
        "photo4",
        await blobToFile(student.photo4),
        "photo4.jpg"
      );

    const MyData2 = { ...student };
    delete MyData2.photo1;
    delete MyData2.photo2;
    delete MyData2.photo3;
    delete MyData2.photo4;

    formDataObject.append("student", JSON.stringify(MyData2));

    dispatch(POST_STUDENT_ADMISSION());
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/basic/${school.schoolCode}/admission`,
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
          dispatch(POST_STUDENT_ADMISSION_SUCCESS(response.data));
        } else {
          dispatch(POST_STUDENT_ADMISSION_FAIL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(POST_STUDENT_ADMISSION_FAIL(error.response.data));
          return;
        }
        dispatch(POST_STUDENT_ADMISSION_FAIL(data));
      });
  }

  if (loading || error) {
    document.body.classList.add("dshauda-hidden32");
  } else if (!loading && !error) {
    document.body.classList.remove("dshauda-hidden32");
  }

  return (
    <>

    <div className="applyBootstrap">
      {loading && <Loading />}
      {studentAdmission && (
        <Success
          closeSuccess={() => {
            setStudent(sampleSt);
            dispatch(CLEAR_STUDENT_ADMISSION_DATA());
          }}
          data={{
            status: studentAdmission.status,
            message: studentAdmission.message,
          }}
        />
      )}
      {error && (
        <Error
          status={error.status}
          message={error.message}
          errorRemove={() => dispatch(ERROR_REMOVE())}
        />
      )}

      {!studentAdmission && !loading && !error && (
        <div className="ufevndsybds676">
          <MetaData title={`${school.sName} || Admission `} />

          <div className="main">
            <section className="top">
              <div className="element flex1">
                <img src={formImg} alt="" />
              </div>

              <div className="element">
                <p className="h5 w600 heading text-center">
                  {" "}
                  Form Instructions{" "}
                </p>

                <div
                  className="instructions d-flex mt-4"
                  style={{ width: "90%", flexDirection: "column" }}
                >
                  {formInstructions.map((instruction, index) => (
                    <div key={index} className="instruction-item">
                      <FontAwesomeIcon icon={faCircleCheck} className="mx-2" />
                      <p className="h6"> {instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="line"></div>

            <section className="middle">
              <p className="h5 w600 text-center f3"> Here To Go </p>
              <p className="h6 w400 text-center f2 mx-4 my-4 text-secondary">
                {" "}
                You can fill this form and pay the form charge and you will be
                admitted to {school.name} and your student id, school code and
                password will be sent to your phone number you provided in the
                form and you can login through scholib app or from schools
                website......{" "}
              </p>
            </section>

            <div className="line"></div>

            {/* for that legendary form component */}

            <div className="our-form3636" ref={scrollRef}>
              <p className="h5 w600 text-center" style={{ color: "#01BCD6" }}>
                {" "}
                Admission Form{" "}
              </p>

              <div className="cProgress flex1 custom-scrollbar">
                <div
                  className={`individual flex1 ${
                    progress === 1 ? "active" : ""
                  }`}
                  onClick={() => setProgress(1)}
                >
                  <div className="circle flex1"> 1 </div>
                  <p className="h6"> Student Info</p>
                  <p className="h6" style={{ color: "#434954" }}>
                    {" "}
                    {">"}{" "}
                  </p>
                </div>

                <div
                  className={`individual flex1 ${
                    progress === 2 ? "active" : ""
                  }`}
                  onClick={() => setProgress(2)}
                >
                  <div className="circle flex1"> 2 </div>
                  <p className="h6"> Parent's Info</p>
                  <p className="h6" style={{ color: "#434954" }}>
                    {" "}
                    {">"}{" "}
                  </p>
                </div>

                <div
                  className={`individual flex1 ${
                    progress === 3 ? "active" : ""
                  }`}
                  onClick={() => setProgress(3)}
                >
                  <div className="circle flex1"> 3 </div>
                  <p className="h6"> Documents </p>
                </div>
              </div>

              {progress === 1 && (
                <div className="form-content6">
                  <div className="each width2">
                    <p> Full Name * </p>
                    <input
                      type="text"
                      name=""
                      value={student.name}
                      placeholder="Mark Doe"
                      onChange={(event) =>
                        setStudent({ ...student, name: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width1">
                    <p> DOB (BS) y/m/d *</p>

                    <DatePicker
                      data={student.dob}
                      setData={(value) =>
                        setStudent({ ...student, dob: value })
                      }
                    />
                  </div>

                  <div className="each width1">
                    <p> Phone *</p>
                    <input
                      type="text"
                      name=""
                      value={student.phone}
                      placeholder="9843562452"
                      onChange={(event) =>
                        setStudent({ ...student, phone: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width2">
                    <p> Email *</p>
                    <input
                      type="text"
                      name=""
                      value={student.email}
                      placeholder="ujjwal7289@gmail.com"
                      onChange={(event) =>
                        setStudent({ ...student, email: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width1">
                    <p> Class *</p>
                    <div className="wobbler" style={{ padding: "0px 3px" }}>
                      <Dropdown
                        options={course.map((crc) => {
                          return {
                            label: crc.class,
                            value: crc._id,
                          };
                        })}
                        title={
                          course.find((crc) => crc._id === student.course.class)
                            ?.class || "Select One"
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

                  {student.course.class &&
                    course
                      .map((crc) => {
                        if (crc.groups.length > 1) {
                          return true;
                        } else {
                          return false;
                        }
                      })
                      .includes(true) && (
                      <div className="each width2">
                        <p> Group *</p>

                        <div className="checkbox-div">
                          <ul>
                            {course
                              .find((crc) => crc._id === student.course.class)
                              .groups.map((grp) => (
                                <li
                                  style={{ cursor: "pointer" }}
                                  key={grp._id}
                                  onClick={() => {
                                    setStudent({
                                      ...student,
                                      course: {
                                        ...student.course,
                                        group: grp._id,
                                      },
                                    });
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name="group"
                                    value={grp.value}
                                    checked={grp._id === student.course.group}
                                  />
                                  {grp.name} (
                                  {grp.subjects.map((sub) => {
                                    return `${sub}, `;
                                  })}
                                  )
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )}

                  <div className="each width2">
                    <p> Address *</p>
                    <input
                      type="text"
                      name=""
                      value={student.address}
                      placeholder="Buddhashanti 2 Budhabare Jhapa"
                      onChange={(event) =>
                        setStudent({ ...student, address: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width2">
                    <p>Gender *</p>

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
                    <p> Previous School Name </p>
                    <input
                      type="text"
                      name=""
                      value={student.psName}
                      placeholder="Shree Kankai English Boarding School"
                      onChange={(event) =>
                        setStudent({ ...student, psName: event.target.value })
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

                  <div className="each width1">
                    <p> GPA Last Year </p>
                    <input
                      type="text"
                      name=""
                      value={student.gpa}
                      placeholder="2.8"
                      onChange={(event) =>
                        setStudent({ ...student, gpa: event.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* parents info is available here  */}

              {progress === 2 && (
                <div className="form-content6">
                  <div className="each width2">
                    <p> Father's Name *</p>
                    <input
                      type="text"
                      name=""
                      value={student.fName}
                      placeholder="John Doe"
                      onChange={(event) =>
                        setStudent({ ...student, fName: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width2">
                    <p> Mother's Name *</p>
                    <input
                      type="text"
                      name=""
                      value={student.mName}
                      placeholder="Jane Doe"
                      onChange={(event) =>
                        setStudent({ ...student, mName: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width2">
                    <p> Contact No. *</p>
                    <input
                      type="text"
                      name=""
                      value={student.phone2}
                      placeholder="9834627824"
                      onChange={(event) =>
                        setStudent({ ...student, phone2: event.target.value })
                      }
                    />
                  </div>

                  <div className="each width1">
                    <p> Father's Profession </p>
                    <input
                      type="text"
                      name=""
                      value={student.fProfession}
                      placeholder="Doctor"
                      onChange={(event) =>
                        setStudent({
                          ...student,
                          fProfession: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="each width1">
                    <p> Mother's Profession </p>
                    <input
                      type="text"
                      name=""
                      value={student.mProfession}
                      placeholder="Pilot"
                      onChange={(event) =>
                        setStudent({
                          ...student,
                          mProfession: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* // fw last things to wrap up */}

              {progress === 3 && (
                <div className="form-content6">
                  <div className="each width1">
                    <div className="selectImage">
                      <p className="h6 w500"> Student's Photo </p>
                      {!student.photo1 && (
                        <img
                          src={addImage}
                          alt=""
                          onClick={() => photo1Ref.current.click()}
                        />
                      )}

                      {student.photo1 && (
                        <img
                          src={URL.createObjectURL(student.photo1)}
                          alt=""
                          onClick={() => photo1Ref.current.click()}
                        />
                      )}

                      <input
                        ref={photo1Ref}
                        type="file"
                        name="image"
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
                      <p className="h6 w500"> Student's Government Document </p>
                      {!student.photo2 && (
                        <img
                          src={addImage}
                          alt=""
                          onClick={() => photo2Ref.current.click()}
                        />
                      )}

                      {student.photo2 && (
                        <img
                          src={URL.createObjectURL(student.photo2)}
                          alt=""
                          onClick={() => photo2Ref.current.click()}
                        />
                      )}

                      <input
                        ref={photo2Ref}
                        type="file"
                        name="image"
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
                          src={URL.createObjectURL(student.photo3)}
                          alt=""
                          onClick={() => photo3Ref.current.click()}
                        />
                      )}

                      <input
                        ref={photo3Ref}
                        type="file"
                        name="image"
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
                          src={URL.createObjectURL(student.photo4)}
                          alt=""
                          onClick={() => photo4Ref.current.click()}
                        />
                      )}

                      <input
                        ref={photo4Ref}
                        type="file"
                        name="image"
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
              )}

              <div className="buttons my-4 d-flex justify-content-end">
                <button
                  className="btn btn-secondary mx-3"
                  style={{ width: "130px" }}
                  onClick={() => handlePrevious()}
                  disabled={progress === 1}
                >
                  Previous
                </button>

                <button
                  className={`btn btn-primary ${
                    progress === 3 ? "d-none" : ""
                  }`}
                  style={{ width: "130px" }}
                  onClick={() => handleNext()}
                  disabled={progress === 3}
                >
                  Next
                </button>

                <button
                  className={`btn btn-primary ${
                    progress !== 3 ? "d-none" : ""
                  }`}
                  style={{ width: "130px" }}
                  onClick={() => handleFinalSubmit()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

</div>
    </>
  );
};

export default Admission;
