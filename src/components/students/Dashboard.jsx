import React, { useEffect, useState } from "react";
import "./dashboard.scss";

import Table from "../layout/Table";
import Dropdown from "../basicComponents/Dropdown";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const studentData = useSelector(
    (state) => state.StudentData.studentData.payload
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);

  const [examData, setExamData] = useState(studentData.exam);
  const [currentTerm, setCurrentTerm] = useState(studentData.exam.length);
  const [termData, setTermData] = useState(studentData.exam[currentTerm - 1]);

  useEffect(() => {
    if (currentTerm) {
      setTermData(examData[currentTerm - 1]);
    }
  }, [currentTerm]);

  const courseData = studentData.course;

  return (
    <div className="dashboard001234c">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Dashboard`}
      />
      <div className="box">
        <div className="top flex3">
          <div
            className="each px-4 mx-2"
            style={{ backgroundColor: "#F4F2FC" }}
          >
            {" "}
            <p className="h7 w500">Working Days </p>{" "}
            <p className="h5 mt-2"> {studentData.workingDays.length} </p>{" "}
          </div>
          <div
            className="each px-4 mx-2"
            style={{ backgroundColor: "#F0F4FC" }}
          >
            {" "}
            <p className="h7 w500">Present Days </p>{" "}
            <p className="h5 mt-2">
              {" "}
              {studentData.workingDays.length -
                studentData.student.session.find(
                  (ses) => ses.courseId === courseData.class
                ).absentDays.length}{" "}
            </p>{" "}
          </div>
          <div
            className="each px-4 mx-2"
            style={{ backgroundColor: "#F9E0E0" }}
          >
            {" "}
            <p className="h7 w500">Absent Days </p>{" "}
            <p className="h5 mt-2">
              {" "}
              {
                studentData.student.session.find(
                  (ses) => ses.courseId === courseData.class
                ).absentDays.length
              }{" "}
            </p>{" "}
          </div>
        </div>

        {examData && (
          <section className="results">
            <p className="h5 w600 text-secondary text-center mt-5 my-4">
              Results
            </p>
            <div className="dropdowns d-flex">
              {/* <Dropdown
                options={options}
                title={`Year`}
                onSelect={handleSelect}
              /> */}

              <Dropdown
                options={examData.map((ind, index) => {
                  return {
                    value: index,
                    label: `${index + 1}`,
                  };
                })}
                title={currentTerm ? `Term : ${currentTerm}` : "Select Term"}
                onSelect={(a) => {
                  setCurrentTerm(parseInt(a + 1));
                }}
              />
            </div>

            {termData && (
              <div className="resultTable custom-scrollbar shadow1">
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
                    "Obtained Marks",
                    "Status",
                  ]}
                />
              </div>
            )}
          </section>
        )}

        <hr style={{ width: "80%", margin: "50px auto" }} />

        <section className="absent">
          <p className="h5 w600 text-center mb-4">Absent Days</p>

          <div className="abs-container">
            <div className="each left shadow1">
              <Table
                data={studentData.student.session
                  .find((ses) => ses.courseId === courseData.class)
                  .absentDays.map((ind, index) => {
                    return {
                      sn: index + 1,
                      date: ind.date.split("T")[0],
                      reason: ind.reason ? ind.reason : "N/A",
                    };
                  })}
                fields={["Sn", "Date", "Reason"]}
                exclude={["_id"]}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
