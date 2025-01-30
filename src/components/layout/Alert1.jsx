import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import './alert1.scss'; // Assuming you have a separate SCSS file

const Alert1 = ({ status, errorRemove, text }) => {
  const progressRef = useRef(null);

  useEffect(() => {
    if (progressRef.current) {
      const progressBar = progressRef.current;
      progressBar.style.width = '0';

      const animationDuration = 4500; // in milliseconds
      const interval = 10;
      const frames = animationDuration / interval;
      const increment = 100 / frames;

      let currentWidth = 0;

      const intervalId = setInterval(() => {
        currentWidth += increment;
        progressBar.style.width = `${currentWidth}%`;

        if (currentWidth >= 100) {
          clearInterval(intervalId);
          removingError();
        }
      }, interval);

      return () => clearInterval(intervalId);
    }
  }, []);

  function removingError() {
    errorRemove();
  }

  return (
    <div className='ppwrtwv55'>
      <div className={`main py-3 ${text}`}>
        <p className="h6">
          <FontAwesomeIcon icon={faMessage} /> &nbsp; {status || 'Something went wrong'}
        </p>

        <div className="close flex1" onClick={removingError}>
          X
        </div>
      </div>

      <div className="progress">
        <div className="moving" ref={progressRef}></div>
      </div>
    </div>
  );
};

export default Alert1;
