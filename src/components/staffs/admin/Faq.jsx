import React, { useEffect, useRef, useState } from "react";
import "./faq.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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

  async function deleteFaq(data) {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/faq/${data._id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(DELETE_FAQ(data._id));
          dispatch(SET_ALERT_GLOBAL(response.data));
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
          return;
        }
        dispatch(SET_ALERT_GLOBAL(data));
      });
  }

  const [newFaq, setNewFaq] = useState(false);

  const questionRef = useRef(null);

  if (newFaq) {
    document.body.classList.add("dshauda-hidden322");
  } else {
    document.body.classList.remove("dshauda-hidden322");
  }

  const [editFaq, setEditFaq] = useState({
    question: "",
    answer: "",
  });

  async function addNewFaq() {


    if (editFaq._id) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/faq/${editFaq._id}`,
          editFaq,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            dispatch(EDIT_FAQ(editFaq))
            dispatch(SET_ALERT_GLOBAL(response.data));
            setNewFaq(false);
          } else {
            dispatch(SET_ALERT_GLOBAL(response.data));
          }
        })
        .catch((error) => {
          const data = {
            message: error.message,
            status: "Cannot communicate with the server",
          };

          if (error.response) {
            dispatch(SET_ALERT_GLOBAL(error.response.data));
            return;
          }
          dispatch(SET_ALERT_GLOBAL(data));
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/faq/new`,
          editFaq,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            dispatch(ADD_FAQ(editFaq))
            dispatch(SET_ALERT_GLOBAL(response.data));
            setNewFaq(false);
          } else {
            dispatch(SET_ALERT_GLOBAL(response.data));
          }
        })
        .catch((error) => {
          const data = {
            message: error.message,
            status: "Cannot communicate with the server",
          };

          if (error.response) {
            dispatch(SET_ALERT_GLOBAL(error.response.data));
            return;
          }
          dispatch(SET_ALERT_GLOBAL(data));
        });
    }
  }

  return (
    <div className="adminFaq23879">
      {newFaq && (
        <div className="faqMe flex1">
          <div className="inside-me123444">
            <p className="h5 w600 text-center">
              {" "}
              {`${editFaq._id ? "Edit FAQ" : "Add New FAQ"}`}{" "}
            </p>

            <div className="finalInside2323">
              <div className="eachinds2">
                <p className="h6 w600"> Question : </p>
                <textarea
                  ref={questionRef}
                  value={editFaq.question}
                  cols="30"
                  rows="10"
                  placeholder="Enter Question ..."
                  onChange={(event) =>
                    setEditFaq({ ...editFaq, question: event.target.value })
                  }
                ></textarea>
              </div>

              <div className="eachinds2">
                <p className="h6 w600"> Answer : </p>
                <textarea
                  value={editFaq.answer}
                  onChange={(event) =>
                    setEditFaq({ ...editFaq, answer: event.target.value })
                  }
                  cols="30"
                  placeholder="Enter Answer ..."
                  rows="10"
                ></textarea>
              </div>
            </div>

            <div className="btns-3227 flex4">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setNewFaq(false);
                }}
              >
                {" "}
                Close{" "}
              </button>
              <button className="btn btn-primary" onClick={() => addNewFaq()}>
                {`${editFaq._id ? "Update" : "Submit"}`}{" "}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="texr21 pb-2">
        <p className="h4 w600"> FAQ </p>
      </div>

      {school.faq.length < 1 && (
        <div className="my-3">

          <hr />
          <p
            className="text-lg w500 text-gray-500 text-center py-2 m-0"
            style={{ margin: "auto" }}
          >
            Not Available
          </p>

          <hr />
        </div>
      )}

      <div className="meMain23y">
        {school.faq.map((faq) => {
          return (
            <div key={faq._id} className="mInd flex4">
              <div className="left823b">
                <div className="question">
                  <p className="h6 w600"> {faq.question} </p>
                </div>
                <div className="answer">
                  <p className="h6 w400">{faq.answer}</p>
                </div>
              </div>

              <div className="right-controls p-1 flex1">
                <p
                  className="h6 w600"
                  onClick={() => {
                    setFaqData(faq);
                    dispatch(
                      SET_CONFIRM_GLOBAL({
                        message: "Are you sure to delete this faq ?",
                      })
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />{" "}
                </p>
                <p
                  className="h6 mx-2 w600"
                  onClick={() => {
                    setEditFaq(faq);
                    setNewFaq(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />{" "}
                </p>
              </div>
            </div>
          );
        })}

        <div className="button2123 flex1 justify-content-center">
          <button
            className="btn btn-primary newFaq"
            onClick={() => {
              setEditFaq({
                question: "",
                answer: "",
              });
              setNewFaq(true);
            }}
          >
            {" "}
            Add a new FAQ{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faq;
