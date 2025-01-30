import React, { useEffect, useState } from "react";
import "./dataTableForNextClass.scss";
import Dropdown from "../../basicComponents/Dropdown";

const DataTableForNextClass = ({ data1, updatefunc }) => {
  const [data, setData] = useState(data1);

  useEffect(() => {
    updatefunc(data);
  }, [data]);

  console.log(data);

  return (
    <div className="heroTable023871">
      {!data || data.length < 1 ? (
        <p className="h6 text-secondary text-center"> No data Found... </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Next</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>
                  <Dropdown
                    title={
                      data.find((dcs) => dcs.class === row.next)?.name ||
                      "Select One"
                    }
                    options={data
                      .filter((myDat1) => myDat1.class !== row.class)
                      .map((myDat) => {
                        return {
                          label: myDat.name,
                          value: myDat.class,
                        };
                      })}
                    onSelect={(a, b, c) => {
                      let dataTemp = [...data];
                      data.map((int) => {
                        if (int.class === row.class) {
                          int.next = c;
                        }
                      });

                      setData(dataTemp);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTableForNextClass;
