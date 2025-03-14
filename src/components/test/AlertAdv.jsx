import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_ALERT_GLOBAL } from "../../redux/AlertGlobalSlice";
import { motion, AnimatePresence } from "framer-motion";

const alertColors = {
  success: "bg-green-100 text-green-700 border-green-400",
  error: "bg-red-100 text-red-700 border-red-400",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
  info: "bg-blue-100 text-blue-700 border-blue-400",
};

const AlertAdv = () => {
  const alerts = useSelector((state) => state.AlertGlobal.alerts);
  const dispatch = useDispatch();

  useEffect(() => {
    alerts.forEach((alert) => {
      const timer = setTimeout(() => {
        dispatch(REMOVE_ALERT_GLOBAL(alert.id));
      }, 4500);
      return () => clearTimeout(timer);
    });
  }, [alerts, dispatch]);

  return (
    <div className="fixed top-20 right-4 z-[10000] flex flex-col gap-3 min-w-[35%] w-3xl max-w-[100%]">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`relative flex items-start p-4 pr-12 rounded-lg shadow-md border-l-4 ${alertColors[alert.type] || alertColors.info}`}
          >
            <div>
              <p className="text-sm font-semibold">{alert.status || "Notification"}</p>
              <p className="text-xs">{alert.message || "Proceed to your activity."}</p>
            </div>
            {/* Close Button */}
            <button
              onClick={() => dispatch(REMOVE_ALERT_GLOBAL(alert.id))}
              className="absolute right-2 top-2 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5 text-gray-600" />
            </button>
            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gray-300 w-full"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertAdv;
