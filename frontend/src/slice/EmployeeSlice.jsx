// import reducer from "../../../../ecommerce/src/slice/FavouriteSlice";
import { act } from "react";
import { DeleteEmployee, Employeeform, GetEmployee } from "./EmployeeServices";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const employeeForm = createAsyncThunk(
  "employee/employeeForm",
  async ({ name, email, phone }, { rejectWithValue }) => {
    try {
      const data = await Employeeform(name, email, phone);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response.data.message || "employee not added",
      });
    }
  }
);
export const getEmployee = createAsyncThunk(
  "employee/getEmployee",
  async (_, { rejectWithValue }) => {
    try {
      const data = await GetEmployee();
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch employees",
      });
    }
  }
);
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const data = await DeleteEmployee(id);
      dispatch(getEmployee());
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message.data.message || "cannot delete employee",
      });
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employeedata: [],
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(employeeForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(employeeForm.fulfilled, (state, action) => {
        state.loading = false;
        state.employeedata = action.payload;
        state.message = action.payload.message;
      })
      .addCase(employeeForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      }),
      builder
        .addCase(getEmployee.pending, (state) => {
          state.loading = true;
        })
        .addCase(getEmployee.fulfilled, (state, action) => {
          state.loading = false;
          state.employeedata = action.payload;
          state.message = action.payload.message;
        })
        .addCase(getEmployee.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Something went wrong";
        });
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?.user?._id || action.meta.arg;
        state.employeedata = state.employeedata.filter(
          (emp) => emp._id !== deletedId
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete employee";
      });
  },
});
export default employeeSlice.reducer;
