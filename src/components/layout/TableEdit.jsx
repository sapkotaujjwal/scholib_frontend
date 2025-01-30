
import React, { useEffect, useState } from "react";
import "./tableEdit.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableEdit = ({
  data,
  fields,
  setDataFromChild = () => {},
  exclude = [], // expect field names to be excluded
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [myData, setMyData] = useState(data);
  const [editIndex, setEditIndex] = useState(null);

  function selectRow(index) {
    if (index !== editIndex) {
      setEditIndex(null);
    }
  }

  function handleEditClick(e, index) {
    e.stopPropagation();
    if (editIndex === index) {
      setEditIndex(null);
    } else {
      setEditIndex(index);
    }
  }

  // function handleInputChange(event, index, field) {
  //   const { value } = event.target;
  //   setMyData((prevData) => {
  //     const newData = [...prevData];
  //     newData[index][field] = value;
  //     return newData;
  //   });
  // }

  function handleInputChange(event, index, field) {
    const { value } = event.target;
    setMyData((prevData) => {
        const newData = prevData.map((item, i) => {
            // Create a new object for the item being edited
            if (i === index) {
                return { ...item, [field]: value }; // Return a new object with updated field
            }
            return item; // Return the unchanged item for others
        });
        return newData;
    });
}


  useEffect(() => {
    setMyData(data);
  }, [data]);

  useEffect(() => {
    setDataFromChild(myData);
  }, [myData]);

  return (
    <div className="heroTable0238">
      {!myData || myData.length < 1 ? (
        <p className="h6 text-secondary text-center" style={{marginBottom: '10px'}}> No data Found... </p>
      ) : (
        <table>
          <thead>
            {/* header row of the table */}
            <tr>
              {!fields &&
                Object.keys(myData[0]).map((key) => <th key={key}>{key}</th>)}

              {fields &&
                fields.map((key) =>
                  key === "" ? (
                    <th
                      style={{ paddingLeft: "13px", paddingRight: "13px" }}
                      key={key}
                    >
                      {key}
                    </th>
                  ) : (
                    <th key={key}>{key}</th>
                  )
                )}
            </tr>
          </thead>
          <tbody>
            {/* main row of the table */}
            {myData.map((row, index) => (
              <tr
                key={index}
                className={selectedRows.includes(index) ? "selected" : ""}
                onClick={() => selectRow(index)}
              >
                {Object.keys(row).map((key, i) =>
                  !exclude.includes(key) ? ( // Check if field is excluded
                    <td key={i}>
                      {editIndex === index ? (
                        <input
                          className="input-hero1"
                          type="text"
                          value={row[key]}
                          onChange={(event) =>
                            handleInputChange(event, index, key)
                          }
                        />
                      ) : (
                        row[key]
                      )}
                    </td>
                  ) : null
                )}
                <td
                  style={{
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    cursor: "pointer",
                    borderRight: "0px",
                  }}
                >
                  <div
                    className="svg"
                    onClick={(e) => {
                      handleEditClick(e, index);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={editIndex === index ? faCheck : faPen}
                    />
                  </div>
                </td>
                <td
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    cursor: "pointer",
                    borderLeft: "0px",
                  }}
                  onClick={(e) => {
                    setEditIndex(null);
                    setMyData((prevData) => {
                      const newData = [...prevData];
                      newData.splice(index, 1);
                      return newData;
                    });
                  }}
                >
                  <div className="svg">
                    <FontAwesomeIcon icon={faTrash} className="text-danger" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableEdit;

