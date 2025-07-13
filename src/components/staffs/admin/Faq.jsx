import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
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

  if (newFaq) {
    document.body.classList.add("dshauda-hidden");
  } else {
    document.body.classList.remove("dshauda-hidden");
  }

  return (
    <div className="container mx-auto sm:px-0 md:px-4 py-8">
      {/* Modal for Add/Edit FAQ */}
      {newFaq && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 999 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100 animate-in">
            {/* Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl flex-shrink-0">
              <h2 className="text-lg font-semibold text-white text-center">
                {editFaq._id ? "✏️ Edit FAQ" : "➕ Add New FAQ"}
              </h2>
              <div className="absolute inset-0 bg-white/10 rounded-t-2xl"></div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto">
              {/* Question Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Question
                </label>
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                    rows="4"
                    placeholder="What would you like to know? Ask your question here..."
                    value={editFaq.question}
                    onChange={(e) =>
                      setEditFaq({ ...editFaq, question: e.target.value })
                    }
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {editFaq.question.length}/500
                  </div>
                </div>
              </div>

              {/* Answer Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Answer
                </label>
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                    rows="5"
                    placeholder="Provide a clear and helpful answer..."
                    value={editFaq.answer}
                    onChange={(e) =>
                      setEditFaq({ ...editFaq, answer: e.target.value })
                    }
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {editFaq.answer.length}/1000
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm"
                  onClick={() => setNewFaq(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={addNewFaq}
                >
                  {editFaq._id ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl p-3 bg-gray-100 rounded-lg font-bold text-gray-900">
          FAQ
        </h1>
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
