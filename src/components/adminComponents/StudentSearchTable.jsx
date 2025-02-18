import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faChalkboardTeacher, faLayerGroup, faIdCard } from '@fortawesome/free-solid-svg-icons';

const StudentSearchTable = ({ data, setStudent }) => {
  const selectRow = (_id) => {
    setStudent(_id);
  };

  if (!data || data.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm">
        <FontAwesomeIcon 
          icon={faSearch} 
          className="text-gray-400 text-4xl mb-3"
        />
        <p className="text-gray-500 font-medium">
          Search For Students...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow1">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                Name
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-2 justify-center text-center">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-400" />
                Class
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-2 justify-center text-center">
                <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400" />
                Section
              </span>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-2 justify-center text-center">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
                ID
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr 
              key={row._id}
              onClick={() => selectRow(row._id)}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-left font-medium text-gray-900">{row.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-center text-gray-500">{row.class}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-center text-gray-500">{row.section}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-center text-gray-500">{row.loginId}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentSearchTable;