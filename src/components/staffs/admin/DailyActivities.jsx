import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ALERT_GLOBAL } from "../../../redux/AlertGlobalSlice";
import { GET_ACCOUNTS } from "../../../redux/HomeSlice";
import {
  Calendar,
  ReceiptIndianRupeeIcon as DollarSign,
  User,
  Clock,
  CreditCard,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

const DailyActivities = () => {
  const dispatch = useDispatch();
  const course = useSelector((state) => state.Course.course.payload.course);
  const school = useSelector((state) => state.Home.school.payload);
  const students = useSelector((state) => state.Students.students.payload);
  const date = useSelector((state) => state.Other.date);
  const accounts = useSelector((state) => state.Home.accounts);

  const [data, setData] = useState(accounts);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced date formatting function
  function formatDateToString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  // Enhanced date display function
  function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Enhanced time conversion
  function convertTo12Hour(time) {
    let [hours, minutes, seconds] = time.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Currency formatting
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  useEffect(() => {
    if (accounts.length === 0) {
      setIsLoading(true);
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
                  id: index + 1,
                  sn: index + 1,
                  date: formatDateToString(ind.date),
                  displayDate: formatDateDisplay(ind.date),
                  rawDate: ind.date,
                  amount: ind.amount,
                  approvedBy:
                    school.staffs.find((sta) => sta._id === ind.approvedBy)
                      ?.name || "Unknown",
                  method: ind.method,
                  time: convertTo12Hour(ind.time),
                  student:
                    students.find((sta) => sta._id === ind.student)?.name ||
                    "Unknown",
                };
              }
            );

            dispatch(GET_ACCOUNTS(paymentData));
            setData(paymentData);
            setFilteredData(paymentData);
          } else {
            dispatch(SET_ALERT_GLOBAL(response.data));
          }
          setIsLoading(false);
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
          setIsLoading(false);
        });
    } else {
      setData(accounts);
      setFilteredData(accounts);
    }
  }, []);

  useEffect(() => {
    let filtered = data;

    // Filter by month
    if (selectedMonth !== "All") {
      filtered = filtered.filter((entry) => {
        const [, month] = entry.date.split("/");
        return month === selectedMonth.padStart(2, "0");
      });
    }

    // Filter by day
    if (selectedDay !== "All") {
      filtered = filtered.filter((entry) => {
        const [, , day] = entry.date.split("/");
        return day === selectedDay.padStart(2, "0");
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.method.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [selectedMonth, selectedDay, data, searchTerm]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (key === "amount") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      if (key === "date") {
        return direction === "asc"
          ? new Date(a.rawDate) - new Date(b.rawDate)
          : new Date(b.rawDate) - new Date(a.rawDate);
      }
      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setFilteredData(sortedData);
  };

  // Create month options
  const monthOptions = [
    { label: "All Months", value: "All" },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: new Date(2024, i).toLocaleString("default", { month: "long" }),
      value: String(i + 1).padStart(2, "0"),
    })),
  ];

  // Create day options
  const dayOptions = [
    { label: "All Days", value: "All" },
    ...Array.from({ length: 31 }, (_, i) => ({
      label: `${i + 1}${
        i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"
      }`,
      value: String(i + 1).padStart(2, "0"),
    })),
  ];

  const CustomDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
        >
          <span className="text-gray-700">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = filteredData.length;
  const avgTransaction =
    totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  if (course?.length === 0) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Activities Yet
          </h3>
          <p className="text-gray-500">
            Daily activities will appear here once available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 lg:p-6 lg:bg-gray-50 min-h-screen">
      {/* Header */}
      {/* <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Daily Activities
        </h1>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Total Amount"
          value={formatCurrency(totalAmount)}
          color="bg-green-500"
        />
        <StatCard
          icon={CreditCard}
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          color="bg-blue-500"
        />
        <StatCard
          icon={User}
          title="Average Transaction"
          value={formatCurrency(avgTransaction)}
          color="bg-purple-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 mb-0">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <CustomDropdown
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Select Month"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day
            </label>
            <CustomDropdown
              options={dayOptions}
              value={selectedDay}
              onChange={setSelectedDay}
              placeholder="Select Day"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, staff, or method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading activities...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("sn")}
                      className="flex items-center hover:text-gray-700 transition-colors duration-150"
                    >
                      S.N
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center hover:text-gray-700 transition-colors duration-150"
                    >
                      Date
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("amount")}
                      className="flex items-center hover:text-gray-700 transition-colors duration-150"
                    >
                      Amount
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("approvedBy")}
                      className="flex items-center hover:text-gray-700 transition-colors duration-150"
                    >
                      Approved By
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("student")}
                      className="flex items-center hover:text-gray-700 transition-colors duration-150"
                    >
                      Student
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.sn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {row.displayDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        {row.approvedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.method === "Cash"
                            ? "bg-green-100 text-green-800"
                            : row.method === "Card"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {row.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        {row.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3">
                          {row.student.charAt(0).toUpperCase()}
                        </div>
                        {row.student}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyActivities;
