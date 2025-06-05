import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <Link to="/" className="text-xl font-bold text-blue-600 transition hover:text-blue-800">
        Infolanze
      </Link>
      
      <ul className="flex space-x-6 text-sm font-medium">
        <li>
          <Link
            to="/attendance"
            className="text-gray-600 transition duration-300 hover:text-blue-600"
          >
            Attendance
          </Link>
        </li>
        <li>
          <Link
            to="/addemployee"
            className="text-gray-600 transition duration-300 hover:text-blue-600"
          >
            Employee
          </Link>
        </li>
         <li>
          <Link
            to="/summary"
            className="text-gray-600 transition duration-300 hover:text-blue-600"
          >
            Summary
          </Link>
        </li>
     
      </ul>
    </nav>
  );
};

export default Navbar;
