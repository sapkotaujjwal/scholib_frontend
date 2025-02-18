import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import Loading from "../layout/loading";

const SessionTree = ({ closeFunction = () => {} }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const dispatch = useDispatch();

  const [data, setData] = useState(
    school.course.map((each) => ({
      class: each._id,
      name: each.class,
      next: each.next || "",
    }))
  );

  // Collect all classes used as next by any other class
  const usedAsNext = new Set(data.map((item) => item.next).filter((next) => next !== ""));

  // Helper function to check for cycles
  const createsCycle = (currentClassId, nextClassId) => {
    let current = nextClassId;
    const visited = new Set();

    while (current) {
      if (current === currentClassId) return true;
      if (visited.has(current)) break;
      visited.add(current);
      const nextEntry = data.find((item) => item.class === current);
      current = nextEntry?.next;
    }
    return false;
  };

  function updateData(index, value) {
    const updatedData = [...data];
    updatedData[index].next = value;
    setData(updatedData);
  }

  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/courses/setNext`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        setLoading(false);
        dispatch(SET_ALERT_GLOBAL(response.data));
        if (response.data.success) closeFunction();
      })
      .catch((error) => {
        setLoading(false);
        const message = error.response
          ? error.response.data
          : {
              message: error.message,
              status: "Cannot communicate with the server",
            };
        dispatch(SET_ALERT_GLOBAL(message));
      });
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 sm:p-0 md:p-4"
      style={{ zIndex: 1000 }}
    >
      {loading && <Loading />}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl px-3 py-6 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-700 mx-auto">
            Session Tree
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeFunction}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <p className="text-gray-600 text-sm mt-2 text-center">
          Map all classes with the next class so that when the new session
          starts, students are promoted accordingly.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Class Name</th>
                <th className="border border-gray-300 px-4 py-2">Next Class</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.class} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      className="border border-gray-300 p-2 rounded w-full"
                      value={item.next}
                      onChange={(e) => updateData(index, e.target.value)}
                    >
                      <option value="">Select Next Class</option>
                      {school.course.map((opt) => {
                        const isCurrentClass = opt._id === item.class;
                        const isUsedAsNext = usedAsNext.has(opt._id);
                        const createsACycle = createsCycle(item.class, opt._id);
                        const isDisabled = isCurrentClass || isUsedAsNext || createsACycle;
                        return (
                          <option
                            key={opt._id}
                            value={opt._id}
                            disabled={isDisabled}
                          >
                            {opt.class}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTree;