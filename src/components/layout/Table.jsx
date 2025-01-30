import React, { useState } from "react";
import "./Table.scss";

const DataTable = ({
  data,
  fields,
  selectedOnes,
  exclude = [],
  noSelect = false,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  function selectRow(index) {
    if (noSelect) {
      selectedOnes(data[index]);
      return;
    }

    setSelectedRows((prevSelectedRows) => {
      const isRowSelected = prevSelectedRows.includes(index);

      const updatedSelectedRows = isRowSelected
        ? prevSelectedRows.filter((rowIndex) => rowIndex !== index)
        : [...prevSelectedRows, index];

      if (selectedOnes) {
        selectedOnes(updatedSelectedRows);
      }

      return updatedSelectedRows;
    });
  }

  return (
    <div className="heroTable02387">
      {!data || data.length < 1 ? (
        <div className="flex1" style={{ padding: "30px 0px" }}>
          <p className="h6 text-secondary text-center"> No data Found... </p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {!fields &&
                Object.keys(data[0]).map(
                  (key) => !exclude.includes(key) && <th key={key}>{key}</th>
                )}

              {fields &&
                fields.map(
                  (key) => !exclude.includes(key) && <th key={key}>{key}</th>
                )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={selectedRows.includes(index) ? "selected" : ""}
                onClick={() => selectRow(index)}
              >
                {Object.entries(row).map(
                  ([key, value], i) =>
                    !exclude.includes(key) && <td key={i}>{value}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
