import express from "express";
import fetch from "node-fetch";
import { MentalHealthReport } from "../schema/db.js";
import mongoose from "mongoose";

const router = express.Router();

// POST /MentalHealth/analyze
router.post("/analyze", async (req, res) => {
  try {
    const { user_responses, question_origins } = req.body;

    const flaskResponse = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_responses, question_origins }),
    });

    const data = await flaskResponse.json();
    res.json(data); // Forward response back to React
  } catch (error) {
    console.error("Error contacting Flask backend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /MentalHealth/saveReport
router.post("/saveReport", async (req, res) => {
  try {
    const { userId, user_responses, analysis_result } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required to save report." });
    }

    // Create new report with string userId
    const newReport = new MentalHealthReport({
      user: userId,
      user_responses,
      analysis_result,
    });

    await newReport.save();
    res.status(201).json({ message: "Report saved successfully!" });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Failed to save report" });
  }
});

// GET /MentalHealth/getReports
router.get("/getReports", async (req, res) => {
  try {
    const { userId } = req.query;
    const reports = await MentalHealthReport.find({ user: userId }).sort({ created_at: -1 });

    if (!userId) {
      return res.status(400).json({ error: "User ID is required to fetch reports." });
    }

    // Use string userId directly for query
    
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports", details: error.message });
  }
});

export default router;