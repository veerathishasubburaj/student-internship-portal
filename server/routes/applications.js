
import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// GET: Retrieve all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Fetch applications error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve applications",
    });
  }
});

// POST: Submit a new application
router.post("/", async (req, res) => {
  try {
    const { name, email, rollNumber, internship } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof rollNumber !== "string" ||
      typeof internship !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !internship.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const application = await Application.create({
      name,
      email,
      rollNumber,
      internship,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Submit application error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name, email, rollNumber, internship } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof rollNumber !== "string" ||
      typeof internship !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !internship.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { name, email, rollNumber, internship },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    console.error("Update application error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update application",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    console.error("Delete application error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
});

export default router;
