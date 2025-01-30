import React from "react";

const ResultTemplate = ({
  student = {
    name: "Nikesh Mishra",
    id: 633541,
    class: 1,
    section: "A",
    marks: [
      {
        subject: "Math",
        theory: 40,
        practical: 10,
        fullMarks: 50,
        obtainedMarks: 45,
      },
      {
        subject: "Science",
        theory: 35,
        practical: 15,
        fullMarks: 50,
        obtainedMarks: 40,
      },
      {
        subject: "English",
        theory: 50,
        practical: 0,
        fullMarks: 50,
        obtainedMarks: 42,
      },
      {
        subject: "Math",
        theory: 40,
        practical: 10,
        fullMarks: 50,
        obtainedMarks: 45,
      },
      {
        subject: "Science",
        theory: 35,
        practical: 15,
        fullMarks: 50,
        obtainedMarks: 40,
      },
      {
        subject: "English",
        theory: 50,
        practical: 0,
        fullMarks: 50,
        obtainedMarks: 42,
      },
      {
        subject: "Math",
        theory: 40,
        practical: 10,
        fullMarks: 50,
        obtainedMarks: 45,
      },
      {
        subject: "Science",
        theory: 35,
        practical: 15,
        fullMarks: 50,
        obtainedMarks: 40,
      },
      {
        subject: "English",
        theory: 50,
        practical: 0,
        fullMarks: 50,
        obtainedMarks: 2,
      },
    ],
  },
  school = {
    name: "Balmiki Lincoln College",
    address: "Birtamode 1 Birtamode Jhapa",
  },
  exam = {
    year: 2071,
    term: `1st`,
  },
}) => {
  // Calculate GPA (Assume GPA = Obtained Marks / Full Marks * 4)
  const calculateGPA = (obtained, full) => ((obtained / full) * 4).toFixed(2);

  return (
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">{school.name}</h1>
        <h1 className="text-l text-gray-600 my-2">{school.address}</h1>
        <p className="text-md text-gray-600"> Examination Results </p>

        <div className="text-sm text-gray-400">
          {" "}
          {/* {exam.term} Terminal Examination of {exam.year} */}
        </div>
      </div>

      {/* Student Information */}
      <div className="mt-6">
        <div className="flex1">
          <p className="text-lg" style={{ flexBasis: "50%" }}>
            <span className="font-semibold text-gray-700">Name :</span>{" "}
            {student.name}
          </p>

          <p className="text-lg" style={{ flexBasis: "50%" }}>
            <span className="font-semibold text-gray-700">Id :</span>{" "}
            {student.id}
          </p>
        </div>

        <div className="flex1">
          <p className="text-lg" style={{ flexBasis: "50%" }}>
            <span className="font-semibold text-gray-700">Class :</span>{" "}
            {student.class}
          </p>
          <p className="text-lg" style={{ flexBasis: "50%" }}>
            <span className="font-semibold text-gray-700">Section :</span>{" "}
            {student.section}
          </p>
        </div>
      </div>

      {/* Marks Table */}
      <div className="mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Theory</th>
              <th className="border px-4 py-2">Practical</th>
              <th className="border px-4 py-2">Full Marks</th>
              {/* <th className="border px-4 py-2">Obtained Marks</th> */}
              <th className="border px-4 py-2">GPA</th>
            </tr>
          </thead>
          <tbody>
            {student.marks.map((mark, index) => (
              <tr key={index} className="text-gray-700">
                <td className="border px-4 py-2">{mark.subject}</td>
                <td className="border px-4 py-2">{mark.theory}</td>
                <td className="border px-4 py-2">{mark.practical}</td>
                <td className="border px-4 py-2">{mark.fullMarks}</td>
                {/* <td className="border px-4 py-2">{mark.obtainedMarks}</td> */}
                <td className="border px-4 py-2">
                  {calculateGPA(mark.obtainedMarks, mark.fullMarks)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 text-right">
        <p className="text-md font-semibold text-gray-800 mr-2">
          Final GPA :{" "}
          {calculateGPA(
            student.marks.reduce((sum, mark) => sum + mark.obtainedMarks, 0),
            student.marks.reduce((sum, mark) => sum + mark.fullMarks, 0)
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
        <div className="flex1">
          <p className="text-md" style={{ flexBasis: "50%" }}>
            <span className="font-semibold text-gray-700">
              Total Working Days :
            </span>{" "}
            {130}
          </p>
          <p className="text-md" style={{ flexBasis: "50%" }}>
            <span className="font-semibold text-gray-700">Present Days :</span>{" "}
            {108}
          </p>
        </div>
      </div>

      <hr />
      {/* <p className="h6 text-center mt-4"> Generated by Scholib.com </p> */}
    </div>
  );
};

export default ResultTemplate;
