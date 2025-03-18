import React, { useEffect, useState } from "react";
import "./library.scss";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import Table from "../layout/Table";

const Library = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const user = useSelector((state) => state.User.user.payload);

  const studentData = useSelector(
    (state) => state.StudentData.studentData.payload
  );

  let StudentCourseInfo = studentData.course;

  const [returnedBooks, setReturnedBooks] = useState(
    studentData
      ? studentData.student.session.find(
        (ses) => ses.courseId === StudentCourseInfo.class
      ).library.filter(
          (book) => book.returnedDate
        )
      : []
  );

  const [notReturnedBooks, setNotReturnedBooks] = useState(
    studentData
      ? studentData.student.session.find(
        (ses) => ses.courseId === StudentCourseInfo.class
      ).library.filter(
          (book) => !book.returnedDate
        )
      : []
  );

  return (
    <div className="libraryComponent2366 flex2 applyBootstrap">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Library`}
      />
      <div className="mainyy" style={{ marginTop: "1vw" }}>
        <section className="library">
          <div className="top flex3" style={{ paddingTop: "1vw" }}>
            <div className="each px-4" style={{ backgroundColor: "#F4F2FC" }}>
              {" "}
              <p className="h7 w500">Books Taken </p>{" "}
              <p className="h5 mt-2">
                {" "}
                {notReturnedBooks.length + returnedBooks.length}{" "}
              </p>{" "}
            </div>
            <div
              className="each px-4 ms-2"
              style={{ backgroundColor: "#F0F4FC" }}
            >
              {" "}
              <p className="h7 w500">To Return </p>{" "}
              <p className="h5 mt-2"> {notReturnedBooks.length} </p>{" "}
            </div>
            <div
              className="each px-4 ms-2"
              style={{ backgroundColor: "#F9E0E0" }}
            >
              {" "}
              <p className="h7 w500">Books Returned </p>{" "}
              <p className="h5 mt-2"> {returnedBooks.length} </p>{" "}
            </div>
          </div>

          <div className="nearest-Returns my-3">
            <p className="h6 w600 text-center py-2">Not Returned Books</p>

            <div className="for-table custom-scrollbar mt-4 shadow1">
              <Table
                data={notReturnedBooks.map((int) => {
                  return {
                    name: int.book,
                    date: int.date.split("T")[0],
                    returnedDate: int.returnDate.split("T")[0],
                  };
                })}
                fields={["Book Name", "Date Taken", "Return Date"]}
              />
            </div>

            <hr />
          </div>

          <div className="libraryHistory26">
            <div
              className="myline flex1"
              style={{ justifyContent: "flex-start" }}
            >
              <p className="h6 w600 text-center" style={{ width: "100%" }}>
                {" "}
                Returned Books{" "}
              </p>

              {/* <div className="myDropdown flex1">
                <Dropdown
                  options={options}
                  // title={`Select One`}
                  onSelect={handleSelect}
                />
              </div> */}
            </div>

            <div className="for-table custom-scrollbar mt-4 shadow1">
              <Table
                data={returnedBooks.map((int) => {
                  return {
                    name: int.book,
                    date: int.date.split("T")[0],
                    returnedDate: int.returnedDate.split("T")[0],
                  };
                })}
                fields={["Book Name", "Date Taken", "Returned Date"]}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
