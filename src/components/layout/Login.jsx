import React, { useRef, useState } from "react";
import "./login.scss";
import logo from "../../images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  GET_USER,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  ERROR_REMOVE,
} from "../../redux/UserSlice";
import axios from "axios";
import MetaData from "./MetaData";
import { SET_DATE } from "../../redux/OtherInfoSlice";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import AlertAdv from "../test/AlertAdv";
import Loading from "./loading";

const Login = () => {
  const dispatch = useDispatch();

  const loginBtnRef = useRef(null);
  const alertGlobal = useSelector((state) => state.AlertGlobal.alertGlobal);
  const school = useSelector((state) => state.Home.school.payload);

  const schoolCode = useRef(null);
  const loginId = useRef(null);
  const password = useRef(null);
  const otpInput = useRef(null);

  const newPass1 = useRef(null);
  const newPass2 = useRef(null);

  const history = useHistory();

  // State to store form data
  const [formData, setFormData] = useState({
    schoolCode: school ? school.schoolCode : "",
    loginId: "",
    otp: "",
    password: "",
  });

  const [role, setRole] = useState("Student");

  function roleStaff() {
    setRole("Staff");
  }

  function roleStudent() {
    setRole("Student");
  }

  const loading = useSelector((state) => state.User.loading);
  const error = useSelector((state) => state.User.error.payload);

  const [loading2, setLoading2] = useState(false);

  const [state, setState] = useState(1);

  // Function to login actually
  const handleSubmit = () => {
    dispatch(ERROR_REMOVE());

    let data = {
      schoolCode: parseInt(schoolCode.current.value),
      loginId: parseInt(loginId.current.value),
      password: password.current.value,
      role,
    };

    // Validate input lengths
    if (
      schoolCode.current.value.length < 6 ||
      loginId.current.value.length < 4 ||
      password.current.value.length < 8
    ) {
      alert(
        "All fields are required ! and schoolCode must be of 6 characters, loginId must be of 4 characters and password must be of at least 8 characters"
      );
      return;
    }

    dispatch(GET_USER());

    axios
      .post(`${process.env.REACT_APP_API_URL}/mutual/login`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(GET_USER_SUCCESS(response.data.user));
          dispatch(SET_DATE(response.data.date));

          if (school && school.schoolCode) {
            history.goBack();
          } else {
            // history.push(`/school/${parseInt(schoolCode.current.value)}`);
            history.push(`/school/${parseInt(response.data.user.schoolCode)}/updates`);
          }
        } else if (response.data.success === false) {
          dispatch(GET_USER_FAIL(response.data.data));
        }
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };

        if (error.response) {
          dispatch(GET_USER_FAIL(error.response.data));
          return;
        }
        dispatch(GET_USER_FAIL(data));
      });
  };

  function emailOTP() {
    const schoolCode1 = formData.schoolCode;
    const loginId = formData.loginId;

    if (!schoolCode1 || !loginId) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Alert",
          message: "Enter your School Code and login Id",
        })
      );
      setLoading2(false);
      return;
    }

    if (schoolCode1.toString().length !== 6) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Alert",
          message: "School Code is of 6 characters",
        })
      );
      setLoading2(false);
      return;
    }

    if (loginId.length !== 6) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Alert",
          message: "login Id is of 6 characters",
        })
      );
      setLoading2(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/mutual/generate/otp`, {
        params: {
          schoolCode: schoolCode1,
          loginId,
          role,
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading2(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setState(3);
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setLoading2(false);
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

  function verifyOTP() {
    const otp = formData.otp;

    if (otp.toString().length !== 6) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Alert",
          message: "OTP is of 6 characters",
        })
      );
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/mutual/verify/otp`, {
        params: {
          schoolCode: formData.schoolCode,
          loginId: formData.loginId,
          role: role,
          otp,
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading2(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setState(4);
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setLoading2(false);
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

  function resetPassword() {
    const otp = formData.otp;

    if (formData.password.length < 8) {
      dispatch(
        SET_ALERT_GLOBAL({
          message: "Password should be of at least 8 characters",
        })
      );
      return;
    }

    if (newPass1.current.value !== newPass2.current.value) {
      newPass1.current.value = "";
      newPass2.current.value = "";

      dispatch(
        SET_ALERT_GLOBAL({
          message: "Password and confirm password didn't match",
        })
      );
      return;
    }

    if (otp.toString().length !== 6) {
      dispatch(
        SET_ALERT_GLOBAL({
          status: "Alert",
          message: "OTP is of 6 characters",
        })
      );
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/mutual/change/passwordfromOtp`, {
        params: {
          schoolCode: formData.schoolCode,
          loginId: formData.loginId,
          role: role,
          otp: formData.otp,
          password: formData.password,
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading2(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setState(1);
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data));
        }
      })
      .catch((error) => {
        setLoading2(false);
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
    <>
      {alertGlobal && <AlertAdv />}

      {loading2 && <Loading />}

      <div className="hdrevvsfs52">
        <MetaData title={`Scholib || Login to your school `} />

        <div className="container89 flex1">
          <div className="login-main12">
            {loading && (
              <div
                className="spinner-container flex1"
                style={{ width: "100%" }}
              >
                <div
                  className="spinner-border text-primary my-4 loading452"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>{" "}
              </div>
            )}

            {!loading && (
              <div className="login_ui">
                {state === 1 && (
                  <>
                    <div className="image">
                      <img src={logo} alt="scholib logo" />
                      <p className="h6 text-center mt-3 text-secondary w600 f2">
                        Login to your school...
                      </p>

                      {error && (
                        <p className="h6 text-danger mt-4 errorElement shake">
                          Login Failed !!
                          <span className="w600 ms-2">{error.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="form">
                      {/* ui for role either staff or student  */}

                      <div className="role flex3">
                        <button
                          className={`h7 ${role === "Student" ? "active" : ""}`}
                          onClick={roleStudent}
                        >
                          <FontAwesomeIcon icon={faCertificate} /> &nbsp;&nbsp;
                          Student{" "}
                        </button>
                        <button
                          className={`h7 ${role === "Staff" ? "active" : ""}`}
                          onClick={roleStaff}
                        >
                          <FontAwesomeIcon icon={faCertificate} />
                          &nbsp;&nbsp; Staff{" "}
                        </button>
                      </div>

                      {/* end */}

                      <div className="text">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          placeholder="School Code"
                          ref={schoolCode}
                          value={formData.schoolCode}
                          onChange={(e) => {
                            const numericValue = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 6);
                            setFormData({
                              ...formData,
                              schoolCode: numericValue,
                            });
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/^[0-9]$/.test(e.key) ||
                              e.target.value.length >= 6
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>

                      <div className="text">
                         
                        <input
                          type="text"
                          pattern="[0-9]*"
                          placeholder="Login Id"
                          ref={loginId}
                          value={formData.loginId}
                          onChange={(e) => {
                            const numericValue = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 6);
                            setFormData({
                              ...formData,
                              loginId: numericValue,
                            });
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/^[0-9]$/.test(e.key) ||
                              e.target.value.length >= 6
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>

                      <div className="text">
                        <input
                          type="password"
                          placeholder="Password"
                          ref={password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              loginBtnRef.current.click();
                            }
                          }}
                        />
                      </div>

                      <div className="text">
                        <button
                          className="btn btn-primary"
                          ref={loginBtnRef}
                          onClick={handleSubmit}
                        >
                          Login
                        </button>
                      </div>
                    </div>

                    <div className="forgot flex1 mb-3">
                      <p className="h7" onClick={() => setState(2)}>
                        Forgot your password?
                      </p>
                    </div>
                  </>
                )}

                {state === 2 && (
                  <>
                    <div className="image">
                      <img
                        src={logo}
                        style={{ margin: "auto" }}
                        alt="scholib logo"
                      />
                      <p className="h6 text-center mt-3 text-danger w600 f2">
                        Reset Your Password
                      </p>

                      <p className="h7 text-center mt-3 text-secondary w400 f2">
                        An OTP will be sent to your associated email address
                      </p>

                      {error && (
                        <p className="h6 text-danger mt-4 errorElement shake">
                          Login Failed !!
                          <span className="w600 ms-2">{error.message}</span>
                        </p>
                      )}
                    </div>

                    <div className="form">
                      {/* ui for role either staff or student  */}

                      <div className="role flex3">
                        <button
                          className={`h7 ${role === "Student" ? "active" : ""}`}
                          onClick={roleStudent}
                        >
                          <FontAwesomeIcon icon={faCertificate} /> &nbsp;&nbsp;
                          Student{" "}
                        </button>
                        <button
                          className={`h7 ${role === "Staff" ? "active" : ""}`}
                          onClick={roleStaff}
                        >
                          <FontAwesomeIcon icon={faCertificate} />
                          &nbsp;&nbsp; Staff{" "}
                        </button>
                      </div>

                      {/* end */}

                      <div className="text">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          placeholder="School Code"
                          ref={schoolCode}
                          value={formData.schoolCode}
                          onChange={(e) => {
                            const numericValue = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 6);
                            setFormData({
                              ...formData,
                              schoolCode: numericValue,
                            });
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/^[0-9]$/.test(e.key) ||
                              e.target.value.length >= 6
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>

                      <div className="text">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          placeholder="Login Id"
                          ref={loginId}
                          value={formData.loginId}
                          onChange={(e) => {
                            const numericValue = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 6);
                            setFormData({
                              ...formData,
                              loginId: numericValue,
                            });
                          }}
                          onKeyPress={(e) => {
                            if (
                              !/^[0-9]$/.test(e.key) ||
                              e.target.value.length >= 6
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>

                      <div className="text">
                        <button
                          className="btn btn-primary"
                          ref={loginBtnRef}
                          onClick={() => {
                            setLoading2(true);
                            emailOTP();
                          }}
                        >
                          Email OTP
                        </button>
                      </div>
                    </div>

                    <div className="forgot flex1 mb-3">
                      <p className="h7" onClick={() => setState(1)}>
                        Proceed To Login
                      </p>
                    </div>
                  </>
                )}

                {state === 3 && (
                  <>
                    <div className="image">
                      <img src={logo} alt="scholib logo" />
                      <p className="h6 text-center mt-3 text-danger w600 f2">
                        Enter Your OTP
                      </p>
                    </div>

                    <div className="form">
                      <div className="text">
                        <input
                          type="text"
                          placeholder="OTP"
                          ref={otpInput}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              otp: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="text">
                        <button
                          className="btn btn-primary"
                          ref={loginBtnRef}
                          onClick={() => {
                            verifyOTP();
                          }}
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {state === 4 && (
                  <>
                    <div className="image">
                      <img src={logo} alt="scholib logo" />
                      <p className="h6 text-center mt-3 text-danger w600 f2">
                        Reset Your Password
                      </p>
                    </div>

                    <div className="form">
                      <div className="text">
                        <input
                          type="password"
                          placeholder="Enter Password"
                          ref={newPass1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="text">
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          ref={newPass2}
                        />
                      </div>

                      <div className="text">
                        <button
                          className="btn btn-primary"
                          ref={loginBtnRef}
                          onClick={() => {
                            resetPassword();
                          }}
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
