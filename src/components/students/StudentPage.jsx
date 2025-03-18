import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./studentPage.scss";
import Dashboard from "./Dashboard";
import MiniNav from "./MiniNav";
import Header from "./Header2";
import SecurityComponent from "../basicComponents/SecurityComponent";
import { Route, Switch } from "react-router-dom";
import NotFound from "../layout/NotFound";
import Fees from "./Fees";
import Library from "./Library";
import Profile from "./Profile";
import axios from "axios";
import {
  GET_STUDENTDATA,
  GET_STUDENTDATA_FAIL,
  GET_STUDENTDATA_SUCCESS,
} from "../../redux/StudentDataSlice";

const StudentPage = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const dispatch = useDispatch();

  const studentData = useSelector(
    (state) => state.StudentData.studentData.payload
  );

  //for Navbar

  const [showMiniNav, setShowMiniNav] = useState(false);
  function toggleMiniNav() {
    setShowMiniNav(!showMiniNav);
  }

  useEffect(() => {

    if(studentData){
      return;
    }



    dispatch(GET_STUDENTDATA());
    axios
      .get(`${process.env.REACT_APP_API_URL}/student/${schoolCode}/info`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(GET_STUDENTDATA_SUCCESS(response.data.data));
        } else {
          dispatch(GET_STUDENTDATA_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(GET_STUDENTDATA_FAIL(error.response.data));
          return;
        }
        dispatch(GET_STUDENTDATA_FAIL(data));
      });
  }, []);

  return (
    <div className=" usdysn">
      <Header function={toggleMiniNav} />

      <div
        className="hawashdusdbsds"
        style={{
          position: "fixed",
          top: "62px",
          left: "0px",
          zIndex: "99999999",
          backgroundColor: "#fff",
        }}
      >
        {showMiniNav && (
          <div className="miniNav2">
            {" "}
            <MiniNav function23={toggleMiniNav} />
          </div>
        )}
      </div>

      {user && studentData && (
        <div className="main">
          <div className="miniNav">
            {" "}
            <MiniNav />
          </div>

          {
            <div className="others">
              <Switch>
                <Route
                  exact
                  path={`/school/${schoolCode}/student/`}
                  component={Dashboard}
                />
                <Route
                  exact
                  path={`/school/${schoolCode}/student/security`}
                  component={SecurityComponent}
                />
                <Route
                  exact
                  path={`/school/${schoolCode}/student/fees`}
                  component={Fees}
                />
                <Route
                  exact
                  path={`/school/${schoolCode}/student/library`}
                  component={Library}
                />
                <Route
                  exact
                  path={`/school/${schoolCode}/student/profile`}
                  component={Profile}
                />

                <Route path="" component={NotFound} />
              </Switch>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default StudentPage;
