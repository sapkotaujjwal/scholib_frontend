import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import {
  ADD_SCHOOL_BUS,
  DELETE_SCHOOL_BUS,
  UPDATE_SCHOOL_BUS,
} from "../../../redux/HomeSlice";
import EditFees from "../../registerSchool/EditFees";
import {
  REMOVE_CONFIRM_GLOBAL,
  SET_CONFIRM_GLOBAL,
} from "../../../redux/ConfirmGlobalSlice";
import {
  DollarSign,
  Bus,
  Edit3,
  Trash2,
  Plus,
  MapPin,
  Users,
  TrendingUp,
  ChevronDown,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

const FeeStructure = () => {
  const school = useSelector((state) => state.Home.school.payload);
  const course = school.course;

  const [cClass, setCClass] = useState(course[0]);
  const [selectedClassId, setSelectedClassId] = useState(course[0]?._id);
  const [showAddBusForm, setShowAddBusForm] = useState(false);
  const [editingBusId, setEditingBusId] = useState(null);
  const [editBusData, setEditBusData] = useState({ location: "", amount: "" });

  const locationRef = useRef(null);
  const amountRef = useRef(null);

  const dispatch = useDispatch();

  // Update cClass whenever school.course changes or when fees are updated
  useEffect(() => {
    if (selectedClassId && course.length > 0) {
      const updatedClass = course.find((c) => c._id === selectedClassId);
      if (updatedClass) {
        setCClass(updatedClass);
      }
    }
  }, [course, selectedClassId]);

  async function deleteBusRoute(_id) {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/busRoute/${_id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(DELETE_SCHOOL_BUS(_id));
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

  async function addNewBusRoute() {
    if (!locationRef.current.value || amountRef.current.value < 0) {
      dispatch(
        SET_ALERT_GLOBAL({
          message: "Please provide location with amount",
          status: "error",
        })
      );
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/busRoute/new`,
        {
          location: locationRef.current.value,
          amount: amountRef.current.value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          dispatch(ADD_SCHOOL_BUS(response.data.data));

          locationRef.current.value = "";
          amountRef.current.value = "";
          setShowAddBusForm(false);
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

  async function updateBusRoute(_id, busData) {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/busRoute/${_id}`,
        {
          location: busData.location,
          amount: parseInt(busData.amount),
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          dispatch(UPDATE_SCHOOL_BUS(response.data.data));
          setEditingBusId(null);
          setEditBusData({ location: "", amount: "" });
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

  const [editFees, setEditFees] = useState(false);

  // Confirm Global is used Here
  const confirmGlobalStatusState = useSelector(
    (state) => state.ConfirmGlobal.status
  );

  const [idTodelete, setIdToDelete] = useState(null);

  useEffect(() => {
    if (confirmGlobalStatusState === "accepted") {
      deleteBusRoute(idTodelete);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    } else if (confirmGlobalStatusState === "declined") {
      setIdToDelete(null);
      dispatch(REMOVE_CONFIRM_GLOBAL());
    }
  }, [confirmGlobalStatusState, idTodelete, dispatch]);

  // End of confirm Global

  if (editFees) {
    document.body.classList.add("dshauda-hidden321");
  } else if (!editFees) {
    document.body.classList.remove("dshauda-hidden321");
  }

  // Handle fees update after EditFees component closes
  const handleEditFeesClose = () => {
    setEditFees(false);
    // This will trigger the useEffect that updates cClass
  };

  const totalAmount =
    cClass?.fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

  return (
    <>
      {editFees && (
        <EditFees data={cClass} closeFunction={handleEditFeesClose} />
      )}

      {!editFees && (
        <div className="min-h-screen lg:bg-gray-50 p-0 lg:p-6">
          {/* Header Stats */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Classes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {course.length}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Bus Routes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {school.busFee.filter((b) => b.active).length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <Bus className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Selected Class Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rs. {totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Class Fee Structure Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-4 lg:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Header Section */}
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-0">
                    Class Fee Structure
                  </h2>
                </div>

                {/* Controls Section */}
                {course.length > 0 && (
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 xs:gap-4 w-full sm:w-auto">
                    <div className="relative w-full xs:w-auto">
                      <select
                        value={selectedClassId}
                        onChange={(e) => {
                          const selectedCourse = course.find(
                            (c) => c._id === e.target.value
                          );
                          setCClass(selectedCourse);
                          setSelectedClassId(e.target.value);
                        }}
                        className="w-full xs:w-auto appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 xs:min-w-[160px]"
                      >
                        {course.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.class}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                      onClick={() => setEditFees(true)}
                      className="hidden xs:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl lg:flex items-center justify-center xs:justify-start space-x-2 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="whitespace-nowrap">Edit Fees</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {course.length === 0 ? (
              <div className="p-6 lg:p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No courses available</p>
              </div>
            ) : (
              <div className=" p-4 lg:p-6">
                <div className="grid gap-4 mb-6">
                  {cClass?.fees?.map((fee, index) => (
                    <div
                      key={fee._id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-md text-gray-900">
                          {fee.title}
                        </span>
                      </div>
                      <span className="text-md font-semibold text-gray-900">
                        Rs. {fee.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-md font-semibold text-gray-900">
                      Total Annual Amount
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      Rs. {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bus Fee Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 lg:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <Bus className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-0">
                    Bus Fee Management
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddBusForm(!showAddBusForm)}
                  className="hidden w-full bg-green-600 max-w-[300px] hover:bg-green-700 text-white px-4 py-2 rounded-lg lg:flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Route</span>
                </button>
              </div>
            </div>

            <div className="p-4 max-w-5xl mx-auto">
              {/* Add Bus Form */}
              {showAddBusForm && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add New Bus Route
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          ref={locationRef}
                          type="text"
                          placeholder="Enter location name"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Amount (Rs.)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          ref={amountRef}
                          type="text"
                          placeholder="Enter amount"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onKeyPress={(event) => {
                            const keyCode = event.keyCode || event.which;
                            const keyValue = String.fromCharCode(keyCode);
                            const numericRegex = /^[0-9]+$/;
                            if (!numericRegex.test(keyValue)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={addNewBusRoute}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Add Route</span>
                    </button>
                    <button
                      onClick={() => setShowAddBusForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Bus Routes List */}
              <div className="space-y-4">
                {school.busFee.filter((bus) => bus.active).length === 0 ? (
                  <div className="text-center py-12">
                    <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      No bus routes available
                    </p>
                  </div>
                ) : (
                  school.busFee
                    .filter((bus) => bus.active)
                    .map((bus) => (
                      <div
                        key={bus._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {editingBusId === bus._id ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={editBusData.location}
                              onChange={(e) =>
                                setEditBusData({
                                  ...editBusData,
                                  location: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Location"
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="number"
                                value={editBusData.amount}
                                onChange={(e) =>
                                  setEditBusData({
                                    ...editBusData,
                                    amount: e.target.value,
                                  })
                                }
                                className="w-full sm:w-auto flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Amount"
                              />
                              <button
                                onClick={() =>
                                  updateBusRoute(bus._id, editBusData)
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingBusId(null);
                                  setEditBusData({ location: "", amount: "" });
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {bus.location}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Monthly fee
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <span className="text-lg font-semibold text-gray-900">
                                Rs. {bus.amounts[0].amount.toLocaleString()}
                              </span>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingBusId(bus._id);
                                    setEditBusData({
                                      location: bus.location,
                                      amount: bus.amounts[0].amount.toString(),
                                    });
                                  }}
                                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setIdToDelete(bus._id);
                                    dispatch(
                                      SET_CONFIRM_GLOBAL({
                                        message:
                                          "Are you sure to delete this bus route ?",
                                      })
                                    );
                                  }}
                                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeeStructure;
