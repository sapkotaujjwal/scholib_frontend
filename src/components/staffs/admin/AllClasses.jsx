import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AllClasses = ({
  closeFunction = () => {},
  title = "Select Classes",
  btnText = "Submit",
  handleGetSelectedOnes,
  courseData,
}) => {
  const courses = useSelector((state) =>
    courseData ? courseData : state.Course.course.payload.course
  );
  const [selectedOnes, setSelectedOnes] = useState([]);

  const handleClassSelection = (classId) => {
    setSelectedOnes(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleDoneClick = () => {
    handleGetSelectedOnes(selectedOnes);
    closeFunction();
  };

  return (
    <div className="fixed inset-0 bg-gray-600/60 flex items-center justify-center" style={{zIndex: 999}}>
      <div className="bg-white w-full max-w-3xl max-h-[90%] sm:rounded-md md:rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium mx-auto">{title}</h2>
          <button 
            onClick={closeFunction}
            className="p-2 hover:bg-gray-100 h-8 w-8 flex1 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Classes Grid */}
        <div className="p-6">
          <div className="flex justify-center flex-wrap gap-3">
            {courses && courses.length > 0 && courses.map((course) => (
              <button
                key={course._id}
                onClick={() => handleClassSelection(course._id)}
                className={`
                  h-20 w-32 rounded border transition-all
                  ${selectedOnes.includes(course._id)
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-sm">{course.class}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <button
            onClick={handleDoneClick}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllClasses;