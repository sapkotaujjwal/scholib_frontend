import React, { useEffect, useRef, useState } from "react";
import "./tableEdit.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// Develoepr Note
// this component is specially optimized for bus fees so let it properly serve it's purpose and maybe it is used somewhere else too to.........

const TableEdit2 = ({
  data,
  fields,
  exclude = [],
  excludedKeys = [],
  function1 = () => {},
  busFees = false,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [myData, setMyData] = useState(data);
  const [editIndex, setEditIndex] = useState(null);

  const dispatch = useDispatch();
  const school = useSelector((state) => state.Home.school.payload);

  function selectRow(index) {
    if (index !== editIndex) {
      setEditIndex(null);
    }
  }

  function handleEditClick(e, index) {
    e.stopPropagation();

    if (busFees) {
      setBusFeeInfo(data[index]);
      return;
    }

    if (editIndex === index) {
      setEditIndex(null);
    } else {
      setEditIndex(index);
    }
  }

  function handleInputChange(event, index, field) {
    const { value } = event.target;
    setMyData((prevData) => {
      const newData = [...prevData];
      newData[index][field] = value; // Update the value of the field in the corresponding row
      return newData;
    });
  }

  useEffect(() => {
    setMyData(data);
  }, [data]);

  // this one is only for the bus fees edit

  const [loading, setLoading] = useState(false);

  const [busFeeInfo, setBusFeeInfo] = useState(null);
  const placeRef = useRef(null);
  const amountRef = useRef(null);

  let updateBusFees = () => {
    setLoading(true);
    updateBusRoute(busFeeInfo._id, busFeeInfo);
  };

  async function updateBusRoute(_id, obj) {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/busRoute/${_id}`,
        busFeeInfo,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          dispatch(SET_ALERT_GLOBAL(response.data));
          setBusFeeInfo(null);
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

  if (busFeeInfo) {
    document.body.classList.add("dshauda-hidden321");
  } else if (!busFeeInfo) {
    document.body.classList.remove("dshauda-hidden321");
  }

  return (
    <>
      {busFeeInfo && (
        <div className="main-outer8329">
          {loading && (
            <div
              className="cover-all flex1 bg-white"
              style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: "0",
                left: "0",
                zIndex: "99999",
              }}
            >
              <div
                className="spinner-container flex1"
                style={{ width: "100%", height: "80vh" }}
              >
                <div
                  className="spinner-border text-primary my-4 loading452"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )}

          <div className="faqMe flex1">
            <div className="inside-me123444">
              <p className="h5 w600 text-center">Edit Bus Fees</p>
              {/* <hr /> */}

              <div className="finalInside2323">
                <div className="eachinds2">
                  <p className="h6 w600 mb-2 ms-1"> Place : </p>
                  <input
                    type="text"
                    ref={placeRef}
                    value={busFeeInfo.place}
                    placeholder="Enter Place Name"
                    onChange={(event) =>
                      setBusFeeInfo({
                        ...busFeeInfo,
                        place: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="eachinds2">
                  <p className="h6 w600 mb-2 ms-1"> Amount (Rs.) : </p>
                  <input
                    type="number"
                    value={busFeeInfo.amount}
                    onChange={(event) => {
                      setBusFeeInfo({
                        ...busFeeInfo,
                        amount: event.target.value,
                      });
                    }}
                    placeholder="Enter Amount ..."
                    ref={amountRef}
                  />
                </div>
              </div>

              <hr />

              <div className="btns-3227 flex4">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setBusFeeInfo(null);
                  }}
                >
                  {" "}
                  Close{" "}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => updateBusFees()}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="heroTable0238">
        {!myData || myData.length < 1 ? (
          <p className="h6 text-secondary text-center"> No data Found... </p>
        ) : (
          <table>
            <thead>
              {/* header row of the legendary table  */}
              <tr>
                {!fields &&
                  Object.keys(myData[0]).map((key) => {
                    if (!exclude.includes(key) && !excludedKeys.includes(key)) {
                      return <th key={key}>{key}</th>;
                    }
                    return null;
                  })}

                {fields &&
                  fields.map((key) =>
                    key === "" ? (
                      <th
                        style={{ paddingLeft: "13px", paddingRight: "13px" }}
                        key={key}
                      >
                        {key}
                      </th>
                    ) : (
                      <th key={key}>{key}</th>
                    )
                  )}
              </tr>
            </thead>
            <tbody>
              {/* main row of the legendary table  */}
              {myData.map((row, index) => (
                <tr
                  key={index}
                  className={selectedRows.includes(index) ? "selected" : ""}
                  onClick={() => selectRow(index)}
                >
                  {Object.keys(row).map((key, i) => {
                    if (!exclude.includes(key) && !excludedKeys.includes(key)) {
                      return (
                        <td key={i}>
                          {editIndex === index &&
                          !exclude.includes(key) &&
                          !excludedKeys.includes(key) ? (
                            <input
                              className="input-hero1"
                              type="text"
                              value={row[key]}
                              onChange={(event) =>
                                handleInputChange(event, index, key)
                              }
                            />
                          ) : (
                            row[key]
                          )}
                        </td>
                      );
                    }
                    return null;
                  })}
                  <td
                    style={{
                      paddingLeft: "0px",
                      paddingRight: "0px",
                      cursor: "pointer",
                      borderRight: "0px",
                    }}
                    // Handle click for editing
                  >
                    <div
                      className="svg"
                      onClick={(e) => {
                        handleEditClick(e, index);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={editIndex === index ? faCheck : faPen}
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      cursor: "pointer",
                      borderLeft: "0px",
                    }}
                    onClick={(e) => {
                      // e.stopPropagation();

                      function1(myData[index]._id);

                      setEditIndex(null);

                      // setMyData((prevData) => {
                      //   const newData = [...prevData];
                      //   newData.splice(index, 1);
                      //   return newData;
                      // });
                    }}
                  >
                    <div className="svg">
                      <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TableEdit2;
