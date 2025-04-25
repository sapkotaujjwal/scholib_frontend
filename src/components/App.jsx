import "./app.scss";
import School from "./school";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Scholib from "./scholib/Scholib";
import Login from "./layout/Login";
import { GET_USER, GET_USER_SUCCESS, ERROR_REMOVE } from "../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  GET_SCHOLIB,
  GET_SCHOLIB_FAIL,
  GET_SCHOLIB_SUCCESS,
} from "../redux/scholibSlice";
import { SET_DATE } from "../redux/OtherInfoSlice";
import NotFound from "./layout/NotFound";
import Loading from "./layout/loading";
import Error from "./layout/error";

function App() {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const error = useSelector((state) => state.Scholib.error.payload);

  // get user data from the server
  useEffect(() => {
    dispatch(GET_USER());

    axios
      .get(`${process.env.REACT_APP_API_URL}/mutual/login2`, {
        withCredentials: true,
      })
      .then((response) => {
        setSuccess(true);
        if (response.data.success) {
          dispatch(GET_USER_SUCCESS(response.data.data));
          dispatch(SET_DATE(response.data.date));
        } else {
          dispatch(ERROR_REMOVE());
        }
      })
      .catch((error) => {
        setSuccess(true);
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          // dispatch(GET_SCHOLIB_FAIL(error.response.data));
          // window.location = "https://scholib.com/login.html";
          return;
        }
        dispatch(GET_SCHOLIB_FAIL(data));

        setSuccess(true);
        dispatch(ERROR_REMOVE());
      });
  }, [dispatch]);

  // get scholib data from the server
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
      {!success && !error && <Loading />}

      {error && <Error status={error.status} message={error.message} />}

      {success && !error && (
        <Switch>
          <Route path="/school/:schoolCode" component={School} />
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Scholib} />

          <Route path="" component={NotFound} />
        </Switch>
      )}
    </Router>
  );
}

export default App;
