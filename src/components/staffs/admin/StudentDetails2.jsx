import React from "react";


const StudentDetails2 = ({ _id, students, year, closeFunction }) => {
  return (
    <div className="flex">
      {/* <!-- Sidebar --> */}

      <aside className="hidden lg:block w-64 bg-gray-800 text-white h-screen p-5 fixed top-0 left-0 shadow-lg pt-20">
        <h2 className="text-2xl font-bold mb-8 text-white">Student Details</h2>
        <ul>
          <li className="mb-4 p-3 rounded-md bg-blue-700 text-gray-300 cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white">
            <i className="fas fa-chart-line mr-3"></i> Dashboard
          </li>
          <li className="mb-4 p-3 rounded-md bg-gray-700 text-gray-300 cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white">
            <i className="fas fa-user-circle mr-3"></i> Profile
          </li>
          <li className="mb-4 p-3 rounded-md bg-gray-700 text-gray-300 cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white">
            <i className="fas fa-wallet mr-3"></i> Payments
          </li>
          <li className="mb-4 p-3 rounded-md bg-gray-700 text-gray-300 cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:text-white">
            <i className="fas fa-book mr-3"></i> Library
          </li>
        </ul>
      </aside>

        <div className="lg:ps-64 w-full">
        <main className="flex-1 p-2 md:p-5 lg:p-10">
          {/* <!-- Student Profile --> */}

          <div className="relative flex justify-end mx-3 mb-3">
            <button className="block lg:hidden absolute left-0 bg-gray-300 p-2 px-8 rounded-md hover:bg-gray-400 hover:text-gray-100 text-sm">
              Open
            </button>

            <button
              className="bg-gray-300 p-2 px-8 rounded-md hover:bg-gray-400 hover:text-gray-100 text-sm"
              onClick={() => closeFunction()}
            >
              Close
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg mb-5">
            <h3 className="text-xl font-bold">Student Profile</h3>
            <div className="flex items-center mt-3 flex-wrap">
              <div className="w-full md:w-[180px] my-2 md:mr-4 overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Student Avatar"
                  className="rounded-md w-full"
                />
              </div>
              <div className="my-2 mx-auto md:mx-0">
                <p className="text-lg font-semibold">John Doe</p>
                <p className="text-gray-600">johndoe@example.com</p>
                <p className="text-gray-600">ID : 673599</p>
                <p className="text-gray-600">Gender : Male</p>
                <p className="text-gray-600">
                  Class : 10 | Section : A | Group : Science
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white flex justify-end p-5 rounded-lg shadow-lg mb-5">
            <button className="text-sm bg-gray-300 hover:bg-gray-400 p-2 px-5 mx-2 rounded-sm hover:text-white">
              Bus Info
            </button>
            <button className="text-sm bg-gray-300 hover:bg-gray-400 p-2 px-5 mx-2 rounded-sm hover:text-white">
              Update Class
            </button>

            <select className="border border-gray-300 rounded-sm p-2 px-4 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="class1">Class 1</option>
              <option value="class2">Class 2</option>
              <option value="class3">Class 3</option>
            </select>
          </div>

          <section>
            {/* <!-- Dashboard --> */}

            <div className="">
              <div className="bg-white p-2 lg:p-6 rounded-lg shadow-lg mb-5">
                {/* <!-- Exam Results --> */}
                <section>
                  {/* <!-- Profile Information Section --> */}
                  <div className="bg-white p-2 lg:p-6 rounded-lg shadow-lg mb-5">
                    {/* <!-- Exam Results Section with Dropdown --> */}
                    <div className="lg:bg-gray-50 p-2 lg:p-5 rounded-lg shadow-sm mb-5">
                      <h3 className="text-lg font-bold mb-3">Exam Results</h3>
                      <div className="space-y-4">
                        {/* <!-- Dropdown to Select Term --> */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Select Term :</span>
                          <select className="p-2 border border-gray-300 rounded-md w-40">
                            <option value="term1">Term 1</option>
                            <option value="term2">Term 2</option>
                            <option value="term3">Term 3</option>
                          </select>
                        </div>

                        {/* <!-- Results for the Selected Term --> */}
                        <div id="term1" className="result-term">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Term 1 :</span>
                            <span className="font-semibold">85%</span>
                          </div>
                        </div>
                        <div id="term2" className="result-term hidden">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Term 2:</span>
                            <span className="font-semibold">90%</span>
                          </div>
                        </div>
                        <div id="term3" className="result-term hidden">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Term 3:</span>
                            <span className="font-semibold">88%</span>
                          </div>
                        </div>
                      </div>

                      {/* <!-- Marks Table --> */}
                      <div className="bg-gray-50 mt-3 p-5 rounded-lg shadow-sm mb-5 overflow-auto">
                        <table className="min-w-full table-auto border-collapse">
                          <thead>
                            <tr>
                              <th className="border px-4 py-2 text-left">SN</th>
                              <th className="border px-4 py-2 text-left">
                                Subject
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Total Marks
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Pass Marks
                              </th>
                              <th className="border px-4 py-2 text-left">
                                Obtained Marks
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">1</td>
                              <td className="border px-4 py-2">Math</td>
                              <td className="border px-4 py-2">100</td>
                              <td className="border px-4 py-2">35</td>
                              <td className="border px-4 py-2">80</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">2</td>
                              <td className="border px-4 py-2">Science</td>
                              <td className="border px-4 py-2">100</td>
                              <td className="border px-4 py-2">40</td>
                              <td className="border px-4 py-2">75</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2">3</td>
                              <td className="border px-4 py-2">English</td>
                              <td className="border px-4 py-2">100</td>
                              <td className="border px-4 py-2">35</td>
                              <td className="border px-4 py-2">90</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <button className="w-full mb-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 mt-3">
                        Edit Result
                      </button>
                    </div>
                  </div>
                </section>

                {/* <!-- Bus Info --> */}
                <div className="bg-white p-3 md:p-4 lg:p-8 rounded-lg shadow-lg mb-6 mx-auto border border-gray-200">
                  <h3 className="text-3xl font-semibold text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Bus Information
                  </h3>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col items-left">
                      <span className="text-sm text-gray-700 font-medium">
                        Place
                      </span>
                      <span className="text-lg text-gray-900">Kathmandu</span>
                    </div>

                    <div className="flex flex-col items-left">
                      <span className="text-sm text-gray-700 font-medium">
                        Start
                      </span>
                      <span className="text-lg text-gray-900">2025-02-26</span>
                    </div>

                    <div className="flex flex-col items-left">
                      <span className="text-sm text-gray-700 font-medium">
                        Fare
                      </span>
                      <span className="text-lg text-gray-900">Rs. 200</span>
                    </div>
                  </div>
                </div>

                {/* <!-- Bus History Table --> */}
                <div className="bg-gray-50 p-2 py-5 lg:p-5 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    Bus History
                  </h4>
                  <div className="overflow-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                            Start
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                            Route
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                            Fare
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                            End
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-2 text-sm text-gray-800">
                            2025-02-20
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            Kathmandu to Pokhara
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            Rs 500
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            2025-02-20
                          </td>
                        </tr>
                        <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-2 text-sm text-gray-800">
                            2025-02-18
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            Kathmandu to Bhaktapur
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            Rs 300
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            2025-02-18
                          </td>
                        </tr>
                        <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-2 text-sm text-gray-800">
                            2025-02-15
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            Kathmandu to Chitwan
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            Rs 700
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            2025-02-15
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl shadow-sm p-2 py-5 md:p-4 lg:p-6 bg-gray-50 mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Student Attendance
                  </h2>

                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* <!-- Calendar --> */}
                    <div className="flex-1 bg-white rounded-md min-w-[50%] p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">March 2025</h3>
                        <div className="flex space-x-4">
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 19l-7-7 7-7"
                              ></path>
                            </svg>
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {/* <!-- Days of the week --> */}
                        <div className="text-center font-semibold">Sun</div>
                        <div className="text-center font-semibold">Mon</div>
                        <div className="text-center font-semibold">Tue</div>
                        <div className="text-center font-semibold">Wed</div>
                        <div className="text-center font-semibold">Thu</div>
                        <div className="text-center font-semibold">Fri</div>
                        <div className="text-center font-semibold">Sat</div>

                        {/* <!-- Days in month --> */}
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          1
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          2
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          3
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          4
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          5
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          6
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center hover:bg-blue-50 bg-red-500 text-white">
                          7
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center  hover:bg-blue-50 bg-red-500 text-white">
                          8
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          9
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          10
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          11
                        </button>
                        <button className="aspect-square text-white rounded-lg p-2 text-center bg-red-500 hover:bg-blue-50">
                          12
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          13
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          14
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          15
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          16
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          17
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          18
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          19
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          20
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          21
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          22
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          23
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          24
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          25
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          26
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          27
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          28
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          29
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          30
                        </button>
                        <button className="aspect-square rounded-lg p-2 text-center bg-gray-50 hover:bg-blue-50">
                          31
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-2 py-6 md:p-4 lg:p-6 min-w-[50%]">
                      <div className="flex flex-col gap-8">
                        {/* <!-- Working Days Section --> */}
                        <div className="md:bg-gray-50 rounded-xl p-3 py-8 md:p-8 mb-8 md:shadow-lg">
                          <div className="flex justify-center items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                              Summary
                            </h3>
                          </div>

                          <div className="">
                            {/* <!-- Total Working Days --> */}
                            <div className="bg-blue-100 p-3 rounded-xl shadow-md flex flex-col items-center space-y-1">
                              <h4 className="text-sm font-semibold text-gray-800">
                                Total Working Days
                              </h4>
                              <p className="text-xl font-semibold text-blue-600">
                                300
                              </p>
                            </div>

                            {/* <!-- Absent Days --> */}
                            <div className="bg-red-100 p-3 rounded-xl shadow-md flex flex-col items-center space-y-1 my-4">
                              <h4 className="text-sm font-semibold text-gray-800">
                                Absent Days
                              </h4>
                              <p className="text-xl font-semibold text-red-600">
                                200
                              </p>
                            </div>

                            {/* <!-- Present Days --> */}
                            <div className="bg-green-100 p-3 rounded-xl shadow-md flex flex-col items-center space-y-1">
                              <h4 className="text-sm font-semibold text-gray-800">
                                Present Days
                              </h4>
                              <p className="text-xl font-semibold text-green-600">
                                100
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- profile --> */}

            <div className="bg-white p-3 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
              <div className="">
                {/* <!-- Contact Info --> */}
                <div className="bg-gray-50 p-2 py-4 md:p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-base font-semibold mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">johndoe@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">+1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">
                        1234 Elm Street, City, Country
                      </span>
                    </div>
                  </div>
                </div>

                {/* <!-- Course Info --> */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-base font-semibold mb-2">
                    Course Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Class:</span>
                      <span className="font-medium">10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group:</span>
                      <span className="font-medium">A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Section:</span>
                      <span className="font-medium">B</span>
                    </div>
                  </div>
                </div>

                {/* <!-- Parents' Info --> */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-base font-semibold mb-2">
                    Parent Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Father's Name:</span>
                      <span className="font-medium">Richard Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mother's Name:</span>
                      <span className="font-medium">Jane Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Father's Profession:
                      </span>
                      <span className="font-medium">Engineer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Mother's Profession:
                      </span>
                      <span className="font-medium">Teacher</span>
                    </div>
                  </div>
                </div>

                {/* <!-- GPA and Previous School Info --> */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-base font-semibold mb-2">
                    Academic Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">GPA:</span>
                      <span className="font-medium">3.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous School:</span>
                      <span className="font-medium">ABC High School</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Previous School Address:
                      </span>
                      <span className="font-medium">
                        5678 Oak Street, City, Country
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Profile Photos --> */}
              <div className="bg-gray-50 p-2 py-5 lg:p-5 rounded-lg shadow-sm mb-5">
                <h3 className="text-lg font-bold mb-3">Profile Photos</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <img
                    src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/Carens/x-line/2024/Carens_Digital_m.jpg"
                    alt="Profile Photo 1"
                    className="rounded-lg w-[100%] h-[220px] object-cover"
                  />

                  <img
                    src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/Carens/x-line/2024/Carens_Digital_m.jpg"
                    alt="Profile Photo 2"
                    className="rounded-lg w-[100%] h-[220px] object-cover"
                  />

                  <img
                    src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/Carens/x-line/2024/Carens_Digital_m.jpg"
                    alt="Profile Photo 3"
                    className="rounded-lg w-[100%] h-[220px] object-cover"
                  />

                  <img
                    src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/Carens/x-line/2024/Carens_Digital_m.jpg"
                    alt="Profile Photo 4"
                    className="rounded-lg w-[100%] h-[220px] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* <!-- Payments  --> */}
            <div className="bg-white p-2 md:p-4 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
              {/* <!-- Payment Summary --> */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="text-xl font-bold text-blue-700">$1000</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Amount Paid</p>
                  <p className="text-xl font-bold text-green-700">$700</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Amount Left</p>
                  <p className="text-xl font-bold text-red-700">$300</p>
                </div>
              </div>

              {/* <!-- Bill Breakdown --> */}
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-5">
                <h3 className="text-lg font-bold mb-3">Bill Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus Fee:</span>
                    <span className="font-semibold">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous Due:</span>
                    <span className="font-semibold">$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-green-600">-$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fine:</span>
                    <span className="font-semibold text-red-600">+$50</span>
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Payable:</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Payment History</h3>
                <div className="overflow-auto">
                  <table className="w-full border min-w-full border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="p-3 text-left border-b">Date</th>
                        <th className="p-3 text-left border-b">Amount</th>
                        <th className="p-3 text-left border-b">Method</th>
                        <th className="p-3 text-left border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                        <td className="p-3 border-b">Feb 20, 2025</td>
                        <td className="p-3 border-b">$500</td>
                        <td className="p-3 border-b">Cash</td>
                        <td className="p-3 border-b text-green-600 font-semibold">
                          Completed
                        </td>
                      </tr>
                      <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                        <td className="p-3 border-b">Feb 15, 2025</td>
                        <td className="p-3 border-b">$200</td>
                        <td className="p-3 border-b">Scholib</td>
                        <td className="p-3 border-b text-red-600 font-semibold">
                          Pending
                        </td>
                      </tr>
                      <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                        <td className="p-3 border-b">Feb 10, 2025</td>
                        <td className="p-3 border-b">$100</td>
                        <td className="p-3 border-b">PayPal</td>
                        <td className="p-3 border-b text-green-600 font-semibold">
                          Completed
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <!-- Payment Form --> */}
              <div className=" rounded-lg shadow-sm bg-gray-50 p-6 mt-8">
                <h3 className="text-lg font-bold mb-3">Make a Payment</h3>

                <label className="block mb-2 font-medium">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg mb-3"
                  placeholder="Enter amount"
                />

                <label className="block mb-2 font-medium">Remarks</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mb-3"
                  placeholder=""
                />

                <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                  Pay Now
                </button>
              </div>
            </div>

            {/* <!-- library --> */}
            <div className="bg-white p-2 md:p-4 py-6 lg:p-6 rounded-lg shadow-lg mb-5">
              {/* <!-- Library Summary --> */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Total Books</p>
                  <p className="text-xl font-bold text-blue-700">50</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Books Returned</p>
                  <p className="text-xl font-bold text-green-700">30</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Books Not Returned</p>
                  <p className="text-xl font-bold text-red-700">20</p>
                </div>
              </div>

              <div className="bg-white p-2 md:p-3 py-5 lg:p-5 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Library History</h3>

                {/* <!-- Books Taken Table --> */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Books Taken
                  </h4>

                  <div className="overflow-auto">
                    <table className="w-full border border-gray-300 rounded-lg">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="p-3 text-left border-b">Date</th>
                          <th className="p-3 text-left border-b">Book</th>
                          <th className="p-3 text-left border-b">
                            Approved By
                          </th>
                          <th className="p-3 text-left border-b">Status</th>
                          <th className="p-3 text-left border-b">
                            Return Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                          <td className="p-3 border-b">Feb 20, 2025</td>
                          <td className="p-3 border-b">
                            To Kill a Mockingbird
                          </td>
                          <td className="p-3 border-b">Jane Smith</td>
                          <td className="p-3 border-b text-red-600 font-semibold">
                            Not Returned
                          </td>
                          <td className="p-3 border-b">Feb 25, 2025</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                          <td className="p-3 border-b">Feb 15, 2025</td>
                          <td className="p-3 border-b">1984</td>
                          <td className="p-3 border-b">John Doe</td>
                          <td className="p-3 border-b text-red-600 font-semibold">
                            Not Returned
                          </td>
                          <td className="p-3 border-b">N/A</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                          <td className="p-3 border-b">Feb 10, 2025</td>
                          <td className="p-3 border-b">
                            The Catcher in the Rye
                          </td>
                          <td className="p-3 border-b">Mary Johnson</td>
                          <td className="p-3 border-b text-red-600 font-semibold">
                            Not Returned
                          </td>
                          <td className="p-3 border-b">Feb 12, 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* <!-- Books Returned Table --> */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Books Returned
                  </h4>

                  <div className="overflow-auto">
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700">
                          <th className="p-3 text-left border-b">Date</th>
                          <th className="p-3 text-left border-b">Book</th>
                          <th className="p-3 text-left border-b">
                            Approved By
                          </th>
                          <th className="p-3 text-left border-b">Status</th>
                          <th className="p-3 text-left border-b">
                            Returned Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                          <td className="p-3 border-b">Feb 20, 2025</td>
                          <td className="p-3 border-b">The Great Gatsby</td>
                          <td className="p-3 border-b">Jane Smith</td>
                          <td className="p-3 border-b text-green-600 font-semibold">
                            Returned
                          </td>
                          <td className="p-3 border-b">Feb 25, 2025</td>
                        </tr>
                        <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                          <td className="p-3 border-b">Feb 10, 2025</td>
                          <td className="p-3 border-b">1984</td>
                          <td className="p-3 border-b">John Doe</td>
                          <td className="p-3 border-b text-green-600 font-semibold">
                            Returned
                          </td>
                          <td className="p-3 border-b">Feb 12, 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* <!-- Book Issue Form --> */}
              <div className="rounded-lg shadow-sm bg-gray-50 p-3 py-5 md:p-6 mt-8">
                <h3 className="text-lg font-bold mb-3">Issue a Book</h3>

                <label className="block mb-2 font-medium">Book Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mb-3"
                  placeholder="Enter book title"
                />

                <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition text-sm">
                  Issue Book
                </button>
              </div>

              <div className="p-3 py-5 lg:p-5 rounded-lg shadow-lg bg-gray-50 mt-8">
                <h3 className="text-lg font-bold mb-4">Return a Book</h3>

                {/* <!-- Book Selection Dropdown --> */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Select Book to Return
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                    <option value="" disabled selected>
                      Select a book
                    </option>
                    <option value="1">The Great Gatsby</option>
                    <option value="2">1984</option>
                    <option value="3">To Kill a Mockingbird</option>
                    <option value="4">The Catcher in the Rye</option>
                    {/* <!-- Add more options as needed --> */}
                  </select>
                </div>

                {/* <!-- List of Selected Books --> */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Books Selected for Return
                  </h4>
                  <ul className="list-disc pl-5 space-y-3 text-gray-700 bg-gray-100 p-4 rounded-lg">
                    <li className="flex justify-between items-center">
                      The Great Gatsby
                      <button className="text-red-600 hover:text-red-800 focus:outline-none">
                        <i className="fas fa-times"></i> Remove
                      </button>
                    </li>
                    <li className="flex justify-between items-center">
                      1984
                      <button className="text-red-600 hover:text-red-800 focus:outline-none">
                        <i className="fas fa-times"></i> Remove
                      </button>
                    </li>
                  </ul>
                </div>

                {/* <!-- Return Book Button --> */}
                <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none transition duration-200 text-sm">
                  Return Book(s)
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDetails2;
