
import React, { useEffect, useState } from 'react';
import axiosconfig from '../axiosconfig';
import EmployeeForm from './EmployeeForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UsersIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { use } from 'react';
import { deleteEmployee, getEmployee } from '../slice/EmployeeSlice';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const dispatch=useDispatch();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        // const res = await axiosconfig.get('/all');
        const resultAction= await dispatch(getEmployee());
        if (getEmployee.fulfilled.match(resultAction)) {
        const employeesData = resultAction.payload;
        setEmployees(employeesData);
        } else {
          toast.error('Unexpected response format.', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(`Failed to load employees: ${error.response?.data?.message || error.message}`, {
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
    
  }, []);

  const handleDelete = async (id) => {
    try {
      // await axiosconfig.delete(`delete/${id}`);
      dispatch(deleteEmployee(id));
    
      toast.success('Employee deleted successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete employee: ${error.response?.data?.message || error.message}`, {
        autoClose: 3000,
      });
    }
  };

  const handleAdd = (newEmp) => {
    setEmployees([...employees, newEmp]);
    setShowForm(false);
    toast.success('Employee added successfully!', { autoClose: 2000 });
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-10 bg-gradient-to-br from-cream to-teal-500 font-poppins">
      {/* Header */}
      <header className="flex items-center justify-center w-full max-w-4xl mb-6 space-x-2">
        <UsersIcon className="w-8 h-8 text-coral-500" />
        <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-xl">
        {/* Toggle Form Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="relative flex items-center px-6 py-2 space-x-2 text-base font-semibold text-white rounded-lg shadow-sm bg-gradient-to-r from-coral-500 to-teal-500 hover:from-coral-600 hover:to-teal-600"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{showForm ? 'Hide Form' : 'Add Employee'}</span>
            <span className="absolute inset-0 bg-white rounded-lg opacity-0 pointer-events-none animate-ripple"></span>
          </button>
        </div>

        {/* Employee Form */}
        {showForm && (
          <div className="mb-8">
            <EmployeeForm onAdd={handleAdd} />
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="flex justify-center mb-6 space-x-2">
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-bounce-dots" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-bounce-dots" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-bounce-dots" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {/* Employee List */}
        {!loading && (
          <div className="space-y-2">
            {employees.length === 0 ? (
              <div className="p-4 text-base text-center text-gray-500">
                No employees found.
              </div>
            ) : (
              employees.map((emp, index) => (
                <div
                  key={emp._id}
                  className="flex items-center justify-between p-4 transition rounded-lg shadow-sm bg-gray-50 hover:bg-teal-50"
                >
                  <div className="grid flex-1 grid-cols-4 gap-4">
                    <span className="text-base text-gray-700">{emp.employeeCode || `EMP${index + 1}`}</span>
                    <span className="text-base font-medium text-gray-700">{emp.name}</span>
                    <span className="text-base text-gray-600">{emp.email}</span>
                    <span className="text-base text-gray-700">{emp.phone}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="flex items-center space-x-1 text-coral-500 hover:text-coral-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        autoClose={2000}
        position="top-right"
        theme="colored"
        toastClassName="bg-teal-50 text-gray-800 border border-teal-200 rounded-lg shadow-md"
        bodyClassName="text-sm font-medium"
        progressClassName="bg-coral-500"
      />
    </div>
  );
};

export default Employee;