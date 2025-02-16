import React, { useState } from "react";

const DataTable = ({
  data,
  fields,
  selectedOnes = () => {},
  exclude = [],
  noSelect = false,
  center = true
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

  if (!data || data.length < 1) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm font-medium text-gray-500">No data found...</p>
      </div>
    );
  }

  const textAlignClass = center ? "text-center" : "text-left";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {!fields &&
              Object.keys(data[0]).map(
                (key) =>
                  !exclude.includes(key) && (
                    <th
                      key={key}
                      className={`px-6 py-3 bg-gray-50 ${textAlignClass} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {key}
                    </th>
                  )
              )}

            {fields &&
              fields.map(
                (key) =>
                  !exclude.includes(key) && (
                    <th
                      key={key}
                      className={`px-6 py-3 bg-gray-50 ${textAlignClass} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                    >
                      {key}
                    </th>
                  )
              )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => selectRow(index)}
              className={`cursor-pointer hover:bg-gray-50 ${
                selectedRows.includes(index)
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {Object.entries(row).map(
                ([key, value], i) =>
                  !exclude.includes(key) && (
                    <td
                      key={i}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${textAlignClass}`}
                    >
                      {value}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;