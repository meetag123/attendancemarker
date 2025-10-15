import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, deleteEmployee } from "../slice/EmployeeSlice";
import EmployeeForm from "./EmployeeForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  UsersIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Employee = () => {
  const dispatch = useDispatch();
  const { employeedata: employees, loading, error } = useSelector(
    (state) => state.employee
  );

  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch employees on mount
  useEffect(() => {
    dispatch(getEmployee());
  }, [dispatch]);

  // ✅ Manual refresh handler
  const handleRefresh = async () => {
    await dispatch(getEmployee());
    toast.info("Employee list refreshed!", { autoClose: 1500 });
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    try {
      const resultAction = await dispatch(deleteEmployee(id));
      if (deleteEmployee.fulfilled.match(resultAction)) {
        toast.success("Employee deleted successfully!", { autoClose: 2000 });
      } else {
        toast.error("Failed to delete employee.", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(
        `Failed to delete employee: ${error.response?.data?.message || error.message}`,
        { autoClose: 3000 }
      );
    }
  };

  // ✅ Handle add (refresh list after form submission)
  const handleAdd = () => {
    dispatch(getEmployee());
    setShowForm(false);
    toast.success("Employee added successfully!", { autoClose: 2000 });
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
        {/* Action Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center px-5 py-2 space-x-2 text-base font-semibold text-white rounded-lg shadow-sm transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-coral-500 hover:from-teal-600 hover:to-coral-600"
            }`}
          >
            <ArrowPathIcon
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            className={`flex items-center px-6 py-2 space-x-2 text-base font-semibold text-white rounded-lg shadow-sm transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-coral-500 to-teal-500 hover:from-coral-600 hover:to-teal-600"
            }`}
          >
            <PlusIcon className="w-5 h-5" />
            <span>{showForm ? "Hide Form" : "Add Employee"}</span>
          </button>
        </div>

        {/* Employee Form */}
        {showForm && (
          <div className="mb-8">
            <EmployeeForm onAdd={handleAdd} />
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">Loading employees...</p>
          </div>
        )}

        {/* Error Message */}
        {!loading && error && (
          <div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Employee List */}
        {!loading && !error && employees && (
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
                    <span className="text-base text-gray-700">
                      {emp.employecode || `EMP${index + 1}`}
                    </span>
                    <span className="text-base font-medium text-gray-700">
                      {emp.name}
                    </span>
                    <span className="text-base text-gray-600">{emp.email}</span>
                    <span className="text-base text-gray-700">{emp.phone}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    disabled={loading}
                    className={`flex items-center space-x-1 ${
                      loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-coral-500 hover:text-coral-600"
                    }`}
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
