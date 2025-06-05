
  import mongoose from 'mongoose';

  const attendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required:true},
    date: { type: Date, required: true },
    present: { type: Boolean, default: false }
  });

  // export default mongoose.model('Attendance', attendanceSchema);
  export const Attendance= mongoose.model("attendance",attendanceSchema);