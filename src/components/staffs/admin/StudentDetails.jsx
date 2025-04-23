import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";
import { busPriceCalculator } from "../../../tools/feeTools";

import BusStatus from "../BusStatus";
import ClassInfo from "../ClassInfo";
import EditStudentMarks from "../EditStudentMarks";
import DatePicker from "../../layout/DatePicker";
import AbsentDaysCalendar from "./AbsentDaysCalendar";
import EditStudentProfile from "../../studentsControl/EditStudentProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCalendarDays,
  faCoins,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const StudentDetails = ({ _id, students, year, closeFunction }) => {
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
  const dispatch = useDispatch();

  const [student, setStudent] = useState(null);
  const [studentMainData, setStudentMainData] = useState(null);
  const [studentCourseData, setStudentCourseData] = useState(null);

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
          const response1 = response.data.data;

          setStudentMainData(response1);

          setStudentCourseData(
            response1.session.find(
              (ses) => ses.courseId == StudentCourseInfo.class
            )
          );
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

  const [libraryDetails, setLibraryDetails] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);

  useEffect(() => {
    if (studentCourseData) {
      setLibraryDetails(
        studentCourseData.library
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

    if (studentCourseData) {
      setReturnedBooks(
        studentCourseData.library
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
  }, [studentCourseData]);

  const [selectedBooksTaken, setSelectedBooksTaken] = useState([]);

  const [busStatus, setBusStatus] = useState(false);
  const [classInfo, setClassInfo] = useState(false);
  const cancelFeeRef = useRef(null);

  if (busStatus || classInfo) {
    document.body.classList.add("dshauda-hidden");
  } else if (!busStatus && !classInfo) {
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
        setConfirmAlert(false);
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

  const [dateToReturn, setDateToReturn] = useState(null);

  function handleAddBook() {
    const bookTitle = bookTitleRef.current.value;

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
            returnDate: dateToReturn,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          bookTitleRef.current.value = "";
          setDateToReturn(null);
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
            allIds: JSON.stringify(selectedBooksTaken),
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

    totalAmt = totalAmt + studentCourseData.previousLeft;

    cCourse22.fees.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentCourseData.fine.forEach((elem) => {
      totalAmt = totalAmt + elem.amount;
    });

    studentCourseData.discount.forEach((elem) => {
      totalAmt = totalAmt - elem.amount;
    });

    return (
      totalAmt +
      busPriceCalculator(
        date,
        studentCourseData.bus,
        school.busFee,
        "2081-01-01"
      )
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
          id: student.loginId,
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

  const [currentClass, setCurrentClass] = useState(null);
  const [editStudent, setEditStudent] = useState(false);

  useEffect(() => {
    if (studentCourseData) {
      let findcurrentClass = course.find(
        (crc) => crc._id === studentCourseData.courseId
      );
      setCurrentClass(findcurrentClass);
    }
  }, [studentCourseData]);

  const [currentPage, setCurrentPage] = useState(1);
  const mainNavRef = useRef(null);
  const [mainNav, setMainNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [secondNavActive, setSecondNavActive] = useState("Fees");

  function addFine() {
    const remark = remarkRef.current.value;
    const amount = amountRef.current.value;

    if (!amount) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Amount is required",
          message: "Please enter amount ",
        })
      );
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/addFine`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            remark: remark,
            fineAmount: amount,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setConfirmAlert(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setConfirmAlert(false);
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

  function addDiscount() {
    const remark = remarkRef.current.value;
    const amount = amountRef.current.value;

    if (!amount) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Amount is required",
          message: "Please enter amount",
        })
      );
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/student/${_id}/addDiscount`,
        {
          params: {
            classId: StudentCourseInfo.class,
            groupId: StudentCourseInfo.group,
            sectionId: StudentCourseInfo.section,
            remark: remark,
            discountAmount: amount,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setConfirmAlert(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setConfirmAlert(false);
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
    const handleClickOutside = (event) => {
      if (mainNavRef.current && !mainNavRef.current.contains(event.target)) {
        setMainNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document
      .getElementById("studentDetailsContainer")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="noBootstrap">
      {studentCourseData && (
        <>
          {!student && (
            <div
              className="spinner-container flex1 applyBootstrap"
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

          {student && !busStatus && !classInfo && !editStudent && (
            <div className="flex">
              <div className="topNav flex items-center justify-between lg:hidden w-full h-16 bg-gray-800 fixed z-10 px-6 top-0 left-0 text-white shadow-md">
                <button onClick={() => setMainNav(true)}>
                  {" "}
                  <p className="text-2xl font-semibold cursor-pointer hover:text-gray-300 transition mb-0">
                    <FontAwesomeIcon icon={faBars} />
                  </p>{" "}
                </button>
                <button onClick={() => closeFunction()}>
                  {" "}
                  <p className="text-md font-semibold cursor-pointer hover:text-gray-300 transition mb-0">
                    Close
                  </p>{" "}
                </button>
              </div>

              {/* <!-- Sidebar --> */}

              <aside
                ref={mainNavRef}
                className={`${
                  !mainNav ? "hidden" : ""
                } w-[70vw] lg:block md:w-64 bg-gray-800 text-white h-screen p-5 fixed top-0 left-0 shadow-lg pt-20 z-10`}
              >
                <h2 className="text-2xl font-bold mb-8 text-white">
                  Student Details
                </h2>
                <ul>
                  <li
                    onClick={() => {
                      setCurrentPage(1);
                      setMainNav(false);
                    }}
                    className={`mb-4 p-3 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white ${
                      currentPage === 1 ? "bg-blue-700" : "bg-gray-700"
                    } text-gray-300`}
                  >
                    <i className="fas fa-chart-line mr-3"></i> Dashboard
                  </li>
                  <li
                    onClick={() => {
                      setCurrentPage(2);
                      setMainNav(false);
                    }}
                    className={`mb-4 p-3 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white ${
                      currentPage === 2 ? "bg-blue-700" : "bg-gray-700"
                    } text-gray-300`}
                  >
                    <i className="fas fa-user-circle mr-3"></i> Profile
                  </li>
                  <li
                    onClick={() => {
                      setCurrentPage(3);
                      setMainNav(false);
                    }}
                    className={`mb-4 p-3 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white ${
                      currentPage === 3 ? "bg-blue-700" : "bg-gray-700"
                    } text-gray-300`}
                  >
                    <i className="fas fa-wallet mr-3"></i> Payments
                  </li>
                  <li
                    onClick={() => {
                      setCurrentPage(4);
                      setMainNav(false);
                    }}
                    className={`mb-4 p-3 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white ${
                      currentPage === 4 ? "bg-blue-700" : "bg-gray-700"
                    } text-gray-300`}
                  >
                    <i className="fas fa-book mr-3"></i> Library
                  </li>
                </ul>
              </aside>

              <div className="mt-20 lg:mt-0 lg:ps-64 w-full">
                <main className="flex-1 p-2 md:p-5 lg:p-10">
                  {/* <!-- Student Profile --> */}

                  <div className="hidden relative lg:flex justify-end mx-3 mb-3 ">
                    <button
                      className="block lg:hidden absolute left-0 bg-gray-300 p-2 px-8 rounded-md hover:bg-gray-400 hover:text-gray-100 text-sm"
                      onClick={() => setMainNav(!mainNav)}
                    >
                      Open
                    </button>

                    <button
                      className="bg-gray-300 p-2 px-8 rounded-md hover:bg-gray-400 hover:text-gray-100 text-sm"
                      onClick={() => closeFunction()}
                    >
                      Close
                    </button>
                  </div>

                  {false && (
                    <div className="relative bg-white p-5 rounded-lg shadow1 mb-5">
                      {/* <h3 className=" text-xl font-bold">Student Profile</h3> */}
                      <div className="flex items-center mt-3 flex-wrap">
                        <div className="w-full md:w-[180px] my-2 md:mr-4 overflow-hidden">
                          <img
                            src={
                              student.photo1
                                ? student.photo1.secure_url
                                : "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                            }
                            alt="Student Avatar"
                            className="rounded-md w-full object-cover"
                          />
                        </div>
                        <div className="my-2 mx-auto md:mx-0">
                          <p className="text-lg font-semibold">
                            {student.name}
                          </p>
                          <p className="text-gray-600">{student.email}</p>
                          <p className="text-gray-600">
                            ID : {student.loginId}
                          </p>
                          <p className="text-gray-600">
                            Gender : {student.gender}
                          </p>
                          <p className="text-gray-600">
                            Class :{" "}
                            {
                              course.find(
                                (obj) => obj._id === student.course.class
                              ).class
                            }{" "}
                            | Section :{" "}
                            {student.course.group
                              ? course
                                  .find(
                                    (obj) => obj._id === student.course.class
                                  )
                                  .groups.find(
                                    (obj2) => obj2._id === student.course.group
                                  )
                                  .sections.find(
                                    (obj3) =>
                                      obj3._id === student.course.section
                                  ).name
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {!studentMainData.removedOn && (
                        <div className="">
                          <button
                            className="hidden md:block absolute top-14 right-6 text-sm p-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md mt-3"
                            style={{ fontSize: "12px", width: "130px" }}
                            onClick={() => {
                              deleteStudent();
                            }}
                          >
                            Delete Student
                          </button>

                          <button
                            className="hidden md:block absolute top-4 right-6 text-sm p-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md mt-3"
                            style={{ fontSize: "12px", width: "130px" }}
                            onClick={() => {
                              setEditStudent(true);
                            }}
                          >
                            Edit Student
                          </button>
                        </div>
                      )}

                      {studentMainData.removedOn && (
                        <div className="hidden md:block absolute top-4 right-6 text-sm">
                          <p className="text text-red-600"> Student Removed </p>
                        </div>
                      )}
                    </div>
                  )}

                  {true && (
                    <div className="relative bg-white p-5 rounded-lg shadow1 mb-5">
                      {/* <h3 className="text-xl font-bold">Student Profile</h3> */}
                      <div className="flex items-center mt-3 flex-wrap">
                        <div className="w-full md:w-[180px] my-2 md:mr-4 overflow-hidden">
                          <img
                            src={
                              student.photo1
                                ? student.photo1.secure_url
                                : "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                            }
                            alt="Student Avatar"
                            className="rounded-md w-full object-cover"
                          />
                        </div>
                        <div className="my-2 mx-auto md:mx-0">
                          <p className="text-lg font-semibold">
                            {student.name}
                          </p>
                          <p className="text-gray-600">{student.email}</p>
                          <p className="text-gray-600">
                            ID : {student.loginId}
                          </p>
                          <p className="text-gray-600">
                            Gender : {student.gender}
                          </p>
                          <p className="text-gray-600">
                            Class :{" "}
                            {
                              course.find(
                                (obj) => obj._id === student.course.class
                              ).class
                            }{" "}
                            | Section :{" "}
                            {student.course.group
                              ? course
                                  .find(
                                    (obj) => obj._id === student.course.class
                                  )
                                  .groups.find(
                                    (obj2) => obj2._id === student.course.group
                                  )
                                  .sections.find(
                                    (obj3) =>
                                      obj3._id === student.course.section
                                  ).name
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {!studentMainData.removedOn && (
                        <div className="hidden md:block absolute top-4 right-6">
                          <div className="relative">
                            <button
                              className="p-1 rounded-full hover:bg-gray-200"
                              onClick={() => setMenuOpen(!menuOpen)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </button>

                            {menuOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setEditStudent(true);
                                      setMenuOpen(false);
                                    }}
                                  >
                                    Edit Student
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    onClick={() => {
                                      deleteStudent();
                                      setMenuOpen(false);
                                    }}
                                  >
                                    Delete Student
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {studentMainData.removedOn && (
                        <div className="hidden md:block absolute top-4 right-6 text-sm">
                          <p className="text text-red-600"> Student Removed </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-white flex justify-end p-5 rounded-lg shadow1 mb-5">
                    {!studentMainData.removedOn &&
                      student.course.class === studentCourseData.courseId && (
                        <div className="hidden md:flex">
                          <button
                            className="text-sm bg-gray-300 hover:bg-gray-400 p-2 px-5 mx-2 rounded-sm hover:text-white"
                            onClick={() => setBusStatus(true)}
                          >
                            Bus Info
                          </button>
                          <button
                            className="text-sm bg-gray-300 hover:bg-gray-400 p-2 px-5 mx-2 rounded-sm hover:text-white"
                            onClick={() => setClassInfo(true)}
                          >
                            Class Info
                          </button>
                        </div>
                      )}

                    {true && (
                      <>
                        <select
                          className="border text-sm min-w-[100px] border-gray-300 rounded-sm p-2 px-4 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            // alert(e.target.value);
                            setStudentCourseData(
                              studentMainData.session.find(
                                (ses) => ses.courseId == e.target.value
                              )
                            );
                          }}
                        >
                          {studentMainData.session.map((session, index) => (
                            <option key={index} value={session.courseId}>
                              {
                                course.find(
                                  (crc) => crc._id === session.courseId
                                ).class
                              }
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>

                  <section>
                    {/* <!-- Dashboard --> */}

                    {currentPage === 1 && (
                      <div className="">
                        <div className="bg-white p-2 lg:p-6 rounded-lg shadow-lg mb-5">
                          {/* <!-- Exam Results --> */}

                          {examData && (
                            <>
                              <section>
                                <div className="bg-white p-2 lg:p-6 rounded-lg shadow-lg mb-5">
                                  <div className="">
                                    <h3 className="text-lg font-bold mb-3">
                                      Exam Results
                                    </h3>

                                    {/* Dropdowns for Class and Term Selection */}
                                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                                      <div className="flex justify-between items-center">
                                        <span className="hidden md:block text-gray-600 mr-2">
                                          Select Class :
                                        </span>

                                        <select
                                          className="p-2 border border-gray-300 rounded-md w-40 mr-4"
                                          onChange={(e) =>
                                            setExamData(
                                              examInfoAll.find(
                                                (each) =>
                                                  each.examId === e.target.value
                                              )
                                            )
                                          }
                                          value={examData.examId}
                                        >
                                          {examInfoAll.map((each) => {
                                            const classLabel =
                                              classAndExams.find(
                                                (ind) =>
                                                  ind.exam === each.examId
                                              )?.class;

                                            return (
                                              <option
                                                key={each.examId}
                                                value={each.examId}
                                              >
                                                {classLabel}
                                              </option>
                                            );
                                          })}
                                        </select>

                                        <span className="hidden md:block text-gray-600 mr-2">
                                          Select Term :
                                        </span>

                                        <select
                                          className="p-2 border border-gray-300 rounded-md w-40"
                                          onChange={(e) =>
                                            setCurrentTerm(
                                              parseInt(e.target.value) + 1
                                            )
                                          }
                                          value={
                                            currentTerm ? currentTerm - 1 : ""
                                          }
                                        >
                                          {examData.terms &&
                                            examData.terms.map(
                                              (term, index) => (
                                                <option
                                                  key={index}
                                                  value={index}
                                                >
                                                  Term {index + 1}
                                                </option>
                                              )
                                            )}
                                        </select>
                                      </div>
                                    </div>

                                    {/* Marks Table */}
                                    {termData && (
                                      <div className="bg-white rounded-md shadow-sm mb-5 overflow-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                                          <thead>
                                            <tr className="bg-gradient-to-r from-gray-200 to-gray-200 text-gray-700">
                                              <th className="px-4 py-3 text-left font-medium text-sm uppercase tracking-wider">
                                                SN
                                              </th>
                                              <th className="px-4 py-3 text-left font-medium text-sm uppercase tracking-wider">
                                                Subject
                                              </th>
                                              <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wider">
                                                Full Marks
                                              </th>
                                              <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wider">
                                                Pass Marks
                                              </th>
                                              <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wider">
                                                Written
                                              </th>
                                              <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wider">
                                                Practical
                                              </th>
                                              <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wider">
                                                Status
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {termData.map((subject, index) => {
                                              const totalMarks =
                                                (subject.student
                                                  ?.obtainedMarks || 0) +
                                                (subject.student
                                                  ?.obtainedMarks2 || 0);
                                              const isPassed =
                                                totalMarks >= subject.passMarks;

                                              return (
                                                <tr
                                                  key={index}
                                                  className={
                                                    index % 2 === 0
                                                      ? "bg-white"
                                                      : "bg-gray-50"
                                                  }
                                                >
                                                  <td className="px-4 py-3 text-gray-900">
                                                    {index + 1}
                                                  </td>
                                                  <td className="px-4 py-3 text-gray-900 font-medium">
                                                    {subject.subject}
                                                  </td>
                                                  <td className="px-4 py-3 text-center text-gray-700">
                                                    {subject.fullMarks}
                                                  </td>
                                                  <td className="px-4 py-3 text-center text-gray-700">
                                                    {subject.passMarks}
                                                  </td>
                                                  <td className="px-4 py-3 text-center text-gray-700">
                                                    {subject.student
                                                      ?.obtainedMarks || "-"}
                                                  </td>
                                                  <td className="px-4 py-3 text-center text-gray-700">
                                                    {subject.student
                                                      ?.obtainedMarks2 || "-"}
                                                  </td>
                                                  <td className="px-4 py-3 text-center">
                                                    {subject.student ? (
                                                      <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                          isPassed
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                      >
                                                        {isPassed
                                                          ? "Passed"
                                                          : "Failed"}
                                                      </span>
                                                    ) : (
                                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <button
                                        onClick={() =>
                                          setPrintData(handlePrintData())
                                        }
                                        className="w-full bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                                      >
                                        Generate PDF
                                      </button>
                                      <button
                                        onClick={() =>
                                          seteditMarksComponent(true)
                                        }
                                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                                      >
                                        Edit Result
                                      </button>
                                    </div>
                                  </div>
                                </div>
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
                                          obtainedMarks:
                                            each.student.obtainedMarks,
                                          obtainedMarks2:
                                            each.student.obtainedMarks2,
                                        };
                                      })}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* <!-- Bus Info --> */}
                          <div className="bg-white p-3 md:p-4 lg:p-8 rounded-lg shadow-lg mb-6 mx-auto border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">
                              Bus Information
                            </h3>

                            <div className="flex justify-between items-center mb-6">
                              <div className="flex flex-col items-left">
                                <span className="text-sm text-gray-700 font-medium">
                                  Status
                                </span>
                                <span className="text-lg text-gray-900">
                                  {studentCourseData.bus[0] &&
                                  !studentCourseData.bus[0].end
                                    ? `Active`
                                    : "Inactive"}
                                </span>
                              </div>

                              <div className="flex flex-col items-left">
                                <span className="text-sm text-gray-700 font-medium">
                                  Place
                                </span>
                                <span className="text-lg text-gray-900">
                                  {studentCourseData.bus[0] &&
                                  !studentCourseData.bus[0].end
                                    ? `${
                                        busPlaces.find(
                                          (ind) =>
                                            ind.value ===
                                              studentCourseData.bus[0].place &&
                                            ind.label
                                        ).label
                                      }`
                                    : "N/A"}
                                </span>
                              </div>

                              <div className="flex flex-col items-left">
                                <span className="text-sm text-gray-700 font-medium">
                                  Total Fare
                                </span>
                                <span className="text-lg text-gray-900">
                                  Rs.{" "}
                                  {busPriceCalculator(
                                    date,
                                    studentCourseData.bus,
                                    school.busFee,
                                    "2081-01-01"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* <!-- Bus History Table --> */}
                          <div className="bg-gray-50 p-2 py-5 lg:p-5 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">
                              Bus History
                            </h4>
                            <div className="overflow-auto">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                      Start
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                      Route
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                      Fare
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                      End
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {studentCourseData.bus.map((ind, index) => {
                                    return (
                                      <tr
                                        key={index}
                                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                                      >
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                          {ind.start}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                          {
                                            busPlaces.find(
                                              (ind2) => ind2.value === ind.place
                                            ).label
                                          }
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                          Rs{" "}
                                          {busPriceCalculator(
                                            date,
                                            [ind],
                                            school.busFee,
                                            "2081-01-01"
                                          )}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                          {ind.end || "---------"}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="rounded-xl shadow-sm p-2 py-5 md:p-4 lg:p-6 bg-gray-50 mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                              Student Attendance
                            </h2>

                            <div className="flex flex-col lg:flex-row gap-8">
                              {/* <!-- Calendar --> */}
                              <div className="flex-1 bg-white rounded-md min-w-[50%]">
                                <AbsentDaysCalendar
                                  absentDays={studentCourseData.absentDays}
                                />
                              </div>

                              {currentClass && (
                                <div className="bg-white rounded-xl shadow-sm p-2 py-6 md:p-4 lg:p-6 min-w-[50%]">
                                  <div className="flex flex-col gap-8">
                                    {/* <!-- Working Days Section --> */}
                                    <div className="md:bg-gray-50 rounded-xl p-3 py-8 md:p-8 mb-8 md:shadow-lg">
                                      <div className="flex justify-center items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                          Summary
                                        </h3>
                                      </div>

                                      <div className="">
                                        {/* <!-- Total Working Days --> */}
                                        <div className="bg-blue-100 p-3 rounded-xl shadow-md flex flex-col items-center space-y-1">
                                          <h4 className="text-sm font-semibold text-gray-800">
                                            Total Working Days
                                          </h4>
                                          <p className="text-xl font-semibold text-blue-600">
                                            {
                                              currentClass.groups[0].sections[0]
                                                .workingDates.length
                                            }
                                          </p>
                                        </div>

                                        {/* <!-- Absent Days --> */}
                                        <div className="bg-red-100 p-3 rounded-xl shadow-md flex flex-col items-center space-y-1 my-4">
                                          <h4 className="text-sm font-semibold text-gray-800">
                                            Absent Days
                                          </h4>
                                          <p className="text-xl font-semibold text-red-600">
                                            {
                                              studentCourseData.absentDays
                                                .length
                                            }
                                          </p>
                                        </div>

                                        {/* <!-- Present Days --> */}
                                        <div className="bg-green-100 p-3 rounded-xl shadow-md flex flex-col items-center space-y-1">
                                          <h4 className="text-sm font-semibold text-gray-800">
                                            Present Days
                                          </h4>
                                          <p className="text-xl font-semibold text-green-600">
                                            {currentClass.groups[0].sections[0]
                                              .workingDates.length -
                                              studentCourseData.absentDays
                                                .length}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* <!-- profile --> */}

                    {currentPage === 2 && (
                      <div className="bg-white p-3 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
                        <div className="">
                          {/* <!-- Contact Info --> */}
                          <div className="bg-gray-50 p-2 py-4 md:p-4 rounded-lg shadow-sm mb-4">
                            <h3 className="text-base font-semibold mb-2">
                              Contact Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email :</span>
                                <span className="font-medium">
                                  {student.email}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Phone :</span>
                                <span className="font-medium">
                                  {student.phone}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Address :</span>
                                <span className="font-medium">
                                  {student.address}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* <!-- Parents' Info --> */}
                          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                            <h3 className="text-base font-semibold mb-2">
                              Parent Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Contact No :
                                </span>
                                <span className="font-medium">
                                  {student.phone2}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Father's Name :
                                </span>
                                <span className="font-medium">
                                  {student.fName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Mother's Name :
                                </span>
                                <span className="font-medium">
                                  {student.mName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Father's Profession :
                                </span>
                                <span className="font-medium">
                                  {student.fProfession}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Mother's Profession :
                                </span>
                                <span className="font-medium">
                                  {student.mProfession}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* <!-- GPA and Previous School Info --> */}
                          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                            <h3 className="text-base font-semibold mb-2">
                              Academic Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Previous School Name :
                                </span>
                                <span className="font-medium">
                                  {student.psName || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Previous School Address :
                                </span>
                                <span className="font-medium">
                                  {student.psAddress || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Profile Photos --> */}
                        <div className="bg-gray-50 p-2 py-5 lg:p-5 rounded-lg shadow-sm mb-5">
                          <h3 className="text-lg font-bold mb-3">
                            Student Media
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {student.photo1 && (
                              <img
                                src={student.photo1.secure_url}
                                alt="Profile Photo 1"
                                className="rounded-lg w-[100%] h-[220px] object-cover"
                              />
                            )}

                            {student.photo2 && (
                              <img
                                src={student.photo2.secure_url}
                                alt=""
                                className="rounded-lg w-[100%] h-[220px] object-cover"
                              />
                            )}

                            {student.photo3 && (
                              <img
                                src={student.photo3.secure_url}
                                alt="Profile Photo 1"
                                className="rounded-lg w-[100%] h-[220px] object-cover"
                              />
                            )}

                            {student.photo4 && (
                              <img
                                src={student.photo4.secure_url}
                                alt="Profile Photo 1"
                                className="rounded-lg w-[100%] h-[220px] object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* <!-- Payments  --> */}
                    {currentPage === 3 && (
                      <>
                        <div className="bg-gray-100 rounded-sm py-3 px-5 my-3">
                          <nav className="flex justify-start">
                            {["Fees", "Discount", "Fine"].map((item) => (
                              <button
                                key={item}
                                onClick={() => {
                                  setSecondNavActive(item);
                                  amountRef.current.value = "";
                                  remarkRef.current.value = "";
                                }}
                                className={`px-8 py-2 text-sm rounded-sm transition-all 
                                ${
                                  secondNavActive === item
                                    ? "bg-blue-500 text-white"
                                    : ""
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </nav>
                        </div>

                        {secondNavActive === "Fees" && (
                          <div className="bg-white p-2 md:p-4 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
                            {/* <!-- Payment Summary --> */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="bg-blue-100 p-4 rounded-lg text-center">
                                <p className="text-gray-600 text-sm">
                                  Total Amount
                                </p>
                                <p className="text-xl font-bold text-blue-700">
                                  {findTotalFee()}
                                </p>
                              </div>
                              <div className="bg-green-100 p-4 rounded-lg text-center">
                                <p className="text-gray-600 text-sm">
                                  Amount Paid
                                </p>
                                <p className="text-xl font-bold text-green-700">
                                  {studentCourseData.paymentHistory.reduce(
                                    (acc, hist) => acc + hist.amount,
                                    0
                                  )}
                                </p>
                              </div>
                              <div className="bg-red-100 p-4 rounded-lg text-center">
                                <p className="text-gray-600 text-sm">
                                  Amount Left
                                </p>
                                <p className="text-xl font-bold text-red-700">
                                  {findTotalFee() -
                                    studentCourseData.paymentHistory.reduce(
                                      (acc, hist) => acc + hist.amount,
                                      0
                                    )}
                                </p>
                              </div>
                            </div>

                            {/* <!-- Bill Breakdown --> */}
                            <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-5">
                              <h3 className="text-lg font-bold mb-3">
                                Bill Breakdown
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Class Fee :
                                  </span>
                                  <span className="font-semibold">
                                    {findClassFee()}
                                  </span>
                                </div>

                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Bus Fee :
                                  </span>
                                  <span className="font-semibold">
                                    {busPriceCalculator(
                                      date,
                                      studentCourseData.bus,
                                      school.busFee,
                                      "2081-01-01"
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Previous Due :
                                  </span>
                                  <span className="font-semibold">
                                    {studentCourseData.previousLeft}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Discount :
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    -{" "}
                                    {studentCourseData.discount.reduce(
                                      (acc, hist) => acc + hist.amount,
                                      0
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Fine :</span>
                                  <span className="font-semibold text-red-600">
                                    +{" "}
                                    {studentCourseData.fine.reduce(
                                      (acc, hist) => acc + hist.amount,
                                      0
                                    )}
                                  </span>
                                </div>
                                <hr className="my-2 border-gray-300" />
                                <div className="flex justify-between text-md font-semibold text-gray-600">
                                  <span>Total Payable :</span>
                                  <span>{findTotalFee()}</span>
                                </div>

                                <div className="flex justify-between text-md font-semibold text-gray-600">
                                  <span>Amount Paid :</span>
                                  <span>
                                    {" "}
                                    {studentCourseData.paymentHistory.reduce(
                                      (acc, hist) => acc + hist.amount,
                                      0
                                    )}
                                  </span>
                                </div>

                                <hr />

                                <div className="flex justify-between text-md font-semibold text-red-600">
                                  <span>Amount Left :</span>
                                  <span>
                                    {findTotalFee() -
                                      studentCourseData.paymentHistory.reduce(
                                        (acc, hist) => acc + hist.amount,
                                        0
                                      )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow-lg">
                              <h3 className="text-md text-gray-600 font-semibold mb-3">
                                Payment History
                              </h3>
                              <div className="overflow-auto">
                                <table className="w-full min-w-full border text-gray-600 border-gray-300 rounded-sm overflow-hidden shadow-sm">
                                  <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                      <th className="p-3 text-left border-b font-semibold">
                                        Date
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Time
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Amount
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Approved By
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Method
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Remark
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {studentCourseData.paymentHistory.map(
                                      (payment) => (
                                        <tr
                                          key={payment._id}
                                          className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                          <td className="p-3 border-b min-w-[120px]">
                                            {payment.date}
                                          </td>
                                          <td className="p-3 border-b min-w-[120px]">
                                            {payment.time}
                                          </td>
                                          <td className="p-3 border-b font-medium min-w-[100px] text-gray-900">
                                            Rs. {payment.amount}
                                          </td>
                                          <td className="p-3 border-b min-w-[120px]">
                                            {school.staffs.find(
                                              (staf) =>
                                                staf._id === payment.approvedBy
                                            )?.name || "Unknown"}
                                          </td>
                                          <td className="p-3 border-b">
                                            {payment.method}
                                          </td>
                                          <td className="p-3 border-b text-gray-600 italic min-w-[120px]">
                                            {payment.remark}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {secondNavActive === "Discount" && (
                          <div className="bg-white p-2 md:p-4 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
                            {/* <!-- Payment Summary --> */}

                            {/* <!-- Bill Breakdown --> */}
                            <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-5">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Total Discount :
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    - {"Rs. "}
                                    {studentCourseData.discount.reduce(
                                      (acc, hist) => acc + hist.amount,
                                      0
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow-lg">
                              <h3 className="text-md text-gray-600 font-semibold mb-3">
                                Discount Breakdown
                              </h3>
                              <div className="overflow-auto">
                                <table className="w-full min-w-full border text-gray-600 border-gray-300 rounded-sm overflow-hidden shadow-sm">
                                  <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm ">
                                      <th className="p-3 text-left border-b font-semibold">
                                        Date
                                      </th>

                                      <th className="p-3 text-left border-b font-semibold">
                                        Amount
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Approved By
                                      </th>

                                      <th className="p-3 text-left border-b font-semibold">
                                        Remark
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {studentCourseData.discount.map(
                                      (discount) => (
                                        <tr
                                          key={discount._id}
                                          className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                          <td className="p-3 border-b">
                                            {discount.date}
                                          </td>

                                          <td className="p-3 border-b font-medium text-gray-900">
                                            Rs. {discount.amount}
                                          </td>
                                          <td className="p-3 border-b">
                                            {school.staffs.find(
                                              (staf) =>
                                                staf._id === discount.approvedBy
                                            )?.name || "Unknown"}
                                          </td>
                                          <td className="p-3 border-b text-gray-600 italic">
                                            {discount.remark}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                        {secondNavActive === "Fine" && (
                          <div className="bg-white p-2 md:p-4 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
                            {/* <!-- Payment Summary --> */}

                            {/* <!-- Bill Breakdown --> */}
                            <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-5">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Total Fine :
                                  </span>
                                  <span className="font-semibold text-red-600">
                                    {"Rs. "}
                                    {studentCourseData.fine.reduce(
                                      (acc, hist) => acc + hist.amount,
                                      0
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow-lg">
                              <h3 className="text-md text-gray-600 font-semibold mb-3">
                                Fine Breakdown
                              </h3>
                              <div className="overflow-auto">
                                <table className="w-full min-w-full border text-gray-600 border-gray-300 rounded-sm overflow-hidden shadow-sm">
                                  <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm ">
                                      <th className="p-3 text-left border-b font-semibold">
                                        Date
                                      </th>

                                      <th className="p-3 text-left border-b font-semibold">
                                        Amount
                                      </th>
                                      <th className="p-3 text-left border-b font-semibold">
                                        Approved By
                                      </th>

                                      <th className="p-3 text-left border-b font-semibold">
                                        Remark
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {studentCourseData.fine.map((discount) => (
                                      <tr
                                        key={discount._id}
                                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                      >
                                        <td className="p-3 border-b">
                                          {discount.date}
                                        </td>

                                        <td className="p-3 border-b font-medium text-gray-900">
                                          Rs. {discount.amount}
                                        </td>
                                        <td className="p-3 border-b">
                                          {school.staffs.find(
                                            (staf) =>
                                              staf._id === discount.approvedBy
                                          )?.name || "Unknown"}
                                        </td>
                                        <td className="p-3 border-b text-gray-600 italic">
                                          {discount.remark}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* <!-- discount Form --> */}
                        <div className=" rounded-lg shadow-sm bg-gray-50 p-6 mt-8">
                          <h3 className="text-lg font-bold mb-3">
                            {" "}
                            {secondNavActive === "Fees"
                              ? "Make a Payment"
                              : secondNavActive === "Discount"
                              ? "Add a Discount"
                              : secondNavActive === "Fine"
                              ? "Add a Fine"
                              : "Something Wrong"}{" "}
                          </h3>

                          <label className="block mb-2 font-medium">
                            Amount
                          </label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded-lg mb-3"
                            placeholder="Enter amount"
                            ref={amountRef}
                          />

                          <label className="block mb-2 font-medium">
                            Remarks
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg mb-3"
                            placeholder=""
                            ref={remarkRef}
                          />

                          <button
                            onClick={() => {
                              // handlePayFees();
                              setConfirmAlert(true);
                            }}
                            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Submit
                          </button>
                        </div>

                        {confirmAlert && (
                          <div className="reset fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[45%] min-w-[340px] relative">
                              <h2 className="text-lg font-semibold text-center mb-3">
                                {secondNavActive === "Fees"
                                  ? "Confirm Payment"
                                  : secondNavActive === "Discount"
                                  ? "Confirm Discount"
                                  : secondNavActive === "Fine"
                                  ? "Confirm Fine"
                                  : "Something Wrong"}
                              </h2>
                              <hr className="mb-3" />

                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon
                                      icon={faCalendarDays}
                                      className="text-blue-500"
                                    />
                                    <p className="ml-2 text-gray-700">Date</p>
                                  </div>
                                  <p className="text-gray-800">{date}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon
                                      icon={faCoins}
                                      className="text-blue-500"
                                    />
                                    <p className="ml-2 text-gray-700">Amount</p>
                                  </div>
                                  <p className="text-gray-800 w500">
                                    Rs. {amountRef.current?.value || "N/A"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center mt-4 border p-3 my-5 rounded-md">
                                <img
                                  src={
                                    student.photo1?.secure_url ||
                                    "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                                  }
                                  alt="Student"
                                  className="w-20 h-20 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                  <p className="font-semibold">
                                    {student.name}
                                  </p>
                                  <p className="text-sm text-gray-600 py-1">
                                    Class :{" "}
                                    {course.find(
                                      (obj) => obj._id === student.course.class
                                    )?.class || "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-600">
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
                                              obj3._id ===
                                              student.course.section
                                          ).name
                                      : "Select One"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-blue-500"
                                  />
                                  <p className="ml-2 text-gray-700">
                                    Initiated By
                                  </p>
                                </div>
                                <p className="text-gray-800">{user.name}</p>
                              </div>

                              <hr className="my-4" />

                              <div className="flex justify-between">
                                <button
                                  className="bg-gray-500 text-white px-4 py-2 rounded-lg w-1/2 mr-2"
                                  onClick={() => setConfirmAlert(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2 ml-2"
                                  onClick={() => {
                                    if (!amountRef.current.value) {
                                      alert("Please Enter Amount");
                                      setConfirmAlert(false);
                                      return;
                                    }

                                    {
                                      secondNavActive === "Fees"
                                        ? handlePayFees()
                                        : secondNavActive === "Discount"
                                        ? addDiscount()
                                        : secondNavActive === "Fine"
                                        ? addFine()
                                        : alert("Something Wrong");
                                    }
                                  }}
                                >
                                  Confirm
                                </button>
                              </div>

                              {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                                  <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* <!-- library --> */}

                    {currentPage === 4 && (
                      <div className="bg-white p-2 md:p-4 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
                        {/* Library Summary */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-blue-100 p-4 rounded-lg text-center">
                            <p className="text-gray-600 text-sm">Total Books</p>
                            <p className="text-xl font-bold text-blue-700">
                              {libraryDetails.length + returnedBooks.length}
                            </p>
                          </div>
                          <div className="bg-green-100 p-4 rounded-lg text-center">
                            <p className="text-gray-600 text-sm">
                              Books Returned
                            </p>
                            <p className="text-xl font-bold text-green-700">
                              {returnedBooks.length}
                            </p>
                          </div>
                          <div className="bg-red-100 p-4 rounded-lg text-center">
                            <p className="text-gray-600 text-sm">
                              Books Not Returned
                            </p>
                            <p className="text-xl font-bold text-red-700">
                              {libraryDetails.length}
                            </p>
                          </div>
                        </div>

                        {/* Library History Section */}
                        <div className="bg-white p-2 md:p-3 py-5 lg:p-5 rounded-lg shadow-lg">
                          {/* Books Taken Table */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">
                              Books Taken
                            </h4>
                            <div className="overflow-auto">
                              <table className="w-full border border-gray-300 rounded-lg">
                                <thead>
                                  <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-3 text-left border-b">
                                      Date
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Book
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Approved By
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Status
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Return Date
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {libraryDetails.map((book, index) => (
                                    <tr
                                      key={index}
                                      className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
                                    >
                                      <td className="p-3 border-b">
                                        {book.date}
                                      </td>
                                      <td className="p-3 border-b">
                                        {book.book}
                                      </td>
                                      <td className="p-3 border-b">
                                        {book.approvedBy}
                                      </td>
                                      <td
                                        className={`p-3 border-b font-semibold ${
                                          book.returnedDate
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {book.returnedDate
                                          ? "Returned"
                                          : "Not Returned"}
                                      </td>

                                      <td className="p-3 border-b">
                                        {book.returnDate}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Books Returned Table */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">
                              Books Returned
                            </h4>
                            <div className="overflow-auto">
                              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                                <thead>
                                  <tr className="bg-gray-200 text-gray-700">
                                    <th className="p-3 text-left border-b">
                                      Date
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Book
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Approved By
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Status
                                    </th>
                                    <th className="p-3 text-left border-b">
                                      Returned Date
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {returnedBooks.map((book, index) => (
                                    <tr
                                      key={index}
                                      className="odd:bg-white even:bg-gray-100 hover:bg-gray-50"
                                    >
                                      <td className="p-3 border-b">
                                        {book.date}
                                      </td>
                                      <td className="p-3 border-b">
                                        {book.book}
                                      </td>
                                      <td className="p-3 border-b">
                                        {book.approvedBy}
                                      </td>
                                      <td className="p-3 border-b text-green-600 font-semibold">
                                        Returned
                                      </td>
                                      <td className="p-3 border-b">
                                        {book.returnedDate}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Issue Book Form */}
                        {
                          <div className="rounded-lg shadow-sm bg-gray-50 p-3 py-5 md:p-6 mt-8">
                            <h3 className="text-lg font-bold mb-3">
                              Issue a Book
                            </h3>

                            <label className="block mb-2 font-medium">
                              Book Title
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-lg mb-3"
                              placeholder="Enter book title"
                              ref={bookTitleRef}
                            />

                            <div className="my-4">
                              <label className="block mb-2 font-medium">
                                Return Date
                              </label>
                              <DatePicker
                                data={dateToReturn}
                                setData={(a) => {
                                  setDateToReturn(a);
                                }}
                              />
                            </div>

                            <button
                              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition text-sm"
                              onClick={() => handleAddBook()}
                            >
                              Issue Book
                            </button>
                          </div>
                        }

                        {/* Return Book Section */}
                        <div className="p-3 py-5 lg:p-5 rounded-lg shadow-lg bg-gray-50 mt-8">
                          <h3 className="text-lg font-bold mb-4">
                            Return a Book
                          </h3>

                          <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-600">
                              Select Book to Return
                            </label>
                            {/* <select
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                              onChange={(e) => {
                                if (!e.target.value) {
                                  return;
                                }

                                setSelectedBooksTaken([
                                  ...selectedBooksTaken,
                                  e.target.value,
                                ]);
                              }}
                            >
                              <option value="" selected>
                                Select a book
                              </option>

                              {libraryDetails
                                .filter(
                                  (book) =>
                                    !selectedBooksTaken.find(
                                      (bk) => book._id === bk
                                    )
                                )
                                .map((book, index) => (
                                  <option key={index} value={book._id}>
                                    {book.book}
                                  </option>
                                ))}


                            </select> */}

                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                              onChange={(e) => {
                                if (!e.target.value) {
                                  return;
                                }

                                setSelectedBooksTaken([
                                  ...selectedBooksTaken,
                                  e.target.value,
                                ]);

                                // Reset the select element to default value
                                e.target.value = "";
                              }}
                              value="" // Add this to control the component
                            >
                              <option value="" selected>
                                Select a book
                              </option>
                              {libraryDetails
                                .filter(
                                  (book) =>
                                    !selectedBooksTaken.find(
                                      (bk) => book._id === bk
                                    )
                                )
                                .map((book, index) => (
                                  <option key={index} value={book._id}>
                                    {book.book}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="mb-5">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                              Books Selected for Return
                            </h4>
                            <ul className="list-disc pl-5 space-y-3 text-gray-700 bg-gray-100 p-4 rounded-lg">
                              {selectedBooksTaken.map((bookId) => (
                                <li
                                  key={bookId}
                                  className="flex justify-between items-center"
                                >
                                  {
                                    libraryDetails.find(
                                      (ind) => ind._id === bookId
                                    ).book
                                  }
                                  <button
                                    className="text-red-600 hover:text-red-800 focus:outline-none"
                                    onClick={() => {
                                      const newSelected =
                                        selectedBooksTaken.filter(
                                          (i) => i !== bookId
                                        );
                                      setSelectedBooksTaken(newSelected);
                                    }}
                                  >
                                    <i className="fas fa-times"></i> Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            className={`w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none transition duration-200 text-sm ${
                              selectedBooksTaken.length < 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => returnBooks()}
                            disabled={selectedBooksTaken.length < 1}
                          >
                            Return Book(s)
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </main>
              </div>
            </div>
          )}

          <div className="applyBootstrap touching-above fixed top-0 left-0 h-[100%]">
            {busStatus && (
              <BusStatus
                StudentCourseInfo={StudentCourseInfo}
                data={studentCourseData}
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

            {editStudent && student && (
              <EditStudentProfile
                data={student}
                _id={student._id}
                closeFunction={() => setEditStudent(false)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDetails;
