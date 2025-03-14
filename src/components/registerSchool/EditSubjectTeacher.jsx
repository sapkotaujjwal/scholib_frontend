import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  POST_CREATE_COURSE,
  ERROR_REMOVE,
  POST_CREATE_COURSE_SUCCESS,
  POST_CREATE_COURSE_FAIL,
} from "../../redux/CreateCourse";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";

const EditSubjectTeacher = ({
  data,
  id,
  closeFunction = () => {},
  handleSuccess = () => {},
}) => {
  const [currentSection, setCurrentSection] = useState(data);
  const error = useSelector((state) => state.CreateCourse.error.payload);
  const loading = useSelector((state) => state.CreateCourse.loading);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const dispatch = useDispatch();

  const staffs12 = school.staffs.map((obj) => ({
    label: `${obj.name} (${obj.title})`,
    value: obj._id,
    _id: obj._id,
    name: obj.name,
    role: obj.role,
    title: obj.title,
    status: obj.status,
    qualification: obj.qualification,
  }));

  const availableStaffs = staffs12.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const updateTeacher = (subjectId, newTeacherId) => {
    const newTeacher = staffs12.find((staff) => staff._id === newTeacherId);
    setCurrentSection((prevState) => ({
      ...prevState,
      subjects: prevState.subjects.map((subject) =>
        subject._id === subjectId
          ? { ...subject, teacher: newTeacher }
          : subject
      ),
    }));
  };

  const handleSubmit = async () => {
    dispatch(POST_CREATE_COURSE());

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/${schoolCode}/section/updateSubjectTeachers`,
        currentSection.subjects,
        {
          params: {
            sectionId: currentSection.sectionId,
            section: currentSection._id,
          },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        dispatch(POST_CREATE_COURSE_SUCCESS(response.data.data));
        dispatch(SET_ALERT_GLOBAL(response.data));
        handleSuccess(currentSection);
        closeFunction();
      } else {
        dispatch(POST_CREATE_COURSE_FAIL(response.data.data));
      }
    } catch (error) {
      const data = {
        message: error.message,
        status: "Cannot communicate with the server",
      };

      if (error.response) {
        dispatch(POST_CREATE_COURSE_FAIL(error.response.data));
      } else {
        dispatch(POST_CREATE_COURSE_FAIL(data));
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:p-0 md:p-4"
      style={{ zIndex: 9991 }}
    >
      <div className="bg-white rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {loading && (
          <div className="flex items-center justify-center h-80">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-500 text-4xl"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            <p className="font-bold">{error.status}</p>
            <p>{error.message}</p>
            <button
              onClick={() => dispatch(ERROR_REMOVE())}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <h2 className="text-lg font-semibold text-center p-6 py-4 border-b">
              Edit Subject Teachers
            </h2>

            <div className="overflow-y-auto flex-1 sm:p-1 md:p-4">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left font-semibold">
                      Subject
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Teacher
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentSection.subjects.map((sub) => (
                    <tr key={sub._id} className="border-b">
                      <td className="py-3 px-4">{sub.subject}</td>
                      <td className="py-3 px-4">
                        <select
                          className="w-full p-2 border rounded"
                          value={sub.teacher?._id || ""}
                          onChange={(e) =>
                            updateTeacher(sub._id, e.target.value)
                          }
                        >
                          <option value="">Select Teacher</option>
                          {availableStaffs.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                              {staff.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={closeFunction}
                className="bg-gray-500 text-white px-6 py-2 rounded mr-2 w-[50%]"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2 rounded w-[50%]"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditSubjectTeacher;
