import React, { useEffect, useState } from "react";

const EditStudentMarks = ({
  dataMain = [],
  onClose = () => {},
  submitData = () => {},
  loading = false,
  setLoading
}) => {
  const [data, setData] = useState([...dataMain]); // Clone the array

  // Handle updates to obtainedMarks or obtainedMarks2
  const handleChange = (subjectId, field, value) => {
    const updatedData = data.map((item) =>
      item.subjectId === subjectId ? { ...item, [field]: value } : item
    );
    setData(updatedData);
  };

  // Handle submit action
  const handleSubmit = () => {
    setLoading(true);
    submitData(data)
  };

  console.log(data)


  return (
    <>
      {loading && (
        <div
          className="spinner-container flex1"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0px",
            left: "0px",
            backgroundColor: "#fff",
          }}
        >
          <div
            className="spinner-border text-primary my-4 loading452"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Edit Marks
          </h2>
          <hr />
          <div className="space-y-4 overflow-y-auto custom-scrollbar h-[400px]">
            {" "}
            {/* Set the height of the container */}
            {data.map((item) => (
              <div
                key={item.subjectId}
                className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{item.subject}</p>
                  <p className="text-sm text-gray-500">
                    Written : {item.fullMarks}
                  </p>

                  <p className="text-sm text-gray-500">
                    Practical : {item.fullMarks2}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div>
                    <label
                      htmlFor={`obtainedMarks-${item.subjectId}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      Written Marks
                    </label>
                    <input
                      type="number"
                      id={`obtainedMarks-${item.subjectId}`}
                      value={item.obtainedMarks || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        handleChange(item.subjectId, "obtainedMarks", value);
                      }}
                      className="mt-1 block w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`obtainedMarks2-${item.subjectId}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      Practical Marks
                    </label>
                    <input
                      type="number"
                      id={`obtainedMarks2-${item.subjectId}`}
                      value={item.obtainedMarks2 || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        handleChange(item.subjectId, "obtainedMarks2", value);
                      }}
                      className="mt-1 block w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr />
          <div className="mt-6 flex gap-x-4 w-full">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 w-1/2"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 w-1/2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditStudentMarks;
