import React from "react";

const TestPrint = () => {

    function func1(){   

    }



  return (
    <div className="my-5 mx-3">
      <p className="text-lg font-bold text-center"> I am Printing </p>

      <div className="text-center">
        <button
          className="bg-blue-500 p-3 rounded-md my-5 mx-auto"
          onClick={() => func1()}
        >
          Click Me
        </button>
      </div>
    </div>
  );
};

export default TestPrint;
