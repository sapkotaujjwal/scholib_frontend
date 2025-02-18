import React from "react";

const ExamMarks = ({ students, newMarks, setNewMarks, updateExamInfo }) => {


  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100%] bg-white overflow-auto" style={{zIndex:'9999'}}>
      <div className=" mx-auto p-4 bg-white rounded-lg shadow-md ">
        <div className="overflow-y-auto">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Edit Exam Info
          </h2>
          <div className="border-b border-gray-200 mb-6"></div>

          {newMarks.students.length > 0 ? (
            <div className="overflow-x-auto mb-6 bg-gray-50 p-3 m-3 rounded-md shadow1">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.N
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Written Marks
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Practical Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newMarks.students.map((obj, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {students.find((std) => std._id === obj.student).name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="text"
                          id={`marks-${index}`}
                          value={obj.obtainedMarks || ""}
                          className="w-60 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                          onChange={(event) => {
                            const newObtainedMarks = event.target.value;
                            const numericValue =
                              newObtainedMarks === ""
                                ? ""
                                : newObtainedMarks.replace(/\D/g, "");

                            if (newObtainedMarks !== "" && numericValue === "")
                              return;

                            setNewMarks((prevMarks) => ({
                              ...prevMarks,
                              students: prevMarks.students.map((student, i) =>
                                i === index
                                  ? {
                                      ...student,
                                      obtainedMarks:
                                        numericValue === ""
                                          ? null
                                          : parseInt(numericValue, 10),
                                    }
                                  : student
                              ),
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const nextElement = document.getElementById(
                                `marks-${index + 1}`
                              );
                              if (nextElement) nextElement.focus();
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="text"
                          id={`marks2-${index}`}
                          value={obj.obtainedMarks2 || ""}
                          className="w-60 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center "
                          onChange={(event) => {
                            const newObtainedMarks2 = event.target.value;
                            const numericValue =
                              newObtainedMarks2 === ""
                                ? ""
                                : newObtainedMarks2.replace(/\D/g, "");

                            if (newObtainedMarks2 !== "" && numericValue === "")
                              return;

                            setNewMarks((prevMarks) => ({
                              ...prevMarks,
                              students: prevMarks.students.map((student, i) =>
                                i === index
                                  ? {
                                      ...student,
                                      obtainedMarks2:
                                        numericValue === ""
                                          ? null
                                          : parseInt(numericValue, 10),
                                    }
                                  : student
                              ),
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const nextElement = document.getElementById(
                                `marks2-${index + 1}`
                              );
                              if (nextElement) nextElement.focus();
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 font-semibold">
                No Students Available
              </p>
              <div className="border-b border-gray-200 mt-4"></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-3 m-3 rounded-md shadow1">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Written
              </label>
              <input
                type="text"
                value={newMarks.fullMarks || ""}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue =
                    value === "" ? null : parseInt(value, 10);
                  if (isNaN(numericValue)) return;
                  setNewMarks({ ...newMarks, fullMarks: numericValue });
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Practical
              </label>
              <input
                type="text"
                value={newMarks.fullMarks2 || ""}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue =
                    value === "" ? null : parseInt(value, 10);
                  if (isNaN(numericValue)) return;
                  setNewMarks({ ...newMarks, fullMarks2: numericValue });
                }}
              />
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6"></div>

          <div className="flex justify-between gap-4 bg-gray-50 p-3 m-3 rounded-md shadow1">
            <button
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => setNewMarks(false)}
            >
              Cancel
            </button>
            <button
              className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={updateExamInfo}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamMarks;
