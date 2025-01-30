import React, { useEffect, useState } from "react";
import "./alert.scss";

const AlertDanger = ({ status  = 'Some Connection Issues Occured', message, errorRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsExpanded(true);
      setTimeout(() => {
        errorRemove();
      }, 1000);
    }, 4500);

    return () => clearTimeout(timeoutId);
  }, [errorRemove]);

  const handleDismissClick = () => {
    errorRemove();
  };

  return (
    <div className={`dbsdgsdgsdgsud ${isExpanded ? "expanded" : ""}`}>
      <div
        className="alert alert-warning alert-dismissible fade show flex1"
        role="alert"
      >
        {message}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={handleDismissClick}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default AlertDanger;
