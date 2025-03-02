import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faLock } from "@fortawesome/free-solid-svg-icons";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { LOGOUT_USER_SUCCESS } from "../../redux/UserSlice";
import userImg from ".././../images/user.png";

const SecurityComponent = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const dispatch = useDispatch();
  const schoolCode = school.schoolCode;

  const newPasswordref = useRef(null);
  const newPasswordref2 = useRef(null);
  const oldPasswordref = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const extractDeviceInfo = (userAgentString) => {
    const regex = /\((.*?)\)/;
    const matches = userAgentString.match(regex);
    return matches && matches.length >= 2 ? matches[1] : "Device info not found";
  };

  const logOutDevice = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/mutual/logout/${schoolCode}/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch(LOGOUT_USER_SUCCESS(id));
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
  };

  const changePassword = () => {
    const oldPassword = oldPasswordref.current.value;
    const newPassword = newPasswordref.current.value;
    const confirmPassword = newPasswordref2.current.value;

    const setAllBlank = () => {
      oldPasswordref.current.value = "";
      newPasswordref.current.value = "";
      newPasswordref2.current.value = "";
    };

    if (oldPassword.length < 8) {
      return alert("Old password is of atleast 8 characters");
    }
    if (newPassword.length < 8) {
      return alert("New password should be of atleast 8 characters");
    }
    if (newPassword !== confirmPassword) {
      return alert("New password and confirm new password does not match");
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/mutual/security/${schoolCode}/change/password`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        dispatch(SET_ALERT_GLOBAL(response.data));
        setAllBlank();
      })
      .catch((error) => {
        const data = {
          message: error.message,
          status: "Cannot communicate with the server",
        };
        if (error.response) {
          dispatch(SET_ALERT_GLOBAL(error.response.data));
        } else {
          dispatch(SET_ALERT_GLOBAL(data));
        }
        setAllBlank();
      });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 applyBootstrap">
      <div className=" mx-auto sm:px-0 md:px-4">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <img
                src={user.title ? (user.pPhoto ? user.pPhoto.secure_url : userImg) : 
                     (user.photo1 ? user.photo1.secure_url : userImg)}
                alt=""
                className="w-32 h-32 rounded-full border-4 border-white mx-auto object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold ms-1 text-gray-700  mb-1">{user.name}</h2>
            <p className="text-gray-500 ms-1 text-sm">{user.title ? "Staff" : "Student"}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">School Code</p>
                <p className="text-gray-800">{user.schoolCode}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">Login ID</p>
                <p className="text-gray-800">{user.loginId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faLock} className="text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Current Password
              </label>
              <input
                type="password"
                ref={oldPasswordref}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">
                New Password
              </label>
              <input
                type="password"
                ref={newPasswordref}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                ref={newPasswordref2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button className="w-1/2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button
                onClick={changePassword}
                className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Login Sessions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faHashtag} className="text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Login Sessions</h3>
          </div>

          <div className="space-y-4">
            {user.tokens.map((token) => (
              <div key={token._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 mb-1 me-4">
                    {extractDeviceInfo(token.device)}
                  </p>
                </div>
                <button
                  onClick={() => logOutDevice(token._id)}
                  className="px-4 py-2 bg-red-200 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm"
                >
                  Log Out
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityComponent;