import React, { useEffect, useRef, useState } from "react";
import "./createCourses.scss";
import {
  POST_CREATE_COURSE,
  ERROR_REMOVE,
  POST_CREATE_COURSE_SUCCESS,
  POST_CREATE_COURSE_FAIL,
} from "../../redux/CreateCourse";
import Dropdown from "../basicComponents/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import TableEdit from "../layout/TableEdit";
import SelectTeacherTable from "./SelectTeacherTable";
import Loading from "../layout/loading";
import { useDispatch, useSelector } from "react-redux";
import Error from "../layout/error";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";

const CreateCourses = ({ data, id, closeFunction = () => {} }) => {
  const [courseInfo, setCourseInfo] = useState(
    data
      ? data
      : {
          class: "",
          seatsAvailable: 999,
          subjects: [],
          groups: [],
          fees: [],
        }
  );

  const error = useSelector((state) => state.CreateCourse.error.payload);
  const loading = useSelector((state) => state.CreateCourse.loading);

  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;

  const dispatch = useDispatch();

  const [progress, setProgress] = useState(1);
  const [sectionOption, setSectionOption] = useState([]);
  const [currentSection, setCurrentSection] = useState(sectionOption[0]);

  useEffect(() => {
    setCurrentSection(sectionOption[0]);
  }, [sectionOption]);

  const subjectsRef = useRef(null);
  const AddSubjectEnterRef = useRef(null);
  const groupRef = useRef(null);
  const feeTitleRef = useRef(null);

  async function handleSelect(index) {
    setCurrentSection(sectionOption[index]);
  }

  function staffUpdate(subject, teacher, cSection) {
    subject.teacher = {
      name: teacher.name,
      _id: teacher._id,
      title: teacher.title,
    };

    let tempCourseInfo = courseInfo;

    tempCourseInfo.groups.map((grp) => {
      grp.sections.map((sec) => {
        if (sec.name === cSection.value) {
          sec = subject;
          return;
        }
      });
    });

    setCourseInfo(tempCourseInfo);
    console.log(courseInfo);
  }

  useEffect(() => {
    setSectionOption(() => [
      ...courseInfo.groups.flatMap((obj) =>
        obj.sections.map((sec) => {
          return {
            value: sec.name,
            label: sec.name,
            extra: sec,
          };
        })
      ),
    ]);
  }, [courseInfo]);

  async function handleSubmit() {
    if (id) {
      dispatch(POST_CREATE_COURSE());
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/courses/${id}`,
          courseInfo,
          {
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
            alert("error");
            dispatch(POST_CREATE_COURSE_FAIL(response.data.data));
          }
        });
    } else {
      dispatch(POST_CREATE_COURSE());

      console.log(courseInfo);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/courses/create`,
          courseInfo,
          {
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
  }

  return (
    <div className="Courses2032836 flex1">
      {loading && <Loading />}

      {error && (
        <Error
          status={error.status}
          message={error.message}
          errorRemove={() => dispatch(ERROR_REMOVE())}
        />
      )}

      {!loading && !error && (
        <div className="courseInside730">
          <p className="h5 text-center w600">Add new class</p>

          {/* progress indicator bar  */}
          <div className="cProgress flex1">
            <div
              className={`individual flex1 ${progress === 1 ? "active" : ""}`}
              onClick={() => setProgress(1)}
            >
              <div className="circle flex1"> 1 </div>
              <p className="h6"> Basic Info</p>
              <p className="h6" style={{ color: "#434954" }}>
                {" "}
                {">"}{" "}
              </p>
            </div>

            {/* <div
              className={`individual flex1 ${progress === 2 ? "active" : ""}`}
              onClick={() => setProgress(2)}
            >
              <div className="circle flex1"> 2 </div>
              <p className="h6"> Staff's Info</p>
              <p className="h6" style={{ color: "#434954" }}>
                {" "}
                {">"}{" "}
              </p>
            </div> */}

            <div
              className={`individual flex1 ${progress === 3 ? "active" : ""}`}
              onClick={() => setProgress(3)}
            >
              <div className="circle flex1"> 2 </div>
              <p className="h6"> Fees Info </p>
            </div>
          </div>
          <hr />

          {/* Actual thing i want to do  */}
          <div className="actual-container-very-form custom-scrollbar">
            {progress === 1 && (
              <div className="form-content6">
                <div className="each width2">
                  <p> Class Name </p>
                  <input
                    type="text"
                    name=""
                    value={courseInfo.class}
                    placeholder="12 Science"
                    onChange={(event) =>
                      setCourseInfo({
                        ...courseInfo,
                        class: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="each width2">
                  <p> Total Seats </p>
                  <input
                    type="number"
                    name=""
                    value={courseInfo.seatsAvailable}
                    placeholder="999"
                    onChange={(event) =>
                      setCourseInfo({
                        ...courseInfo,
                        seatsAvailable: event.target.value,
                      })
                    }
                  />
                </div>

                {/* here is our subjects  */}

                <div className="each width4">
                  <p>Subjects :</p>

                  <div className="title">
                    <div className="contents">
                      {!courseInfo.subjects.length > 0 && (
                        <p className="h6 w500 text-secondary py-2">
                          No Subjects Added
                        </p>
                      )}

                      {courseInfo.subjects.map((subject, index) => (
                        <div className="each" key={index}>
                          <p className="w300">{subject}</p>
                          <div
                            className="closes32 flex1"
                            onClick={() => {
                              const updatedSubjects = [...courseInfo.subjects];
                              updatedSubjects.splice(index, 1);
                              setCourseInfo({
                                ...courseInfo,
                                subjects: updatedSubjects,
                              });
                            }}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grouping">
                    <input
                      className="inputAdv"
                      type="text"
                      placeholder="Add a Subject"
                      ref={subjectsRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (
                            AddSubjectEnterRef &&
                            AddSubjectEnterRef.current
                          ) {
                            // Click on the div using its current property
                            AddSubjectEnterRef.current.click();
                          }
                        }
                      }}
                    />

                    <div
                      className="enterBtn flex1"
                      ref={AddSubjectEnterRef}
                      onClick={() => {
                        console.log(courseInfo);

                        const subjectEntered = subjectsRef.current.value;
                        const newSubjectObject = {
                          subject: subjectEntered,
                          teacher: {
                            _id: undefined,
                            title: undefined,
                            name: undefined,
                          },
                        };
                        setCourseInfo((prevCourseInfo) => ({
                          ...prevCourseInfo,
                          subjects: [
                            ...prevCourseInfo.subjects,
                            subjectEntered,
                          ], // Add subject to course level
                          groups: prevCourseInfo.groups.map((group) => ({
                            ...group,
                            subjects: [
                              ...(group.subjects || []),
                              subjectEntered,
                            ], // Add subject to group level
                            sections: group.sections.map((section) => ({
                              ...section,
                              subjects: section.name
                                ? [
                                    ...(section.subjects || []),
                                    newSubjectObject,
                                  ]
                                : section.subjects, // Add subject to section level only if it's a valid section
                            })),
                          })),
                        }));
                        subjectsRef.current.value = "";
                        subjectsRef.current.focus();
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ marginBottom: "0px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* this one is for groups */}

                <div className="each width4">
                  <p>Groups :</p>

                  <div className="title">
                    <div className="contents">
                      {(!courseInfo.groups ||
                        !courseInfo.groups.length > 0) && (
                        <p className="h6 w500 text-secondary py-2">
                          No Group Added
                        </p>
                      )}

                      {courseInfo.groups.map((group, groupIndex) => (
                        <div className="each special" key={groupIndex}>
                          <div className="mHead">
                            <p className="w300">{group.name}</p>
                            <div
                              className="closes32 flex1"
                              onClick={() => {
                                const updatedGroups = [...courseInfo.groups];
                                updatedGroups.splice(groupIndex, 1);
                                setCourseInfo({
                                  ...courseInfo,
                                  groups: updatedGroups,
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </div>
                          </div>

                          <div className="second-cont">
                            <div>
                              <p>Subjects :</p>
                              <div className="title">
                                <div
                                  className="contents"
                                  style={{ background: "none", padding: "0" }}
                                >
                                  {(!group.subjects ||
                                    !group.subjects.length > 0) && (
                                    <p className="h6 w500 text-secondary py-2">
                                      No Subjects Added
                                    </p>
                                  )}
                                  {group.subjects.map(
                                    (subject, subjectIndex) => (
                                      <div className="each" key={subjectIndex}>
                                        <p className="w300">{subject}</p>
                                        <div
                                          className="closes32 flex1"
                                          onClick={() => {
                                            const updatedGroups = [
                                              ...courseInfo.groups,
                                            ];
                                            // Remove the subject from the specified group's subjects array
                                            updatedGroups[
                                              groupIndex
                                            ].subjects.splice(subjectIndex, 1);
                                            // Remove the subject from all sections of the specified group
                                            updatedGroups[
                                              groupIndex
                                            ].sections.forEach((section) => {
                                              section.subjects.splice(
                                                subjectIndex,
                                                1
                                              );
                                            });
                                            // Update the state with the modified groups
                                            setCourseInfo({
                                              ...courseInfo,
                                              groups: updatedGroups,
                                            });
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <p>Sections :</p>
                              <div className="title">
                                <div
                                  className="contents"
                                  style={{ background: "none", padding: "0" }}
                                >
                                  {!group.sections.length > 0 && (
                                    <p className="h6 w500 text-secondary py-2">
                                      No Sections Added
                                    </p>
                                  )}
                                  {group.sections.map(
                                    (section, sectionIndex) => (
                                      <div className="each" key={sectionIndex}>
                                        <p className="w300">{section.name}</p>
                                        <div
                                          className="closes32 flex1"
                                          onClick={() => {
                                            const updatedGroups = [
                                              ...courseInfo.groups,
                                            ];
                                            updatedGroups[
                                              groupIndex
                                            ].sections.splice(sectionIndex, 1);
                                            setCourseInfo({
                                              ...courseInfo,
                                              groups: updatedGroups,
                                            });
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grouping">
                              <input
                                className="inputAdv "
                                type="text"
                                placeholder="Add a new section"
                                id={`sectionid235273${groupIndex}`}
                                style={{ backgroundColor: "#CCCBCB" }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent default Enter key behavior (e.g., form submission).

                                    // Get the value from the input field
                                    const tempValue = document
                                      .getElementById(
                                        `sectionid235273${groupIndex}`
                                      )
                                      .value.trim();

                                    if (!tempValue) {
                                      alert("Section name cannot be empty");
                                      return;
                                    }

                                    // Check if the section name already exists within any group
                                    const isDuplicateInSection =
                                      courseInfo.groups.some((grp) =>
                                        grp.sections.some(
                                          (sec) =>
                                            sec.name.toLowerCase() ===
                                            tempValue.toLowerCase()
                                        )
                                      );

                                    if (isDuplicateInSection) {
                                      alert(
                                        "A section with the same name already exists for this class"
                                      );
                                      return;
                                    }

                                    // Add the new section to the group
                                    const updatedGroups = [
                                      ...courseInfo.groups,
                                    ];
                                    updatedGroups[groupIndex].sections.push({
                                      name: tempValue,
                                      subjects: updatedGroups[
                                        groupIndex
                                      ].subjects.map((subj) => ({
                                        subject: subj,
                                        teacher: {
                                          name: undefined,
                                          _id: undefined,
                                          title: undefined,
                                        },
                                      })),
                                    });

                                    // Update the state with the new section added
                                    setCourseInfo((prev) => ({
                                      ...prev,
                                      groups: updatedGroups,
                                    }));

                                    // Clear the input field and refocus
                                    const inputField = document.getElementById(
                                      `sectionid235273${groupIndex}`
                                    );
                                    inputField.value = "";
                                    inputField.focus();
                                  }
                                }}
                              />

                              <div
                                className="enterBtn flex1"
                                onClick={() => {
                                  const tempValue = document
                                    .getElementById(
                                      `sectionid235273${groupIndex}`
                                    )
                                    .value.trim();
                                  if (tempValue === "") {
                                    alert("Section name cannot be empty");
                                    return;
                                  }

                                  // Check if the section name already exists within any group for the same class
                                  const isDuplicateInSection =
                                    courseInfo.groups.some((grp) =>
                                      grp.sections.some(
                                        (sec) =>
                                          sec.name.toLowerCase() ===
                                          tempValue.toLowerCase()
                                      )
                                    );

                                  if (isDuplicateInSection) {
                                    alert(
                                      "A section with the same name already exists for this class"
                                    );
                                    return;
                                  }

                                  // Add the new section to the group
                                  const updatedGroups = [...courseInfo.groups];
                                  updatedGroups[groupIndex].sections.push({
                                    name: tempValue,
                                    subjects: updatedGroups[
                                      groupIndex
                                    ].subjects.map((subj) => ({
                                      subject: subj,
                                      teacher: {
                                        name: undefined,
                                        _id: undefined,
                                        title: undefined,
                                      },
                                    })),
                                  });

                                  // Update the state with the new section added
                                  setCourseInfo({
                                    ...courseInfo,
                                    groups: updatedGroups,
                                  });

                                  // Clear the input field
                                  document.getElementById(
                                    `sectionid235273${groupIndex}`
                                  ).value = "";
                                  document
                                    .getElementById(
                                      `sectionid235273${groupIndex}`
                                    )
                                    .focus();
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  style={{ marginBottom: "0px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nothing here  */}

                  <div className="grouping">
                    <input
                      className="inputAdv"
                      type="text"
                      placeholder="Add a Group"
                      ref={groupRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent form submission or default Enter behavior.

                          const tempValue = groupRef.current.value.trim();

                          if (!tempValue) {
                            alert("Group name cannot be empty");
                            return;
                          }

                          // Check for duplicate group names (case-insensitive).
                          const otherExist = courseInfo.groups.some(
                            (grp) =>
                              grp.name.toLowerCase() === tempValue.toLowerCase()
                          );

                          if (otherExist) {
                            alert("Two groups cannot share the same name");
                            return;
                          }

                          // Update courseInfo state with the new group.
                          setCourseInfo((prevCourseInfo) => ({
                            ...prevCourseInfo,
                            groups: [
                              ...prevCourseInfo.groups,
                              {
                                name: tempValue,
                                sections: [],
                                subjects: [...prevCourseInfo.subjects],
                              },
                            ],
                          }));

                          // Clear the input field.
                          groupRef.current.value = "";
                        }
                      }}
                    />

                    <div
                      className="enterBtn flex1"
                      onClick={() => {
                        const tempValue = groupRef.current.value;

                        let otherExist = courseInfo.groups.map((grp343) => {
                          if (
                            grp343.name.toLowerCase() ===
                            tempValue.toLowerCase()
                          ) {
                            return true;
                          }
                        });

                        if (otherExist.includes(true)) {
                          alert("Two groups cannot share the common name");

                          return;
                        }

                        setCourseInfo((prevCourseInfo) => ({
                          ...prevCourseInfo,
                          groups: [
                            ...prevCourseInfo.groups,
                            {
                              name: tempValue,
                              sections: [],
                              subjects: [...prevCourseInfo.subjects],
                            },
                          ],
                        }));
                        groupRef.current.value = "";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ marginBottom: "0px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {progress === 2 && (
              <div className="form-content6">
                <div className="each width4">
                  <p> Section </p>
                  <div className="wobbler" style={{ padding: "0px 3px" }}>
                    <Dropdown
                      options={sectionOption}
                      title={`${
                        currentSection ? currentSection.label : "Select One"
                      }`}
                      onSelect={handleSelect}
                    />
                  </div>
                </div>

                <div className="table-my each width4 shadow1">
                  <SelectTeacherTable
                    fields={["Subject", "Teacher"]}
                    currentSection={currentSection}
                    staffUpdate={staffUpdate}
                  />
                </div>
              </div>
            )}

            {progress === 3 && (
              <div className="form-content6">
                <p
                  className="h7 text-center text-danger px-2"
                  style={{ width: "100%" }}
                >
                  {" "}
                  * Make sure to specify all amounts in a yearly basis{" "}
                </p>

                <div className="table-my each width4 shadow1">
                  <TableEdit
                    data={courseInfo.fees}
                    fields={["Fee Title", "Amount Rs.", "", ""]}
                    setDataFromChild={(a) => {
                      setCourseInfo({ ...courseInfo, fees: a });
                    }}
                  />
                </div>
                <div className="each width4">
                  <hr />

                  <div className="grouping">
                    <input
                      className="inputAdv"
                      type="text"
                      placeholder="Add New Fee Title"
                      ref={feeTitleRef}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("feeBtnClick163138").click();
                        }
                      }}
                    />

                    <div
                      className="enterBtn flex1"
                      id="feeBtnClick163138"
                      onClick={() => {
                        const tempValue = feeTitleRef.current.value;
                        setCourseInfo((prevCourseInfo) => {
                          const newFees = prevCourseInfo.fees
                            ? [...prevCourseInfo.fees]
                            : [];
                          return {
                            ...prevCourseInfo,
                            fees: [
                              ...newFees,
                              {
                                title: tempValue,
                                amount: 0,
                              },
                            ],
                          };
                        });
                        feeTitleRef.current.value = "";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ marginBottom: "0px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="buttons flex3">
            {progress === 1 && (
              <button onClick={() => closeFunction()}>Close</button>
            )}

            {progress !== 1 && (
              <button
                onClick={() => {
                  if (progress > 1) {
                    setProgress(progress - 1);
                  }
                }}
              >
                {" "}
                Previous{" "}
              </button>
            )}

            {progress !== 3 && (
              <button
                onClick={() => {
                  if (progress < 3) {
                    setProgress(progress + 1);
                  }
                }}
                style={{ backgroundColor: "#00BDD6" }}
              >
                {" "}
                Next{" "}
              </button>
            )}

            {progress === 3 && (
              <button
                style={{ backgroundColor: "#00BDD6" }}
                onClick={() => handleSubmit()}
              >
                {" "}
                Submit{" "}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourses;
