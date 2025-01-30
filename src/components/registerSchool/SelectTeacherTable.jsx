import React, { useEffect, useState } from "react";
import "./selectTeacherTable.scss";
import Dropdown from "../basicComponents/Dropdown";
import { useSelector } from "react-redux";

const SelectTeacherTable = ({ fields, currentSection, staffUpdate }) => {

  const data = currentSection ? currentSection.extra.subjects : [];

  const [myData, setMyData] = useState(data);
  useEffect(() => {
    setMyData(data);
  }, [currentSection, data]);

  const school = useSelector((state) => state.Home.school.payload);

  function sortByName(array) {
    return array.sort((a, b) => {
      const nameA = (a.label || "").toUpperCase();
      const nameB = (b.label || "").toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  const staffs12 = school.staffs.map((obj) => ({
    label: `${obj.name} (${obj.title})`,
    value: obj._id,
    _id: obj._id,
    name: obj.name,
    role: obj.role,
    title: obj.title,
    status: obj.status,
    qualification: obj.qualification,
  }));

  const [availableStaffs, setAvailableStaffs] = useState(sortByName(staffs12));

  function handleSelect(staffIndex, subjectIndex) {
    const selectedStaff = availableStaffs[staffIndex];
    const updatedSubjects = [...myData];
    updatedSubjects[subjectIndex].teacher = selectedStaff;
    setMyData(updatedSubjects);
    staffUpdate(updatedSubjects[subjectIndex], selectedStaff, currentSection);
  }

  return (
    <div className="heroTable02357">
      {!myData || myData.length < 1 ? (
        <p className="h6 text-secondary text-center" style={{marginBottom: '10px'}}>No data Found...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {!fields &&
                Object.keys(myData[0]).map((key) => <th key={key}>{key}</th>)}
              {fields &&
                fields.map((key) => (
                  <th key={key}>
                    {key === "" ? (
                      <span>&nbsp;</span>
                    ) : (
                      key
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {myData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((key, colIndex) => (
                  <td key={colIndex}>
                    {colIndex === 1 ? (
                      <div className="wobbler" style={{ padding: "0px 3px" }}>
                        <Dropdown
                          key={currentSection.id} // Add key prop here
                          options={availableStaffs}
                          title={
                            row.teacher
                              ? `${row.teacher.name} (${row.teacher.title})`
                              : "Select Teacher"
                          }
                          onSelect={(staffIndex) =>
                            handleSelect(staffIndex, rowIndex)
                          }
                          key11={rowIndex}
                        />
                      </div>
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SelectTeacherTable;


