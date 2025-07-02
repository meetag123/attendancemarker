import mongoose from 'mongoose';
import { Attendance } from '../models/Attendance.js';
import { User } from '../models/user.js';

// Utility to safely parse dates and reset time
const parseDate = (input) => {
  const date = new Date(input);
  if (isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0); // Normalize time for consistent matching
  return date;
};

export const Employeeattend = async (req, res) => {
  try {
    const { employeeId, date, present } = req.body;
    const parsedDate = parseDate(date);

    if (!employeeId || parsedDate === null || present === undefined) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: parsedDate },
      { present },
      { upsert: true, new: true }
    );

    res.status(200).json(attendance);
  } catch (err) {
    console.error("Error in Employeeattend:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const Getemployeeattend = async (req, res) => {
  try {
    const parsedDate = parseDate(req.params.date);
    if (parsedDate === null) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const attendance = await Attendance.find({ date: parsedDate }).populate("employee");

    res.status(200).json(attendance);
  } catch (err) {
    console.error("Error in Getemployeeattend:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const BatchEmployeeAttend = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Records must be a non-empty array',
      });
    }

    const updates = records.map(({ employeeId, date, present }) => {
      const parsedDate = parseDate(date);
      if (!mongoose.Types.ObjectId.isValid(employeeId) || parsedDate === null || present === undefined) {
        throw new Error(`Invalid record: employeeId=${employeeId}, date=${date}`);
      }
      
      return {
        updateOne: {
          filter: { employee: employeeId, date: parsedDate },
          update: { present },
          upsert: true,
        },
      };
    });

    await Attendance.bulkWrite(updates);

    res.status(200).json({
      success: true,
      message: 'Attendance records updated successfully',
    });
  } catch (err) {
    console.error('Error in BatchEmployeeAttend:', err);
    res.status(500).json({ success: false, message: `Server error: ${err.message}` });
  }
};

export const attendancesummary = async (req, res) => {
  try {
    const summary = await Attendance.aggregate([
      {
        $group: {
          _id: "$employee",
          presentCount: {
            $sum: { $cond: ["$present", 1, 0] },
          },
          absentCount: {
            $sum: { $cond: ["$present", 0, 1] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employeeInfo"
        },
      }, {
        $unwind: "$employeeInfo",
      },
      {
        $project: {
          employeeId: "$employeeInfo._id",
          name: "$employeeInfo.name",
          presentCount: 1,
          absentCount: 1,
        },
      },


    ]);
    res.status(200).json(summary);

  } catch (error) {
    res.status(500).json({ message: "Failed to generate summary", error });
  }
}