import React, { useEffect, useState } from "react";
import CreateCourses from "../../registerSchool/CreateCourses";
import DataTable from "../../layout/Table";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../../basicComponents/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import SessionTree from "../../registerSchool/SessionTree";
import AllClasses from "./AllClasses";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import EditSubjectTeacher from "../../registerSchool/EditSubjectTeacher";
import {
  Check,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  Plus,
  Play,
  Table,
  GraduationCap,
} from "lucide-react";

const Classes = () => {
  const courses = useSelector((state) => state.Course.course.payload.course);
  const [newClass, setNewClass] = useState(false);
  const [sessionTree, setSessionTree] = useState(false);
  const students = useSelector((state) => state.Students.students.payload);
  const dispatch = useDispatch();

  async function handleDropdownChange(a) {
    setCurrentSection(allSections[a]);
  }

  const [currentClass, setCurrentClass] = useState(
    courses.length > 0 ? courses[0] : null
  );

  function getAllSectionIds() {
    if (currentClass === null) {
      return [];
    }

    let sectionIds = [];

    currentClass.groups.forEach((group) => {
      group.sections.forEach((section) => {
        sectionIds.push(section);
      });
    });

    return sectionIds;
  }

  const [allSections, setAllSections] = useState(
    getAllSectionIds(
      courses.find((crc) => {
        return crc._id === currentClass;
      })
    )
  );

  const [currentSection, setCurrentSection] = useState(allSections[0]);

  useEffect(() => {
    setAllSections(getAllSectionIds());
  }, [currentClass]);

  useEffect(() => {
    setCurrentSection(allSections[0]);
  }, [allSections]);

  const school = useSelector((state) => state.Home.school.payload);

  const [allClasses, setAllClasses] = useState(false);
  const [loading, setLoading] = useState(false);

  function startNewSession(a) {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/sessions/new`,
        {
          params: {
            classesList: JSON.stringify(a),
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
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

  const [editSubjectTeachers, setEditSubjectTeachers] = useState(false);

  if (newClass || sessionTree || allClasses || editSubjectTeachers || loading) {
    document.body.classList.add("dshauda-hidden321");
  } else if (
    !newClass &&
    !sessionTree &&
    !allClasses &&
    !editSubjectTeachers &&
    !loading
  ) {
    document.body.classList.remove("dshauda-hidden321");
  }

  // Add this useEffect to update currentClass when courses changes
  useEffect(() => {
    if (courses.length > 0) {
      // Find the current course ID in the updated courses array
      if (currentClass) {
        const updatedCourse = courses.find(
          (course) => course._id === currentClass._id
        );
        if (updatedCourse) {
          setCurrentClass(updatedCourse);
        } else {
          // If current course no longer exists, default to first course
          setCurrentClass(courses[0]);
        }
      } else {
        setCurrentClass(courses[0]);
      }
    }
  }, [courses]);

  // Update allSections useEffect to properly depend on currentClass
  useEffect(() => {
    if (currentClass) {
      const sectionIds = getAllSectionIds();
      setAllSections(sectionIds);
    }
  }, [currentClass]);

  return (
    <div className="min-h-screen ">
      {/* Loading Overlay - Original Logic Preserved */}
      {loading && (
        <div
          className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "99999",
          }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Original Modal Components - Logic Preserved */}
      {newClass && (
        <CreateCourses closeFunction={() => setNewClass(!newClass)} />
      )}
      {sessionTree && (
        <SessionTree closeFunction={() => setSessionTree(false)} />
      )}
      {allClasses && (
        <AllClasses
          title={allClasses.title}
          btnText={allClasses.btnText}
          handleGetSelectedOnes={allClasses.handleGetSelectedOnes}
          closeFunction={() => setAllClasses(false)}
          courseData={school.course}
        />
      )}
      {editSubjectTeachers && (
        <EditSubjectTeacher
          data={currentSection}
          closeFunction={() => setEditSubjectTeachers(false)}
        />
      )}

      {/* Main Content */}
      <div className=" mx-auto lg:px-4">
        {/* Header Section */}
        <div className="hidden lg:block mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Action Buttons - Original Logic Preserved */}
            <div className="hidden lg:flex flex-wrap gap-3">
              <button
                disabled={school.course.length === 0}
                onClick={() => setSessionTree(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  school.course.length === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md"
                }`}
              >
                <Table className="w-4 h-4" />
                Session Table
              </button>

              <button
                disabled={school.course.length === 0}
                onClick={() =>
                  setAllClasses({
                    title: "Start New Session",
                    btnText: "Start New Session",
                    handleGetSelectedOnes: startNewSession,
                  })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  school.course.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                    : "bg-green-500 text-white hover:bg-green-600 shadow-sm hover:shadow-md"
                }`}
              >
                <Play className="w-4 h-4" />
                Start New Session
              </button>

              <button
                onClick={() => setNewClass(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add New Class
              </button>
            </div>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                Select Class
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {courses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => setCurrentClass(course)}
                    className={`group relative p-4 rounded-lg border-2 transition-all duration-200 hover:transform hover:scale-105 ${
                      currentClass && currentClass._id === course._id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          currentClass && currentClass._id === course._id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        }`}
                      >
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <p
                        className={`font-medium ${
                          currentClass && currentClass._id === course._id
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {course.class}
                      </p>
                    </div>
                    {currentClass && currentClass._id === course._id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Classes Available
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first class
              </p>
              <button
                onClick={() => setNewClass(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create First Class
              </button>
            </div>
          </div>
        )}

        {/* Class Details - Original Logic Preserved */}
        {currentClass && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Class Overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Class Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentClass.class}
                    </h3>
                    <p className="text-sm text-gray-500">Class Information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Annual Fee
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      Rs.{" "}
                      {currentClass.fees.reduce(
                        (sum, fee) => sum + fee.amount,
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Total Seats
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {currentClass.seatsAvailable}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Occupied
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {
                        students.filter(
                          (student) =>
                            student.course.class === currentClass._id &&
                            student.course.section === currentSection._id
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Fee Structure - Original Logic Preserved */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Fee Structure
                </h3>
                <div className="max-w-[94vw] overflow-auto">
                  <DataTable
                    data={currentClass.fees.map((fee) => {
                      return {
                        title: fee.title,
                        amount: fee.amount,
                      };
                    })}
                    fields={["Title", "Amount Rs."]}
                  />
                </div>
              </div>

              {/* Students List - Original Logic Preserved */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Students
                </h3>

                {students && currentSection && (
                  <div className="max-w-[94vw] overflow-auto">
                    <DataTable
                      data={students
                        .filter(
                          (student) =>
                            student.course.class === currentClass._id &&
                            student.course.section === currentSection._id
                        )
                        .map((student, index) => ({
                          sn: index + 1,
                          name: student.name,
                        }))}
                      fields={["SN", "Student Name"]}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon
                    style={{ marginRight: "5px", color: "#107A34" }}
                    icon={faCircleCheck}
                  />
                  General Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-medium">
                        {currentClass.class}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section
                    </label>
                    <div className="p-0">
                      <select
                        id="section-select"
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentSection?._id || ""}
                        onChange={(e) => handleDropdownChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Section
                        </option>
                        {allSections.map((sec) => (
                          <option key={sec._id} value={sec._id}>
                            {sec.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Seats
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-medium">
                        {currentClass.seatsAvailable}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupied
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-medium">
                        Specify Later
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects & Teachers - Original Logic Preserved */}
              {currentSection && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      Subjects
                    </h4>
                    <button
                      onClick={() => setEditSubjectTeachers(true)}
                      className="hidden ml-auto lg:flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Subject Teachers
                    </button>
                  </div>

                  <div className="max-w-[94vw] overflow-auto">
                    <DataTable
                      data={currentSection.subjects.map((sub) => {
                        return {
                          subject: sub.subject,
                          teacher: sub.teacher ? sub.teacher.name : "N/A",
                        };
                      })}
                      fields={["Subject", "Teacher"]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
