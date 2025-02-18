import React, { useState, useRef, useEffect } from "react";
import "./studentDetails.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faCalendarDays,
  faCheck,
  faCoins,
  faMoneyBill,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import Table from "../layout/Table";
import Dropdown from "../basicComponents/Dropdown";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { useDispatch, useSelector } from "react-redux";
import FeeInfo from "./FeeInfo";
import BusStatus from "./BusStatus";
import StudentProfileBig2 from "../studentsControl/StudentProfileBig2";
import ClassInfo from "./ClassInfo";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../redux/ConfirmGlobalSlice";
import EditStudentMarks from "./EditStudentMarks";
import { convertTo12HourClock } from "../../tools/dateTool";
import { busPriceCalculator } from "../../tools/feeTools";
import GeneratePDF from "../layout/GeneratePDF";

const StudentDetails = ({
  _id,
  closeFunction,
  students = undefined,
  year = null,
}) => {
  const school = useSelector((state) => state.Home.school.payload);
  const course = useSelector((state) => state.Course.courseAll.payload.course);
  const courseCurrentOnly = useSelector(
    (state) => state.Course.course.payload.course
  );
  const allStudents1 = useSelector((state) => state.Students.students.payload);

  const allStudents = students ? students : allStudents1;

  const user = useSelector((state) => state.User.user.payload);
  const schoolCode = school.schoolCode;

  const amountRef = useRef(null);
  const remarkRef = useRef(null);
  const bookTitleRef = useRef(null);
  const dateTakenRef = useRef(null);
  const dateToReturnRef = useRef(null);

  const dispatch = useDispatch();

  const [student, setStudent] = useState(null);
  const [studentMainData, setStudentMainData] = useState(null);

  const StudentCourseInfo = allStudents.find(
    (indSt) => indSt._id === _id
  )?.course;

  // Getting student important course data
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data.data)

          const response1 = response.data.data;

          setStudentMainData({
            ...response1,
            ...response1.session.find(
              (ses) => ses.courseId == StudentCourseInfo.class
            ),
          });
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data.data));
          closeFunction();
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
  }, [_id]);

  // Getting student surface data
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/staff/${schoolCode}/student/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          response.data.data.course = StudentCourseInfo;

          setStudent(response.data.data);
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data.data));
          closeFunction();
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
  }, [_id]);

  const busPlaces = school.busFee.map((ind) => ({
    label: ind.location,
    value: ind._id,
  }));

  // For scrolling logic
  const libraryElementRef = useRef(null);

  const [paymentDetails, setPaymentDetails] = useState([]);
  const [libraryDetails, setLibraryDetails] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);

  useEffect(() => {
    if (studentMainData && studentMainData.paymentHistory.length > 0) {
      setPaymentDetails(
        studentMainData.paymentHistory.map((ind) => {
          return {
            date: ind.date.substring(0, 10),
            time: convertTo12HourClock(ind.time),
            approvedBy: school.staffs.find(
              (staf) => staf._id === ind.approvedBy
            ).name,
            amount: ind.amount,
          };
        })
      );
    }

    if (studentMainData) {
      setLibraryDetails(
        studentMainData.library
          .filter((ind) => !ind.returnedDate)
          .map((ind) => ({
            date: ind.date.substring(0, 10),
            approvedBy: school.staffs.find(
              (staf) => staf._id === ind.approvedBy
            ).name,
            book: ind.book,
            returnDate: ind.returnDate.substring(0, 10),
            _id: ind._id,
          }))
      );
    }

    if (studentMainData) {
      setReturnedBooks(
        studentMainData.library
          .filter((ind) => ind.returnedDate)
          .map((ind) => ({
            date: ind.date.substring(0, 10),
            approvedBy: school.staffs.find(
              (staf) => staf._id === ind.approvedBy
            ).name,
            book: ind.book,
            returnedDate: ind.returnedDate.substring(0, 10),
            _id: ind._id,
          }))
      );
    }
  }, [studentMainData]);

  const [selectedBooksTaken, setSelectedBooksTaken] = useState([]);

  function handleLibrarySelected(data) {
    setSelectedBooksTaken(data);
  }

  const [feeInfo, setFeeInfo] = useState(false);
  const [busStatus, setBusStatus] = useState(false);
  const [studentInfo, setStudentInfo] = useState(false);
  const [classInfo, setClassInfo] = useState(false);
  const cancelFeeRef = useRef(null);

  if (feeInfo || busStatus || studentInfo || classInfo || studentInfo) {
    document.body.classList.add("dshauda-hidden");
  } else if (
    !feeInfo &&
    !busStatus &&
    !studentInfo &&
    !classInfo &&
    !studentInfo
  ) {
    document.body.classList.remove("dshauda-hidden");
  }

  function handlePayFees() {
    const remark = remarkRef.current.value;
    const amount = amountRef.current.value;

    if (!amount) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Amount is required",
          message: "Please enter amount",
        })
      );
      setLoading(false);
      cancelFeeRef.current.click();
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/payFees`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            remark: remark,
            amount: amount,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        setConfirmAlert(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
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
          setLoading(false);
          setConfirmAlert(false);
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        setLoading(false);
        setConfirmAlert(false);
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  function handleAddBook() {
    const bookTitle = bookTitleRef.current.value;
    const dateTaken = dateTakenRef.current.value;
    const dateToReturn = dateToReturnRef.current.value;

    if (!bookTitle) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Book name not given",
          message: "Please enter the name of the book ",
        })
      );
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/addBook`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            book: bookTitle,
            date: dateTaken,
            returnDate: dateToReturn,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          bookTitleRef.current.value = "";
          dateTakenRef.current.value = "";
          dateToReturnRef.current.value = "";
          setLibraryDetails(
            response.data.data.session[0].library
              .filter((ind) => !ind.returnedDate)
              .map((ind) => ({
                date: ind.date.substring(0, 10),
                approvedBy: school.staffs.find(
                  (staf) => staf._id === ind.approvedBy
                ).name,
                book: ind.book,
                returnDate: ind.returnDate.substring(0, 10),
                _id: ind._id,
              }))
          );
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

  function returnBooks() {
    // const booksId = bookTitleRef.current.value;

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/returnBooks`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            allIds: JSON.stringify(
              selectedBooksTaken.map((ind) => libraryDetails[ind]._id)
            ),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
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

  const date = useSelector((state) => state.Other.date);

  const [confirmAlert, setConfirmAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  const [examInfoAll, setExamInfoAll] = useState(null);
  const [examData, setExamData] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [termData, setTermData] = useState(null);

  const [printData, setPrintData] = useState(null);

  async function deleteStudent() {
    dispatch(
      SET_CONFIRM_GLOBAL({
        message: "Do you really want to delete this student",
      })
    );

    // Create a Promise that resolves when confirmGlobalStatus is not null or declined
    const confirmPromise = new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (confirmGlobalStatus !== null) {
          clearInterval(intervalId);
          resolve();
        }
      }, 50); // Check every 100 milliseconds
    });

    // Wait for the confirmPromise to resolve
    await confirmPromise;

    if (confirmGlobalStatus === null || confirmGlobalStatus === "declined") {
      return dispatch(REMOVE_CONFIRM_GLOBAL());
    }

    dispatch(REMOVE_CONFIRM_GLOBAL());

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/delete`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
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

  async function getExamInfo() {
    // here deleted students exam info is not fetched

    // if (year) {
    //   return;
    // }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/exam`,
        {
          params: {
            year,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setExamInfoAll(response.data.data);
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

  useEffect(() => {
    getExamInfo();
  }, [_id]);

  useEffect(() => {
    if (examInfoAll) {
      setExamData(examInfoAll[examInfoAll.length - 1]);
    }
  }, [examInfoAll]);

  useEffect(() => {
    if (examData) {
      setCurrentTerm(examData.terms.length);
    }
  }, [examData]);

  useEffect(() => {
    if (currentTerm) {
      setTermData(examData.terms[currentTerm - 1]);
    }
  }, [currentTerm]);

  // confirm part

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );
  const [confirmGlobalStatus, setconfirmGlobalStatus] = useState(
    confirmGlobalStatusState
  );

  useEffect(() => {
    setconfirmGlobalStatus(confirmGlobalStatusState);
  }, [confirmGlobalStatusState]);

  useEffect(() => {
    if (confirmGlobalStatus !== null) {
      deleteStudent();
    }
  }, [confirmGlobalStatus]);

  function getClassAndExams(data) {
    const result = [];

    data.forEach((item) => {
      const { class: className, groups } = item;

      groups.forEach((group) => {
        group.sections.forEach((section) => {
          result.push({
            class: className,
            exam: section.exam,
          });
        });
      });
    });

    return result;
  }

  const classAndExams = getClassAndExams(course);

  // Particular student exam Update

  const [editMarksComponent, seteditMarksComponent] = useState(false);

  const [loadingStateForEditMarks, setLoadingStateForEditMarks] =
    useState(false);



    

  async function updateExamMarks(dataHere = {}) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/updateMarks`,
        dataHere,
        {
          params: {
            examId: examData.examId,
            termIndex: currentTerm - 1,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoadingStateForEditMarks(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          seteditMarksComponent(false);
          closeFunction();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data.data));
          return {
            error: true,
          };
        }
      })
      .catch((error) => {
        setLoadingStateForEditMarks(false);
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));

        return {
          error: true,
          data: error,
        };
      });
  }



  function findTotalFee() {
    let totalAmt = 0;
    let cCourse22 = course.find((crc) => crc._id === StudentCourseInfo.class);

    totalAmt = totalAmt + studentMainData.previousLeft;

    cCourse22.fees.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentMainData.fine.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentMainData.discount.forEach((elem) => {
      totalAmt = totalAmt - elem.amount;
    });

    return (
      totalAmt +
      busPriceCalculator(date, studentMainData.bus, school.busFee, "2081-01-01")
    );
  }

  function findClassFee() {
    let totalAmt = 0;
    let cCourse22 = course.find((crc) => crc._id === StudentCourseInfo.class);

    cCourse22.fees.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    return totalAmt;
  }

  function findAmountLeft() {
    return (
      findTotalFee() -
      studentMainData.paymentHistory.reduce((acc, hist) => acc + hist.amount, 0)
    );
  }




  function findSectionByExamId(data, examId) {
    for (const course of data) {
      for (const group of course.groups) {
        const section = group.sections.find(
          (section) => section.exam === examId
        );
        if (section) {
          return section;
        }
      }
    }
    return null; // Return null if no matching section is found
  }

  function handlePrintData() {
    // return []

    const students = [
      {
        studentInfo: {
          _id: studentMainData.studentId,
          name: studentMainData.name,
          id: studentInfo.loginId,
          class: classAndExams.find((ind) => ind.exam === examData.examId)
            .class,
          section: findSectionByExamId(course, examData.examId).name,
        },

        schoolInfo: {
          name: school.name,
          address: school.address,
        },

        examInfo: {
          term: currentTerm,
        },

        subjects: [],
      },
    ];

    let subjects = termData;

    if (!subjects || subjects.length === 0) {
      return [];
    }

    subjects.forEach((subject) => {
      let obj = {
        name: subject.subject,
        theory: subject.fullMarks,
        practical: subject.fullMarks2,
      };

      let std = subject.student;

      students.find((student, index) => {
        if (student.studentInfo._id === std.student) {
          students[index].subjects.push({
            ...obj,
            obtainedMarks: std.obtainedMarks,
            obtainedMarks2: std.obtainedMarks2,
          });
        }
      });
    });

    return students;
  }

  return (
    <>
      {studentMainData && (
        <div className="studentDetails63773 custom-scrollbar">
          {!student && (
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

          {student && !feeInfo && !busStatus && !classInfo && (
            <div className="main2373622367">
              <div className="closeContainer">
                <div className="close flex1" onClick={closeFunction}>
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>



              <section className="basicDetails">
                <div className="box flex2">
                  <div className="left">
                    <img
                      src={
                        student.photo1
                          ? student.photo1.secure_url
                          : "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                      }
                      alt=""
                    />
                  </div>

                  <div className="right">
                    {!studentMainData.removedOn && (
                      <div
                        className="sbjasdwxa flex1 mb-2"
                        style={{ justifyContent: "flex-end", width: "90%" }}
                      >
                        <button
                          className="btn btn-danger"
                          style={{ fontSize: "12px", width: "130px" }}
                          onClick={() => {
                            deleteStudent();
                          }}
                        >
                          Delete Student
                        </button>

                        <button
                          className="ms-2 btn btn-primary"
                          onClick={() => setClassInfo(true)}
                          style={{ fontSize: "12px", width: "100px" }}
                        >
                          Course Info
                        </button>
                      </div>
                    )}

                    {studentMainData.removedOn && (
                      <div
                        className="sbjasdwxa flex1 mb-2"
                        style={{ justifyContent: "flex-end", width: "90%" }}
                      >
                        <p
                          className="h7 w500 text-danger"
                          style={{ marginBottom: "0" }}
                        >
                          {" "}
                          Student Deleted{" "}
                        </p>
                      </div>
                    )}

                    <div className="top">
                      <p className="h6 w500"> {student.name}</p>
                    </div>
                    <div className="middle">
                      <div className="content">
                        <p className="text-secondary h6 f3 mb-1"> Class </p>
                        <p className="h7 ms-1">
                          {" "}
                          {
                            course.find(
                              (obj) => obj._id === student.course.class
                            ).class
                          }{" "}
                        </p>
                      </div>
                      <div className="content">
                        <p className="text-secondary h6 f3 mb-1"> Section </p>
                        <p className="h7 ms-1">
                          {" "}
                          {student.course.group
                            ? course
                                .find((obj) => obj._id === student.course.class)
                                .groups.find(
                                  (obj2) => obj2._id === student.course.group
                                )
                                .sections.find(
                                  (obj3) => obj3._id === student.course.section
                                ).name
                            : "Select One"}
                        </p>
                      </div>
                    </div>

                    <div className="middle-bottom custom-scrollbar">
                      <div className="content">
                        <p className="h6 w500">Phone</p>
                        <p className="h7"> {student.phone} </p>
                      </div>
                      <div className="content">
                        <p className="h6 w500">DOB</p>
                        <p className="h7"> {student.dob.substring(0, 10)} </p>
                      </div>
                      <div className="content">
                        <p className="h6 w500">Father's Name</p>
                        <p className="h7"> {student.fName} </p>
                      </div>
                      <div className="content">
                        <p className="h6 w500">Mother's Name</p>
                        <p className="h7"> {student.mName} </p>
                      </div>

                      <div className="content">
                        <p className="h6 w500">Address</p>
                        <p className="h7"> {student.address} </p>
                      </div>

                      <div className="content">
                        <p className="h6 w500">Email</p>
                        <p className="h7"> {student.email} </p>
                      </div>
                      <div className="content">
                        <p className="h6 w500"> Id</p>{" "}
                        <p className="h7"> {student.loginId} </p>
                      </div>
                      <div className="content">
                        <p className="h6 w500"> Bus Status</p>{" "}
                        <p className="h7">
                          {/* {"Budhabare Hard Coded Remove It later"} */}
                          {studentMainData.bus[0] && !studentMainData.bus[0].end
                            ? `Active ( ${
                                busPlaces.find(
                                  (ind) =>
                                    ind.value ===
                                      studentMainData.bus[0].place && ind.label
                                ).label
                              } )`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="buttons flex3">
                      <button
                        className="btn btn-primary"
                        onClick={() => setBusStatus(true)}
                      >
                        <FontAwesomeIcon
                          icon={faBus}
                          style={{ marginRight: "4px" }}
                        />
                        Bus Status
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => setFeeInfo(true)}
                      >
                        <FontAwesomeIcon
                          icon={faMoneyBill}
                          style={{ marginRight: "4px" }}
                        />
                        Fee Status
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => setStudentInfo(true)}
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          style={{ marginRight: "4px" }}
                        />
                        Visit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </section>


              
              <section className="paymentDetails">
                <p className="h5 w600 text-center text-secondary f2">
                  Payment History
                </p>

                <div
                  className={`payment-history custom-scrollbar ${
                    paymentDetails.length === 0 ? "shadow1" : ""
                  }`}
                >
                  <Table data={paymentDetails} />
                </div>

                <div className="payment-info flex2">
                  <div className="paid">
                    <p
                      className="h6 w600 text-secondary"
                      style={{ marginBottom: "0" }}
                    >
                      AMOUNT PAID :
                      <span className="w500 text-black ms-2">
                        {studentMainData.paymentHistory.reduce(
                          (acc, hist) => acc + hist.amount,
                          0
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="left">
                    <p
                      className="h6 w600 text-danger"
                      style={{ marginBottom: "0" }}
                    >
                      AMOUNT LEFT :
                      <span className="w500 text-black ms-2">
                        {findTotalFee() -
                          studentMainData.paymentHistory.reduce(
                            (acc, hist) => acc + hist.amount,
                            0
                          )}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="payment-control">
                  <input
                    className="input1 mt-3 mb-2"
                    type="text"
                    placeholder="Enter amount..."
                    ref={amountRef}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        e.target.value = value; // Allow only numbers
                      } else {
                        e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      }
                    }}
                  />

                  <input
                    className="input1 mb-3"
                    type="text"
                    placeholder="Remark..."
                    ref={remarkRef}
                  />
                  <button
                    className="btn btn-primary mb-3"
                    style={{ width: "100%", fontSize: "15px" }}
                    onClick={() => setConfirmAlert(true)}
                  >
                    Pay School Fees
                  </button>
                </div>

                {confirmAlert && (
                  <div className="confirm-payment flex1">
                    <div className="sdgsfbs custom-scrollbar">
                      <div className="box">
                        <>
                          <p
                            className="h5 w600 text-center"
                            style={{ marginBottom: "0px" }}
                          >
                            Confirm Payment{" "}
                          </p>

                          <hr className="pb-3" />

                          <div className="each flex4 my-2">
                            <div className="left d-flex">
                              <FontAwesomeIcon
                                icon={faCalendarDays}
                                style={{ color: "#00BCD7" }}
                              />
                              <p className="h6 text-secondary ms-2"> Date </p>
                            </div>

                            <div className="right d-flex">
                              <p className="h6 text-seconadry"> {date} </p>
                            </div>
                          </div>

                          <div className="each flex4 my-2">
                            <div className="left d-flex">
                              <FontAwesomeIcon
                                icon={faMoneyBill}
                                style={{ color: "#00BCD7" }}
                              />
                              <p className="h6 text-secondary ms-2">
                                {" "}
                                Payment Method{" "}
                              </p>
                            </div>

                            <div className="right d-flex">
                              <p className="h6 text-seconadry"> Cash </p>
                            </div>
                          </div>

                          <hr />

                          <div className="each flex4 my-2">
                            <div className="left d-flex">
                              <FontAwesomeIcon
                                icon={faCoins}
                                style={{ color: "#00BCD7" }}
                              />
                              <p className="h6 text-secondary ms-2">
                                {" "}
                                Amount (Rs.){" "}
                              </p>
                            </div>

                            <div className="right d-flex">
                              <p className="h6 text-seconadry">
                                {" "}
                                {`${
                                  amountRef.current.value
                                    ? amountRef.current.value
                                    : "N/A"
                                }`}{" "}
                              </p>
                            </div>
                          </div>

                          <div className="admission-inquiry352 flex3">
                            <div className="each left flex1">
                              <img
                                src={
                                  student.photo1
                                    ? student.photo1.secure_url
                                    : "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                                }
                                alt=""
                              />
                              <div className="info d-inline-block ms-4">
                                <p className="h6 w600 mb-2"> {student.name} </p>
                                <p className="h7">
                                  {" "}
                                  Class :{" "}
                                  {
                                    course.find(
                                      (obj) => obj._id === student.course.class
                                    ).class
                                  }{" "}
                                </p>
                                <p className="h7">
                                  {" "}
                                  Section :{" "}
                                  {student.course.group
                                    ? course
                                        .find(
                                          (obj) =>
                                            obj._id === student.course.class
                                        )
                                        .groups.find(
                                          (obj2) =>
                                            obj2._id === student.course.group
                                        )
                                        .sections.find(
                                          (obj3) =>
                                            obj3._id === student.course.section
                                        ).name
                                    : "Select One"}{" "}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="each flex4 my-2">
                            <div className="left d-flex">
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{ color: "#00BCD7" }}
                              />
                              <p className="h6 text-secondary ms-2">
                                {" "}
                                Initiated By{" "}
                              </p>
                            </div>

                            <div className="right d-flex">
                              <p className="h6 text-seconadry">{user.name}</p>
                            </div>
                          </div>

                          <hr style={{ marginTop: "20px" }} />

                          <div
                            className="buttons flex4"
                            style={{ marginTop: "20px" }}
                          >
                            <button
                              className="btn btn-secondary"
                              style={{ width: "48%", fontSize: "14px" }}
                              onClick={() => setConfirmAlert(false)}
                              ref={cancelFeeRef}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary"
                              style={{ width: "48%", fontSize: "14px" }}
                              onClick={() => {
                                setLoading(true);
                                handlePayFees();
                              }}
                            >
                              {" "}
                              Confirm{" "}
                            </button>
                          </div>
                        </>

                        {loading && (
                          <div
                            className="spinner-container flex1"
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: "0px",
                              left: "0px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <div
                              className="spinner-border text-primary my-4 loading452"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
              <hr />

              <section className="absent">
                <p className="h5 w600 text-secondary text-center mb-4">
                  Absent Days
                </p>

                <div className="abs-container">
                  <div className="each left" style={{ width: "100%" }}>
                    <Table
                      data={studentMainData.absentDays.map((each, index) => {
                        return {
                          sn: index + 1,
                          date: each.date.substring(0, 10),
                          reason: each.reason,
                        };
                      })}
                      fields={["SN", "Date", "Reason"]}
                    />
                  </div>
                </div>
              </section>
              <hr />

              {examData && (
                <>
                  <section className="results">
                    <p className="h5 w600 text-secondary text-center mt-5 my-4">
                      Results
                    </p>
                    <div className="dropdowns d-flex">
                      <Dropdown
                        options={examInfoAll.map((each) => {
                          return {
                            label: classAndExams.find(
                              (ind) => ind.exam === each.examId
                            ).class,
                            value: each.examId,
                          };
                        })}
                        title={`Class : ${
                          classAndExams.find(
                            (ind) => ind.exam === examData.examId
                          ).class
                        }`}
                        onSelect={(a, b, c) => {
                          setExamData(examInfoAll[a]);
                        }}
                      />
                      <Dropdown
                        options={examData.terms.map((ind, index) => {
                          return {
                            value: index,
                            label: `${index + 1}`,
                          };
                        })}
                        title={
                          currentTerm ? `Term : ${currentTerm}` : "Select Term"
                        }
                        onSelect={(a) => {
                          setCurrentTerm(parseInt(a + 1));
                        }}
                      />
                    </div>

                    {termData && (
                      <>
                        <div className="resultTable custom-scrollbar">
                          <Table
                            data={termData.map((ind, index) => {
                              return {
                                sn: index + 1,
                                subject: ind.subject,
                                fullMarks: ind.fullMarks,
                                passMarks: ind.passMarks,
                                obtainedMarks: ind.student
                                  ? ind.student.obtainedMarks
                                  : "",
                                obtainedMarks2: ind.student
                                  ? ind.student.obtainedMarks2
                                  : "",
                                status:
                                  (ind.student && ind.student.obtainedMarks) >
                                  ind.passMarks
                                    ? "Passed"
                                    : "Failed",
                              };
                            })}
                            fields={[
                              "Sn",
                              "Subject",
                              "Full Marks",
                              "Pass Marks",
                              "Written Marks",
                              "Practical Marks",
                              "Status",
                            ]}
                          />
                        </div>

                        <div className="flex1 resultTable justify-end px-2 gap-2">
                          {printData && (
                            <GeneratePDF
                              data={printData}
                              generate={true}
                              closePrint={() => setPrintData(false)}
                            />
                          )}

                          <button
                            onClick={() => {
                              setPrintData(handlePrintData());
                            }}
                            className="px-4 py-2 shadow1 w-full text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            {" "}
                            Generate Pdf{" "}
                          </button>

                          <button
                            className="px-4 py-2 shadow1 w-full text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => {
                              seteditMarksComponent(true);
                            }}
                          >
                            {" "}
                            Edit Marks
                          </button>
                        </div>
                      </>
                    )}
                  </section>

                  {editMarksComponent && (
                    <div
                      style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        zIndex: "103",
                        height: "100%",
                        width: "100vw",
                        background: "#fff",
                      }}
                    >
                      <div className="">
                        <EditStudentMarks
                          onClose={() => {
                            seteditMarksComponent(false);
                          }}
                          loading={loadingStateForEditMarks}
                          setLoading={setLoadingStateForEditMarks}
                          submitData={updateExamMarks}
                          dataMain={termData.map((each) => {
                            return {
                              subjectId: each.id,
                              subject: each.subject,
                              fullMarks: each.fullMarks,
                              fullMarks2: each.fullMarks2,
                              obtainedMarks: each.student.obtainedMarks,
                              obtainedMarks2: each.student.obtainedMarks2,
                            };
                          })}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <hr className="my-5" />
              <section className="library" ref={libraryElementRef}>
                <div className="box">
                  <p className="h5 w600 ms-3"> Library Info </p>
                  <hr className="mx-3" />
                  <div className="libTable custom-scrollbar">
                    <Table
                      data={libraryDetails}
                      fields={["Date", "Approved By", "Book", "Return Date"]}
                      selectedOnes={handleLibrarySelected}
                      exclude={["_id"]}
                    />
                  </div>
                  <hr className="mx-3 text-dark" />
                  <p className="text-danger text-center h6">
                    Books taken : &nbsp;
                    <span className="text-dark w500">
                      {libraryDetails.length}
                    </span>
                  </p>
                  <hr className="mx-3 text-dark" />
                </div>

                <div className="mainButtons">
                  <button
                    className={`btn btn-secondary mx-1 px-5 ${
                      selectedBooksTaken.length < 1 ? "disabled" : ""
                    }`}
                    style={{ width: "100%" }}
                    onClick={() => returnBooks()}
                  >
                    <FontAwesomeIcon icon={faCheck} /> &nbsp; Returned
                  </button>
                </div>

                <div className="addBook py-4 px-2">
                  <p className="h5 w600 ms-2"> Add a Book </p>

                  <hr />

                  <div className="text-input">
                    <p className="h6"> Book Title :</p>
                    <input
                      className="input1"
                      type="text"
                      name=""
                      id=""
                      ref={bookTitleRef}
                    />
                  </div>

                  <div className="text-input2">
                    <p className="h6"> Date Taken (y/m/d) :</p>
                    <input className="input1" type="text" ref={dateTakenRef} />
                  </div>

                  <div className="text-input2">
                    <p className="h6"> Return Date (y/m/d) :</p>
                    <input
                      className="input1"
                      type="text"
                      ref={dateToReturnRef}
                    />
                  </div>

                  <div className="buttons my-4 flex4 mx-2">
                    <button
                      className="btn btn-secondary"
                      style={{ width: "49%" }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ width: "49%" }}
                      onClick={() => handleAddBook()}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="libraryHistory">
                  <p className="h4 w600 ms-3"> Library History </p>

                  <div
                    className={`tableDiv custom-scrollbar mt-3 ${
                      returnedBooks.length === 0 ? "shadow1" : ""
                    }`}
                  >
                    <Table
                      data={returnedBooks}
                      fields={[
                        "Date",
                        "Approved By",
                        "Book Title",
                        "Returned Date",
                      ]}
                      exclude={["_id"]}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="touching-above">
            {feeInfo && (
              <FeeInfo
                _id={_id}
                StudentCourseInfo={StudentCourseInfo}
                data={studentMainData}
                classFee={findClassFee()}
                amountLeft={findAmountLeft()}
                busAmount={busPriceCalculator(
                  date,
                  studentMainData.bus,
                  school.busFee,
                  "2081-01-01"
                )}
                feePaid={studentMainData.paymentHistory.reduce(
                  (acc, hist) => acc + hist.amount,
                  0
                )}
                closeFunction={() => setFeeInfo(false)}
              />
            )}
            {busStatus && (
              <BusStatus
                StudentCourseInfo={StudentCourseInfo}
                data={studentMainData}
                _id={_id}
                closeFunction={() => setBusStatus(false)}
                closeMain={closeFunction}
              />
            )}
            {classInfo && (
              <ClassInfo
                course={courseCurrentOnly}
                data={StudentCourseInfo}
                _id={_id}
                closeFunction={() => setClassInfo(false)}
              />
            )}

            {studentInfo && (
              <StudentProfileBig2
                data={student}
                closeFunction={() => setStudentInfo(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDetails;
