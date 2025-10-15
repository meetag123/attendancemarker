import express from 'express';
import mongoose from 'mongoose';
// import attendancerouter from './routes/AttendanceRoute.js';
import employeerouter from './routes/employeeRoute.js';
import attendanceRoute from './routes/attendanceRoute.js';
import dotenv from 'dotenv';
import cors from'cors';
dotenv.config();
const app=express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","PUT","DELETE","POST"],
    credentials:true
}));


app.listen(process.env.PORT,()=>console.log(`server is running on ${process.env.PORT}`));


mongoose.connect(process.env.URL,{
    // dbName:"employee"
    dbName:process.env.dbName
}).then(()=>console.log('database connected succefully'))
.catch((err)=>console.log("mongodb error",err));
app.use('/api',attendanceRoute);
app.use('/api',employeerouter)