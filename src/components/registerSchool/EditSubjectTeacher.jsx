import React, { useState } from "react";
import "./editSubjectTeacher.scss";
import {
  POST_CREATE_COURSE,
  ERROR_REMOVE,
  POST_CREATE_COURSE_SUCCESS,
  POST_CREATE_COURSE_FAIL,
} from "../../redux/CreateCourse";
import { useDispatch, useSelector } from "react-redux";
import Error from "../layout/error";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";
import Dropdown from "../basicComponents/Dropdown";

const EditSubjectTeacher = ({ data, id, closeFunction = () => {} }) => {
  const [currentSection, setCurrentSection] = useState(data);

  const error = useSelector((state) => state.CreateCourse.error.payload);
  const loading = useSelector((state) => state.CreateCourse.loading);

  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();

  async function handleSubmit() {
    alert("hii");
    return;
  }

  function sortByName(array) {
    return array.sort((a, b) => {
      const nameA = (a.label || "").toUpperCase();
      const nameB = (b.label || "").toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  const staffs12 = school.staffs.map((obj) => ({
    label: `${obj.name} (${obj.title})`,
    value: obj._id,
    _id: obj._id,
    name: obj.name,
    role: obj.role,
    title: obj.title,
    status: obj.status,
    qualification: obj.qualification,
  }));

  const [availableStaffs, setAvailableStaffs] = useState(sortByName(staffs12));

  const updateTeacher = (subjectId, newTeacher) => {
    setCurrentSection((prevState) => ({
      ...prevState,
      subjects: prevState.subjects.map((subject) =>
        subject._id === subjectId
          ? { ...subject, teacher: newTeacher }
          : subject
      ),
    }));
  };

  async function handleSubmit() {
    dispatch(POST_CREATE_COURSE());

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/section/updateSubjectTeachers`,
        currentSection.subjects,
        {
          params: {
            sectionId: currentSection.sectionId,
            section: currentSection._id,
          },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(POST_CREATE_COURSE_SUCCESS(response.data.data));
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(POST_CREATE_COURSE_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(POST_CREATE_COURSE_FAIL(error.response.data));
          return;
        }
        dispatch(POST_CREATE_COURSE_FAIL(data));
      });
  }

  return (
    <div className="Courses2032836a flex1">
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
          errorRemove={() => dispatch(ERROR_REMOVE())}
        />
      )}

      {!loading && !error && (
        <div className="courseInside730">
          <p className="h5 text-center w600p py-2"> Edit Subject Teachers </p>

          {/* Actual thing i want to do  */}
          <div className="actual-container-very-form custom-scrollbar">
            <div className="form-content6">
              <div className="table-my each width4 custom-scrollbar">
                <div
                  className="eachRow flex4"
                  style={{ backgroundColor: "#ECECEC", height: '55px' }}
                >
                  <div className="flex1 ">
                    <p className="h6 w700"> Subject </p>
                  </div>

                  <div className=" flex1 ">
                    <p className="h6 w700"> Teacher </p>
                  </div>
                </div>

                {currentSection.subjects.map((sub) => {
                  return (
                    <>
                      <div className="eachRow flex4" key={sub._id}>
                        <div className=" flex1 ">
                          <p className="h6 w600"> {sub.subject} </p>
                        </div>

                        <div className=" flex1 ">
                          <Dropdown
                            options={availableStaffs}
                            key11={sub._id}
                            title={
                              sub.teacher
                                ? `${sub.teacher.name} (${sub.teacher.title})`
                                : "Select Teacher"
                            }
                            onSelect={(a, b, c) => {
                              updateTeacher(
                                b,
                                staffs12.find((tea) => tea._id == c)
                              );
                            }}
                          />
                        </div>
                      </div>
                      <hr className="m-0" />
                    </>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="buttons flex3">
            <button onClick={() => closeFunction()}>Close</button>

            <button
              style={{ backgroundColor: "#00BDD6" }}
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubjectTeacher;
