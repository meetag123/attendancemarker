import { DeleteEmployee, Employeeform, GetEmployee } from "./EmployeeServices";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Add employee
export const employeeForm = createAsyncThunk(
  "employee/employeeForm",
  async ({ name, email, phone }, { rejectWithValue }) => {
    try {
      const data = await Employeeform(name, email, phone);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Employee not added",
      });
    }
  }
);

// ✅ Get all employees
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

// ✅ Delete employee
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const data = await DeleteEmployee(id);
      await dispatch(getEmployee()); // refresh list
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Cannot delete employee",
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
      // ADD EMPLOYEE
      .addCase(employeeForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(employeeForm.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Push new employee if valid object
        if (action.payload && typeof action.payload === "object" && !Array.isArray(action.payload)) {
          state.employeedata.push(action.payload.user || action.payload);
        }
        state.message = action.payload?.message || "Employee added successfully";
      })
      .addCase(employeeForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // GET EMPLOYEES
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Ensure array
        state.employeedata = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // DELETE EMPLOYEE
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
