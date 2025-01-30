import React, {  useState } from "react";
import "./sessionTree.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import Loading from "../layout/loading";
import DataTableForNextClass from "../staffs/admin/DataTableForNextClass";

const SessionTree = ({ closeFunction = () => {} }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const dispatch = useDispatch();

  const [data, setData] = useState(
    school.course.map((each) => {
      return {
        class: each._id,
        name: each.class,
        next: each.next || undefined,
      };
    })
  );

  function updateData(a) {
    setData(a);
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          closeFunction();
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setLoading(false);
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

  return (
    <div className="sessionTree11">
      {loading && <Loading />}

      <div className="insider22x custom-scrollbar">
        <div className="closeContainer">
          <div className="close flex1" onClick={closeFunction}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        <div className="mone12">
          <p className="h5 text-center w600 text-secondary"> Session Tree </p>
          <div className="flex1 py-2">
          <p className="h7 text-center w500 psw2" style={{maxWidth: '700px'}}>
            Here map all the classes with the next class so that when the new session starts all the students in every class is promoted to the next class
          </p>

          </div>

          <hr />

          <div
            className="more"
            style={{
              overflow: "auto",
              margin: "auto",
              maxWidth: "min(100%, 1000px)",
              height: "100vh",
            }}
          >
            <div className="custom-scrollbar">
              <DataTableForNextClass data1={data} updatefunc={updateData} />
            </div>

            <div className="button">
              <hr />
              <button className="btn btn-primary" onClick={handleSubmit}>
                {" "}
                Submit{" "}
              </button>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTree;
