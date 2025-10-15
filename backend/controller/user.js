// backend/controller/User.js
import { User } from "../models/User.js";

export const Addemployee = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Employee added",
      user,
    });
  } catch (error) {
    console.error("Addemployee Error:", error);
    res.status(400).json({
      success: false,
      message: "Employee not added",
    });
  }
};

export const Getemployee = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Getemployee Error:", error);
    res.status(400).json({
      success: false,
      message: "Cannot get employees",
    });
  }
};

export const Deleteemployee = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Deleteemployee Error:", error);
    res.status(400).json({
      success: false,
      message: "Cannot delete",
    });
  }
};