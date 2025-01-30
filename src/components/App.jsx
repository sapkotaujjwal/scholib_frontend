import "./app.scss";
import School from "./school";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Scholib from "./scholib/Scholib";
import Login from "./layout/Login";

import { GET_USER, GET_USER_SUCCESS, ERROR_REMOVE } from "../redux/UserSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import RegisterSchool from "./registerSchool/RegisterSchool";
import {
  GET_SCHOLIB,
  GET_SCHOLIB_FAIL,
  GET_SCHOLIB_SUCCESS,
} from "../redux/scholibSlice";
import { SET_DATE } from "../redux/OtherInfoSlice";
import Register from "./test/Register";

function App() {
  const dispatch = useDispatch();

  function convertDate(originalDateString) {
    // Parse the original date string
    var originalDate = new Date(originalDateString);

    // Subtract one year from the year component of the date
    originalDate.setFullYear(originalDate.getFullYear() - 1);

    // Format the date into the desired string format
    var year = originalDate.getFullYear();
    var month = String(originalDate.getMonth() + 1).padStart(2, "0");
    var day = String(originalDate.getDate()).padStart(2, "0");
    var formattedDateString = year + "/" + month + "/" + day;

    return formattedDateString;
  }

  useEffect(() => {
    dispatch(GET_USER());

    axios
      .get(`${process.env.REACT_APP_API_URL}/mutual/login2`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          response.data.data.dob = convertDate(response.data.data.dob);
          dispatch(GET_USER_SUCCESS(response.data.data));
          dispatch(SET_DATE(response.data.date));
        } else {
          dispatch(ERROR_REMOVE());
        }
      })
      .catch((error) => {
        dispatch(ERROR_REMOVE());
        console.log("You are not logged In");
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(GET_SCHOLIB());
    axios
      .get(`${process.env.REACT_APP_API_URL}/scholib/company`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(GET_SCHOLIB_SUCCESS(response.data.data));
        } else {
          dispatch(GET_SCHOLIB_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(GET_SCHOLIB_FAIL(error.response.data));
          return;
        }
        dispatch(GET_SCHOLIB_FAIL(data));
      });
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        <Route path="/school/:schoolCode" component={School} />
        <Route exact path="/register" component={RegisterSchool} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/test3" component={Register} />

        <Route path="/" component={Scholib} />
      </Switch>
    </Router>
  );
}

export default App;
