import React, { useState } from "react";
import "./allClasses.scss";
import { useSelector } from "react-redux";

const AllClasses = ({
  closeFunction = () => {},
  title = "Select Classes",
  btnText = "Submit",
  handleGetSelectedOnes,
  courseData,
}) => {
  const courses = useSelector((state) =>
    courseData ? courseData : state.Course.course.payload.course
  );
  const [selectedOnes, setSelectedOnes] = useState([]);

  const handleClassSelection = (classId) => {
    if (selectedOnes.find((dat) => dat === classId)) {
      setSelectedOnes((prevSelectedOnes) =>
        prevSelectedOnes.filter((id) => id !== classId)
      );
    } else {
      setSelectedOnes((prevSelectedOnes) => [...prevSelectedOnes, classId]);
    }
  };

  function handleDoneClick() {
    handleGetSelectedOnes(selectedOnes);
    closeFunction();
  }

  return (
    <div className="allClassesBox">
      <div className="meInside23 custom-scrollbar">
        <div className="close">
          <button onClick={() => closeFunction()}>Close</button>
        </div>

        <p className="h6 text-center w600" style={{ marginTop: "55px" }}>
          {title}
        </p>
        <div className="content-box">
          <p className="h6 w500 ms-2">All Classes</p>
          <div className="actddsd mt-3">
            <div className="classesContent">
              {courses.length > 0 && (
                <div className="classes-list flex1">
                  {courses.map((arr) => (
                    <div
                      className={`each flex1 ${
                        selectedOnes.includes(arr._id) ? "active" : ""
                      }`}
                      key={arr._id}
                      onClick={() => handleClassSelection(arr._id)}
                    >
                      <p className="h6 w600">{arr.class}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="button my-3 flex1">
            <button
              className="btn btn-primary"
              style={{ width: "300px", fontSize: "13px" }}
              onClick={() => handleDoneClick()}
            >
              {btnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllClasses;
