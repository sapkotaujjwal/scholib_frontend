import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import Create from "./Create";
import { SET_BIGIMAGE } from "../../redux/BigImageSlice";

// Confirmation Dialog Component
const ConfirmDialog = ({ onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 bg-gray-300/40 backdrop-blur-md flex items-center justify-center"
    style={{ zIndex: 10000 }}
  >
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 className="text-xl font-semibold mb-4 ">Confirm Update Deletion</h3>
      <p className="text-gray-600 mb-6 ">
        Are you sure you want to delete this update?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const Update = ({ update }) => {
  const school = useSelector((state) => state.Home.school.payload);
  const user = useSelector((state) => state.User.user.payload);
  const bigImage = useSelector((state) => state.BigImage.bigImage);
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateDeletion = () => {
    const id = update._id;
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/staff/${school.schoolCode}/update/${id}`,
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          setVisible(false);
          dispatch(
            SET_ALERT_GLOBAL({
              status: response.data.status,
              message: response.data.message,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          SET_ALERT_GLOBAL({
            status: "error",
            message: "Failed to delete update",
          })
        );
      });
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
    document.body.classList.add("overflow-hidden");
  };

  // Handle closing edit mode
  const handleCloseEdit = () => {
    setIsEditing(false);
    document.body.classList.remove("overflow-hidden");
  };

  if (!visible) return null;

  let author = school.staffs.find((staff) => staff._id === update.author._id);

  if (bigImage || showConfirm || isEditing) {
    document.body.classList.add("dshauda-hidden");
  } else {
    document.body.classList.remove("dshauda-hidden");
  }

  function loadBigImage(data) {
    if (update.images && update.images.length >= 1) {
      let images_array = update.images.map((obj) => obj.secure_url);
      let object = {
        index: data,
        data: images_array,
      };
      dispatch(SET_BIGIMAGE(object));
    }
  }

  return (
    <>
      {isEditing && (
        <Create data={update} id={update._id} closeFunction={handleCloseEdit} />
      )}

      {showConfirm && (
        <ConfirmDialog
          onConfirm={() => {
            handleUpdateDeletion();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={
                school.logo.secure_url || "https://scholib.com/images/logo.png"
              }
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-lg mb-0 font-semibold text-gray-800">
                {author.name}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <span>Founder & CEO of {school.sName}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {user &&
              (user.role === "Administrator" ||
                user.role === "Coordinator" ||
                update.author._id === user._id) && (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full "
                >
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="text-gray-600 text-lg"
                  />
                </button>
              )}

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow1 z-50">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <FontAwesomeIcon icon={faPen} className="mr-3" />
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-3" />
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Posted on {update.date} at {update.time}
          </p>
          <p className="text-sm text-gray-600">Visible to : Everyone</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-800">{update.title}</p>

          {update.images && update.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {update.images.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1">
                  <img
                    src={image.secure_url}
                    alt={`Update image ${index + 1}`}
                    onClick={() => loadBigImage(index)}
                    className="object-cover w-full h-full rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Update;
