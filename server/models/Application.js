
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      maxlength: [30, "Roll number is too long"],
    },
    internship: {
      type: String,
      required: [true, "Please select an internship"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Application", applicationSchema);
