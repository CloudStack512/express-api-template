const express = require("express");
const router = express.Router();
const FormData = require("../models/FormData");
const authMiddleware = require("../middleware/authMiddleware");

// Submit form data (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const form = new FormData({ ...req.body, user: req.user.id });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all forms (optional)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const forms = await FormData.find({ user: req.user.id });
    res.json(forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
