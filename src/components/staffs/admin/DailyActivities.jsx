import React, { useEffect, useState } from "react";
import "./dailyActivities.scss";
import Dropdown from "../../basicComponents/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../layout/Table";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import axios from "axios";
import { GET_ACCOUNTS } from "../../../redux/HomeSlice";

const DailyActivities = () => {
  const dispatch = useDispatch();
  const course = useSelector((state) => state.Course.course.payload.course);
  const school = useSelector((state) => state.Home.school.payload);
  const students = useSelector((state) => state.Students.students.payload);
  const date = useSelector((state) => state.Other.date);
  const [year, month, day] = date.split("-");

  const accounts = useSelector((state) => state.Home.accounts);

  const [data, setData] = useState(accounts);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedDay, setSelectedDay] = useState(day);

  function formatDateToString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  useEffect(() => {
    if (accounts.length === 0) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/admin/${school.schoolCode}/accounts/info`,
          {
            params: {},
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.success) {
            const paymentData = response.data.data.paymentHistory.map(
              (ind, index) => {
                return {
                  sn: index + 1,
                  date: formatDateToString(ind.date), // in year/month/day format
                  amount: ind.amount,
                  approvedBy: school.staffs.find(
                    (sta) => sta._id === ind.approvedBy
                  ).name,
                  method: ind.method,
                  time: convertTo12Hour(ind.time),
                  student: students.find((sta) => sta._id === ind.student).name,
                };
              }
            );

            dispatch(GET_ACCOUNTS(paymentData));
            setData(paymentData);
            setFilteredData(paymentData);
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
  }, []);

  useEffect(() => {
    // Filter data based on selected month and day
    let filtered = data;

    if (selectedMonth !== "All") {
      filtered = filtered.filter((entry) => {
        const [, month] = entry.date.split("/"); // extract the month part
        return month === selectedMonth.padStart(2, "0"); // Ensure format matches (e.g., '03' for March)
      });
    }

    if (selectedDay !== "All") {
      filtered = filtered.filter((entry) => {
        const [, , day] = entry.date.split("/"); // extract the day part
        return day === selectedDay.padStart(2, "0"); // Ensure format matches (e.g., '03' for 3rd)
      });
    }

    setFilteredData(filtered);
  }, [selectedMonth, selectedDay, data]);

  function convertTo12Hour(time) {
    let [hours, minutes, seconds] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // Create month options from 1 to 12, plus "All"
  const monthOptions = [
    { label: "All", value: "All" }, // Add "All" as an option
    ...Array.from({ length: 12 }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1).padStart(2, "0"), // Ensure it's two digits (e.g., '01', '02')
    })),
  ];

  // Create day options from 1 to 31, plus "All"
  const dayOptions = [
    { label: "All", value: "All" }, // Add "All" as an option
    ...Array.from({ length: 31 }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1).padStart(2, "0"), // Ensure it's two digits (e.g., '01', '02')
    })),
  ];

  return (
    <div className="daily-activities278">
      <div className="texr21">
        <p className="h4 w600"> Daily Activities </p>
      </div>

      {course.length === 0 && (
        <>
          <hr />
          <p className="h6 text-center mx-2 text-secondary my-3">
            No info available
          </p>
          <hr />
        </>
      )}

      {course && course.length > 0 && (
        <div className="dsadasd12xa4 my-3 pb-3">
          <div
            className="for-dropdown flex1 mb-2 custom-scrollbar"
            style={{ flexWrap: "wrap" }}
          >
            <div className="vInnsds flex1 px-2 py-1">
              <p className="h6 w500 pe-2 pb-0 mb-0"> Month : </p>
              <Dropdown
                onSelect={(a, b, c) => setSelectedMonth(c)}
                title={selectedMonth || "Select Month"}
                options={monthOptions}
              />
            </div>

            <div className="vInnsds flex1 px-2 py-1">
              <p className="h6 w500 pe-2 pb-0 mb-0"> Day : </p>
              <Dropdown
                onSelect={(a, b, c) => setSelectedDay(c)}
                title={selectedDay || "Select Day"}
                options={dayOptions}
              />
            </div>
          </div>

          {filteredData.length ===0 && 
          <>
          <hr className="m-0"/>
          </>
          }

          <div className="custom-scrollbar py-3" style={{ overflow: "auto" }}>
            <DataTable
              fields={[
                "S.N",
                "Date",
                "Amount",
                "Initiated By",
                "Method",
                "Time",
                "Student",
              ]}
              data={filteredData.map(({ ...data }) => {
                delete data._id;
                return data;
              })}
            />
          </div>


          {filteredData.length ===0 && 
          <>
          <hr className="m-0"/>
          </>
          }


        </div>
      )}
    </div>
  );
};

export default DailyActivities;
