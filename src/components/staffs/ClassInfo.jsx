import React, { useState, useEffect } from "react";
import "./classInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBraille,
  faChalkboard,
  faUserGroup,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../basicComponents/Dropdown";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { EDIT_STUDENT_COURSE } from "../../redux/StudentsSlice";

const ClassInfo = ({ course, data, _id, closeFunction = () => {} }) => {
  const [courseData, setCourseData] = useState(data);
  const [groupOptions, setGroupOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const school = useSelector((state) => state.Home.school.payload);

  const dispatch = useDispatch();

  useEffect(() => {
    setCourseData(data);
  }, [data]);

  useEffect(() => {
    // Update groupOptions whenever class changes
    if (courseData.class) {
      const groups =
        course.find((c) => c._id === courseData.class)?.groups || [];
      setGroupOptions(
        groups.map((grp) => ({
          label: grp.name,
          value: grp._id,
        }))
      );
    }
  }, [courseData.class, course]);

  useEffect(() => {
    // Update sectionOptions whenever group changes

    if (!courseData.group) {
      setSectionOptions([]);
    }

    if (courseData.group) {
      const sections =
        course
          .find((c) => c._id === courseData.class)
          ?.groups.find((g) => g._id === courseData.group)?.sections || [];
      setSectionOptions(
        sections.map((sec) => ({
          label: sec.name,
          value: sec._id,
        }))
      );
    }
  }, [courseData.group, course]);

  const onClassSelect = (a, b, c) => {
    if (c === data.class) {
      setCourseData(data);
      return;
    }

    setCourseData((prevState) => ({
      ...prevState,
      class: c,
      section: "",
      group: "",
    }));
  };

  const onSectionSelect = (a, b, c) => {
    setCourseData((prevState) => ({
      ...prevState,
      section: c,
    }));
  };

  const onGroupSelect = (a, b, c) => {
    setCourseData((prevState) => ({
      ...prevState,
      group: c,
      section: "", // Reset section when group changes
    }));
  };

  // function handleSelect() {
  //   if (courseData.class && courseData.section && courseData.group) {
  //     console.log(courseData);
  //   } else {
  //     dispatch(
  //       SET_ALERT_GLOBAL({
  //         status: "All fields are required",
  //         message: "Make sure Class, Group and Section are all selected",
  //       })
  //     );
  //   }
  // }

  function changeCourse() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/adminStudent/${school.schoolCode}/student/${_id}/changeCourse`,
        {
          cCourse: {
            groupId: data.group,
            sectionId: data.section,
            classId: data.class,
          },
          nCourse: {
            groupId: courseData.group,
            sectionId: courseData.section,
            classId: courseData.class,
          },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          dispatch(
            EDIT_STUDENT_COURSE({
              _id: _id,
              course: {
                group: courseData.group,
                section: courseData.section,
                class: courseData.class,
              },
            })
          );
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

  return (
    <div className="busmdaidna122 custom-scrollbar flex1">
      <div className="vmainqqw">
        <div className="closeContainer">
          <div className="close flex1" onClick={closeFunction}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>

        <div className="insidermain2323">
          <p className="h5 w500 text-center"> Course Info </p>

          <div className="content">
            <div className="each flex4">
              <div className="left233z d-flex">
                <FontAwesomeIcon icon={faChalkboard} />
                <p className="h7 text-secondary ms-2"> Class </p>
              </div>
              <div className="right233z">
                <Dropdown
                  options={course.map((ind) => ({
                    label: ind.class,
                    value: ind._id,
                  }))}
                  onSelect={onClassSelect}
                  title={
                    course.find((obj) => obj._id === courseData?.class)
                      ?.class || " Select Class"
                  }
                />
              </div>
            </div>

            <div className="each flex4">
              <div className="left233z d-flex">
                <FontAwesomeIcon icon={faUserGroup} />
                <p className="h7 text-secondary ms-2"> Group </p>
              </div>
              <div className="right233z">
                <Dropdown
                  options={groupOptions}
                  title={
                    courseData.group
                      ? course
                          .find((obj) => obj._id === courseData.class)
                          ?.groups.find((obj) => obj._id === courseData.group)
                          ?.name || ""
                      : "Select Group"
                  }
                  onSelect={onGroupSelect}
                />
              </div>
            </div>

            <div className="each flex4">
              <div className="left233z d-flex">
                <FontAwesomeIcon icon={faBraille} />
                <p className="h7 text-secondary ms-2"> Section </p>
              </div>
              <div className="right233z">
                <Dropdown
                  options={sectionOptions}
                  title={
                    courseData.section
                      ? course
                          .find((obj) => obj._id === courseData.class)
                          ?.groups.find((obj) => obj._id === courseData.group)
                          ?.sections.find(
                            (obj) => obj._id === courseData.section
                          )?.name || ""
                      : "Select Section"
                  }
                  onSelect={onSectionSelect}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => changeCourse()}
            className="btn btn-primary mb-3"
            style={{ width: "100%", fontSize: "14px" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassInfo;
