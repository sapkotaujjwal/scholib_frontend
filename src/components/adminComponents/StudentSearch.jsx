import React, { useEffect, useRef, useState } from "react";
import "./studentSearch.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import StudentSearchTable from "./StudentSearchTable";

const StudentSearch = ({ setStudent, students = [], storedStudents }) => {
  const course1 = useSelector((state) => state.Course.courseAll.payload.course);
  // const course = useSelector((state) => state.Course.course.payload.course);
  const course = useSelector((state) => state.Course.courseAll.payload.course);

  const [resultData, setResultData] = useState([]);

  const [query, setQuery] = useState("");

  function findObjectsNear(query, courses) {
    // Create a mapping of course IDs to course objects
    const courseMap = new Map(courses.map((course) => [course._id, course]));

    return students

      .filter(
        (student) =>
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.loginId.toString().includes(query.toLowerCase())
      )

      .map((student) => {
        const course = courseMap.get(student.course.class);

        const group = course.groups.find((g) => g._id === student.course.group);
        const section = group.sections.find(
          (s) => s._id === student.course.section
        );

        return {
          name: student.name,
          _id: student._id,
          class: course.class,
          section: section.name,
          loginId: student.loginId,
        };
      })
      .sort((a, b) => {
        const aIndex = a.name.toLowerCase().indexOf(query.toLowerCase());
        const bIndex = b.name.toLowerCase().indexOf(query.toLowerCase());
        return aIndex - bIndex;
      })
      .slice(0, 15);
  }

  useEffect(() => {
    if (query === "") {
      setResultData([]);
    }

    if (query) {
      setResultData(findObjectsNear(query, course1));
    }
  }, [query]);

  const inputRef = useRef(null);

  useEffect(() => {
    setQuery("");
    setResultData([]);
  }, [setStudent]);

  // localStorage.setItem("selectedStudents", JSON.stringify(dummyArray));

  return (
    <div className="studentSearch23739">
      <div className="container">
        <div className="top flex1">
          <p className="h6 w600 search_text" style={{ marginRight: "20px" }}>
            Search :
          </p>

          <div className="search">
            <input
              ref={inputRef}
              type="text"
              name=""
              className="f2"
              id=""
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search for student"
            />

            <div className="icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
          </div>
        </div>

        {/* storedStudents */}

        {resultData.length === 0 && (
          <div className="bottom">
            <div className="resultTable custom-scrollbar">
              <StudentSearchTable
                setStudent={setStudent}
                data={storedStudents
                  .map((each) => {
                    return {
                      name: each.name,
                      class: course.find((crc) => crc._id === each.course.class)
                        .class,
                      section: course
                        .find((crc) => crc._id === each.course.class)
                        .groups.find((grp) => grp._id === each.course.group)
                        .sections.find((sec) => sec._id === each.course.section)
                        .name,
                      loginId: each.loginId,
                      _id: each._id,
                    };
                  })
                  .reverse()}
              />
            </div>
          </div>
        )}

        {resultData.length > 0 && (
          <div className="bottom">
            <div className="resultTable custom-scrollbar">
              <StudentSearchTable setStudent={setStudent} data={resultData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
