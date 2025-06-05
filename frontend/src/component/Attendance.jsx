
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isWeekend } from "date-fns";
import axiosconfig from "../axiosconfig";
import {
  CalendarIcon,
  CheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const res = await axiosconfig.get("/all");
        setEmployees(res.data);
        const initialAttendance = {};
        res.data.forEach((emp) => {
          initialAttendance[emp._id] = true;
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error(
          `Failed to fetch employees: ${
            error.response?.data?.message || error.message
          }`,
          {
            autoClose: 3000,
          }
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch existing attendance for selected date
  useEffect(() => {
    const d = date.toISOString().split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];

    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const res = await axiosconfig.get(`/date/${d}`);
        const map = {};
        employees.forEach((emp) => {
          map[emp._id] = true;
        });
        
        res.data.forEach((record) => {
          if (record.employee && record.employee._id) {
            map[record.employee._id] = record.present;
          }
        });

        setAttendance(map);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error(
          `Failed to fetch attendance: ${
            error.response?.data?.message || error.message
          }`,
          {
            autoClose: 3000,
          }
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (employees.length > 0) {
      fetchAttendance();
    }
  }, [date, employees]);

  // Handle checkbox toggle (update state only)
  const handleToggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Save all attendance records
  const handleSaveAttendance = async () => {
    setIsLoading(true);
    try {
      const attendanceRecords = Object.entries(attendance).map(
        ([employeeId, present]) => ({
          employeeId,
          date: date.toISOString().split("T")[0],
          present,
        })
      );
      await axiosconfig.post("/batch-mark", { records: attendanceRecords });
      toast.success("Attendance saved successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error(
        `Failed to save attendance: ${
          error.response?.data?.message || error.message
        }`,
        {
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-teal-500 flex flex-col items-center py-10 px-4 font-poppins">
      {/* Header */}
      <header className="w-full max-w-4xl mb-6 flex items-center justify-center space-x-2">
        <UsersIcon className="h-8 w-8 text-coral-500" />
        <h1 className="text-3xl font-bold text-gray-800">Attendance Manager</h1>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
        {/* Date Picker */}
        <div className="flex justify-center mb-8">
          <div className="relative w-72 bg-teal-50 rounded-lg shadow-sm transition hover:shadow-md">
            <DatePicker
              selected={date}
              maxDate={new Date()}
               filterDate={(date) => !isWeekend(date)}
              onChange={(d) => setDate(d)}
              className="w-full p-3 pl-10 text-base bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 cursor-pointer"
              dateFormat="yyyy-MM-dd"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500" />
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-center mb-6 space-x-2">
            <div
              className="h-2 w-2 bg-coral-500 rounded-full animate-bounce-dots"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="h-2 w-2 bg-coral-500 rounded-full animate-bounce-dots"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 bg-coral-500 rounded-full animate-bounce-dots"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}

        {/* Table */}
        <div className="space-y-2">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-teal-50 transition shadow-sm"
            >
              <span className="text-base text-gray-700 font-medium">
                {emp.name}
              </span>
              <input
                type="checkbox"
                checked={attendance[emp._id] ?? true}
                onChange={() => handleToggleAttendance(emp._id)}
                className="h-5 w-5 text-coral-500 border-gray-300 rounded focus:ring-coral-400 cursor-pointer"
              />
            </div>
          ))}
          {employees.length === 0 && !isLoading && (
            <div className="p-4 text-center text-gray-500 text-base">
              No employees found.
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8 relative">
          <button
            onClick={handleSaveAttendance}
            disabled={isLoading}
            className={`relative px-8 py-3 text-base font-semibold text-white rounded-lg shadow-md transition flex items-center space-x-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-coral-500 to-teal-500 hover:from-coral-600 hover:to-teal-600"
            }`}
          >
            <CheckIcon className="h-5 w-5" />
            <span>{isLoading ? "Saving..." : "Save Attendance"}</span>
            {!isLoading && (
              <span className="absolute inset-0 rounded-lg animate-ripple pointer-events-none bg-white opacity-0"></span>
            )}
          </button>
        </div>
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

export default Attendance;
