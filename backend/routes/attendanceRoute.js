import express from 'express';
import { attendancesummary, BatchEmployeeAttend, Employeeattend, Getemployeeattend } from '../controller/Attendance.js';
const router= express.Router();
router.post('/mark',Employeeattend);
router.get('/date/:date',Getemployeeattend)
router.post('/batch-mark',BatchEmployeeAttend)
router.get('/summary',attendancesummary)

export default router;