import React, { useState } from "react";
import "./StudentSearchTable.scss";

const StudentSearchTable = ({ data, setStudent }) => {
  function selectRow(_id) {
    setStudent(_id);
  }

  return (
    <div className="heroTable023811">
      {!data || data.length < 1 ? (
        <p className="h6 text-secondary text-center">
          Search For Students...
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row._id} onClick={() => selectRow(row._id)}>
                <td>{row.name}</td>
                <td>{row.class}</td>
                <td>{row.section}</td>
                <td>{row.loginId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentSearchTable;
