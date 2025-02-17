import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import { DELETE_FAQ, ADD_FAQ, EDIT_FAQ } from "../../../redux/HomeSlice";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";

const Faq = () => {
  const dispatch = useDispatch();
  const school = useSelector((state) => state.Home.school.payload);
  const [faqData, setFaqData] = useState(null);
  const [newFaq, setNewFaq] = useState(false);
  const [editFaq, setEditFaq] = useState({
    question: "",
    answer: "",
  });

  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );

  useEffect(() => {
    if (confirmGlobalStatusState === "accepted") {
      deleteFaq(faqData);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    } else if (confirmGlobalStatusState === "declined") {
      dispatch(REMOVE_CONFIRM_GLOBAL());
    }
  }, [confirmGlobalStatusState]);

  const deleteFaq = async (data) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/faq/${data._id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        dispatch(DELETE_FAQ(data._id));
        dispatch(SET_ALERT_GLOBAL(response.data));
      } else {
        dispatch(SET_ALERT_GLOBAL(response.data));
      }
    } catch (error) {
      const errorData = error.response?.data || {
        message: error.message,
        status: "Cannot communicate with the server",
      };
      dispatch(SET_ALERT_GLOBAL(errorData));
    }
  };

  const addNewFaq = async () => {
    const url = editFaq._id
      ? `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/faq/${editFaq._id}`
      : `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/faq/new`;

    const method = editFaq._id ? "put" : "post";

    try {
      const response = await axios[method](url, editFaq, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        dispatch(editFaq._id ? EDIT_FAQ(editFaq) : ADD_FAQ(editFaq));
        dispatch(SET_ALERT_GLOBAL(response.data));
        setNewFaq(false);
      } else {
        dispatch(SET_ALERT_GLOBAL(response.data));
      }
    } catch (error) {
      const errorData = error.response?.data || {
        message: error.message,
        status: "Cannot communicate with the server",
      };
      dispatch(SET_ALERT_GLOBAL(errorData));
    }
  };

  return (
    <div className="container mx-auto sm:px-0 md:px-4 py-8">
      {/* Modal for Add/Edit FAQ */}
      {newFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{zIndex: 999}}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-center mb-6 p-3 shadow1 rounded-md">
              {editFaq._id ? "Edit FAQ" : "Add New FAQ"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ms-2">
                  Question:
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter Question..."
                  value={editFaq.question}
                  onChange={(e) =>
                    setEditFaq({ ...editFaq, question: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ms-2">
                  Answer:
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  placeholder="Enter Answer..."
                  value={editFaq.answer}
                  onChange={(e) =>
                    setEditFaq({ ...editFaq, answer: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between space-x-4 p-3 shadow1 rounded-md">
              <button
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors w-[50%]"
                onClick={() => setNewFaq(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors w-[50%]"
                onClick={addNewFaq}
              >
                {editFaq._id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl p-3 bg-gray-100 rounded-lg font-bold text-gray-900">FAQ</h1>
        <button
          className="px-5 md:px-20  py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={() => {
            setEditFaq({ question: "", answer: "" });
            setNewFaq(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="text-sm">Add FAQ</span>
        </button>
      </div>

      {/* FAQ List */}
      {school.faq.length === 0 ? (
        <div className="text-center py-8 border-t border-b">
          <p className="text-gray-500 text-lg">No FAQs available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {school.faq.map((faq) => (
            <div
              key={faq._id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setEditFaq(faq);
                      setNewFaq(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => {
                      setFaqData(faq);
                      dispatch(
                        SET_CONFIRM_GLOBAL({
                          message: "Are you sure you want to delete this FAQ?",
                        })
                      );
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faq;