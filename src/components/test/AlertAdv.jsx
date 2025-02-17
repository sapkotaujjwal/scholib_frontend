import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { REMOVE_ALERT_GLOBAL } from '../../redux/AlertGlobalSlice';

const AlertAdv = () => {
  const alertGlobal = useSelector((state) => state.AlertGlobal.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCloseClick();
    }, 4500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCloseClick = () => {
    dispatch(REMOVE_ALERT_GLOBAL());
  };

  return (
    <div className="fixed top-[70px] right-0 z-[10000] pb-2.5">
      <div className="float-right min-w-[40vw] h-[68px] w-max bg-gray-100 shadow-md rounded-l-xl rounded-r-sm relative flex justify-start pl-6 pr-16 overflow-hidden">
        <div className="py-2 w-full">
          <p className="text-sm font-medium mb-1 text-gray-800">
            {alertGlobal.status || 'Successful'}
          </p>
          <p className="text-xs font-medium text-gray-600">
            {alertGlobal.message || 'Proceed to your activity'}
          </p>
        </div>

        {/* Progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
          <div 
            className="h-full bg-blue-500 origin-left"
            style={{
              animation: 'shrink 4.5s linear forwards'
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={handleCloseClick}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <FontAwesomeIcon 
            icon={faXmark} 
            className="w-4 h-4 text-gray-600"
          />
        </button>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @media (max-width: 500px) {
          .min-w-[40vw] {
            width: 98vw !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AlertAdv;