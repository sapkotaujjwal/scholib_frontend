import React, { useState, useEffect } from "react";
import "./test2.scss";

const Test2 = () => {
  const [scrollAmount, setScrollAmount] = useState(0);
  const [startMove, setStartMove] = useState(false);
  const [shouldMove, setShouldMove] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setScrollAmount(scrollY);

    // Calculate the position of the "body" div
    const bodyDiv = document.querySelector(".body");
    if (bodyDiv) {
      const bodyRect = bodyDiv.getBoundingClientRect();
      const bodyTop = bodyRect.top;
      const bodyBottom = bodyRect.bottom;

      // Check if the "body" div is within the desired range
      if (bodyTop <= 100) {
        setStartMove(true);
      } else if (bodyBottom <= window.innerHeight - 1) {
        setStartMove(false);
      }

      // Check if the "body" div is within the range to move the ".one" div
      setShouldMove(startMove && bodyBottom >= window.innerHeight - 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [startMove]);

  return (
    <div className="test2bxsbds">
      <div className="main">
        <div className="header2 flex1 each" style={{ width: "100%" }}>
          <p className="h6 text-center"> Hi guys, I am Header</p>
        </div>

        <div className="up each">
          <p className="text-center"> Good Luck </p>
        </div>

        <div className="body each" style={{ width: "100%" }}>
          <div
            className="one custom-scrollbar"
            style={{
              transform: shouldMove ? `translateY(${scrollAmount}px)` : "translateY(0)",
              transition: "transform 0s ease",
            }}
          >
            <p className="h6 text-center pt-4 p-4">
              {/* Your content */}
            </p>
          </div>

          <div className="two">
            <p className="h6 text-center pt-4"> Right </p>
          </div>
        </div>

        <div className="footer2 each flex1" style={{ width: "100%" }}>
          <p className="h6 text-center"> Hi guys, I am Footer</p>
        </div>
      </div>
    </div>
  );
};

export default Test2;
