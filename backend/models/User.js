// models/user.js
import mongoose from 'mongoose';
import Counter from './Counter.js' 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email:{
    type:String,
    required:true
  },
  employecode: {
    type: String,
    unique: true
  },
  createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: 'employee_code' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formattedCode = `EMP_${String(counter.seq).padStart(2, '0')}`;
    this.employecode = formattedCode;
  }
  next();
});

// export default mongoose.model('User', userSchema);
export const User=mongoose.model("User",userSchema);
