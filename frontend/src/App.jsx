// src/App.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Navbar";
import Employee from "./component/Employee";
import EmployeeForm from "./component/EmployeeForm";
import Attendance from "./component/Attendance";
import Summary from "./component/Summary";

 export const  App = () => { 
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Employee />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/addemployee" element={<EmployeeForm />} />
        <Route path="/summary" element={<Summary/>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;
