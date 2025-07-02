import { configureStore } from "@reduxjs/toolkit";
import employeeSlice from "../slice/EmployeeSlice";

const store=configureStore({
    reducer:{
        employee:employeeSlice,
    }
})
export default store;