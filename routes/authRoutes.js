const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Protected route example
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
