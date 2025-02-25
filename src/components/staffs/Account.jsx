import React, { useEffect, useState } from "react";
import "./account.scss";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import DataTable from "../layout/Table";
import axios from "axios";
import { SET_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { busPriceCalculator } from "../../tools/feeTools";
import AccountFilters from "./AccountFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

// Main Account Component
const Account = () => {
  const user = useSelector((state) => state.User.user.payload);
  const school = useSelector((state) => state.Home.school.payload);
  const schoolCode = school.schoolCode;
  const dispatch = useDispatch();
  const date = useSelector((state) => state.Other.date);
  const courses = useSelector((state) => state.Course.course.payload.course);

  // Enhanced filter state
  const [filters, setFilters] = useState({
    name: "",
    minPaid: "",
    maxPaid: "",
    minUnpaid: "",
    maxUnpaid: "",
    minBus: "",
    maxBus: "",
    minFine: "",
    maxFine: "",
    minDiscount: "",
    maxDiscount: "",
    hasBusFee: false,
    hasFine: false,
    hasDiscount: false,
    hasUnpaid: false,
  });

  const [currentClass, setCurrentClass] = useState(
    courses.length > 0 ? courses[0] : null
  );

  function getAllSectionIds() {
    if (currentClass === null) return [];
    let sectionIds = [];
    currentClass.groups.forEach((group) => {
      group.sections.forEach((section) => {
        sectionIds.push(section);
      });
    });
    return sectionIds;
  }

  const [allSections, setAllSections] = useState(
    getAllSectionIds(courses.find((crc) => crc._id === currentClass))
  );

  const [currentSection, setCurrentSection] = useState(allSections[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    setAllSections(getAllSectionIds());
  }, [currentClass]);

  useEffect(() => {
    setCurrentSection(allSections[0]);
  }, [allSections]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Enhanced filter logic
  useEffect(() => {
    let filtered = students.filter((student) => {
      const matchesName = student.Name.toLowerCase().includes(
        filters.name.toLowerCase()
      );

      const matchesPaid =
        (!filters.minPaid || student.Paid >= Number(filters.minPaid)) &&
        (!filters.maxPaid || student.Paid <= Number(filters.maxPaid));

      const matchesUnpaid =
        (!filters.minUnpaid || student.UnPaid >= Number(filters.minUnpaid)) &&
        (!filters.maxUnpaid || student.UnPaid <= Number(filters.maxUnpaid));

      const matchesBus =
        (!filters.minBus || student.Bus >= Number(filters.minBus)) &&
        (!filters.maxBus || student.Bus <= Number(filters.maxBus));

      const matchesFine =
        (!filters.minFine || student.Fine >= Number(filters.minFine)) &&
        (!filters.maxFine || student.Fine <= Number(filters.maxFine));

      const matchesDiscount =
        (!filters.minDiscount ||
          student.Discount >= Number(filters.minDiscount)) &&
        (!filters.maxDiscount ||
          student.Discount <= Number(filters.maxDiscount));

      const matchesQuickFilters =
        (!filters.hasBusFee || student.Bus > 0) &&
        (!filters.hasFine || student.Fine > 0) &&
        (!filters.hasDiscount || student.Discount > 0) &&
        (!filters.hasUnpaid || student.UnPaid > 0);

      return (
        matchesName &&
        matchesPaid &&
        matchesUnpaid &&
        matchesBus &&
        matchesFine &&
        matchesDiscount &&
        matchesQuickFilters
      );
    });

    setFilteredStudents(filtered);
  }, [filters, students]);

  useEffect(() => {
    if (!currentSection) {
      setLoading(false);
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/adminStudent/${schoolCode}/account/${currentSection._id}`,
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          let data = response.data.data;
          setStudents(
            data.map((each, index) => {
              let student = each.session[0];
              return {
                SN: index + 1,
                Name: each.name,
                Paid: student.paymentHistory.reduce(
                  (acc, hist) => acc + hist.amount,
                  0
                ),
                UnPaid: findAmountLeft(student),
                Bus: busPriceCalculator(
                  date,
                  student.bus,
                  school.busFee,
                  "2081-01-01"
                ),
                Fine: student.fine.reduce((acc, fine) => acc + fine.amount, 0),
                Discount: student.discount.reduce(
                  (acc, discount) => acc + discount.amount,
                  0
                ),
              };
            })
          );
        } else {
          dispatch(SET_ALERT_GLOBAL(response.data.data));
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
  }, [currentSection]);

  function findTotalFee(studentMainData) {
    let totalAmt = studentMainData.previousLeft;
    let cCourse22 = currentClass;

    cCourse22.fees.forEach((elem) => {
      totalAmt += elem.amount;
    });

    studentMainData.fine.forEach((elem) => {
      totalAmt += elem.amount;
    });

    studentMainData.discount.forEach((elem) => {
      totalAmt -= elem.amount;
    });

    return (
      totalAmt +
      busPriceCalculator(date, studentMainData.bus, school.busFee, "2081-01-01")
    );
  }

  function findAmountLeft(studentMainData) {
    return (
      findTotalFee(studentMainData) -
      studentMainData.paymentHistory.reduce((acc, hist) => acc + hist.amount, 0)
    );
  }

  return (
    <div className="accountAdmin2838">
      <MetaData
        title={`${user && user.role ? "Staff" : "Student"} || Account`}
      />

      <div className="inside-content">
        <div className="flex flex-col p-4 bg-white shadow1 rounded-lg mx-[2%] mb-4">
          <p className="text-xl font-semibold text-[#133189]">Account</p>
          <p className="text-sm text-gray-600">{school.name}</p>
        </div>

        {courses.length === 0 ? (
          <div className="mx-[2%] my-8">
            <hr />
            <p className="text-center text-lg font-medium text-gray-600 my-4">
              No courses available
            </p>
            <hr />
          </div>
        ) : (
          <>
            <div className="bar-control flex items-center gap-4 my-4 bg-gray-50 shadow1 rounded-md p-4 mx-[2%]">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Class :</p>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] text-center"
                    value={currentClass?._id}
                    onChange={(e) => {
                      setCurrentClass(
                        courses.find((ind) => ind._id === e.target.value)
                      );
                    }}
                  >
                    {courses.map((course) => (
                      <option key={course._id} value={course._id} className="text-left">
                        {course.class}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FontAwesomeIcon icon={faCaretDown} className="mx-3" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Section :</p>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] text-center"
                    value={currentSection?._id}
                    onChange={(e) => {
                      setCurrentSection(
                        allSections.find((ind) => ind._id === e.target.value)
                      );
                    }}
                  >
                    {allSections.map((section) => (
                      <option key={section._id} value={section._id} className="text-left">
                        {section.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FontAwesomeIcon icon={faCaretDown} className="mx-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="mx-[2%] mb-4">
              <AccountFilters filters={filters} setFilters={setFilters} />
            </div>

            <section className="shadow1 rounded-md mx-[2%]">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="custom-scrollbar overflow-x-auto">
                  <DataTable
                    data={filteredStudents.map((each, index) => {
                      return {
                        SN: index + 1,
                        Name: each.Name,
                        Paid: each.Paid,
                        UnPaid: each.UnPaid,
                        Bus: each.Bus,
                        Fine: each.Fine,
                        Discount: each.Discount,
                      };
                    })}
                    exclude={["_id"]}
                    fields={[
                      "SN",
                      "Name",
                      "Paid",
                      "UnPaid",
                      "Bus",
                      "Fine",
                      "Discount",
                    ]}
                    noSelect={true}
                    center={false}
                  />
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
