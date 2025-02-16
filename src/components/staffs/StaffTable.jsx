import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot, faUserTie } from '@fortawesome/free-solid-svg-icons';

const StaffTable = ({ loading, error, staffs, setBigStaff, userImg }) => {
  if (loading) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <div className="spinner-border text-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">
          {error.status} <br />
          {error.message}
        </p>
      </div>
    );
  }

  if (!staffs || staffs.length < 1) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">No Staffs available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow1">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staffs.map((staff) => (
            <tr 
              key={staff._id}
              onClick={() => setBigStaff(staff._id)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={staff.pPhoto ? staff.pPhoto.secure_url : userImg}
                  alt={`${staff.name}'s profile`}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                <div className="text-sm text-gray-500">{staff.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FontAwesomeIcon icon={faUserTie} className="mr-2 text-gray-400" />
                  {staff.role}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 mb-1">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                  {staff.phone}
                </div>
                <div className="text-sm text-gray-900">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
                  {staff.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-gray-400" />
                  {staff.address}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;