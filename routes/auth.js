const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ IMPORT CORRECT WAY
const { verifyToken } = require("../middleware/auth");

router.get("/...", verifyToken, ...)

// =============================
// REGISTER USER
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// =============================
// LOGIN USER
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// =============================
// GET PROFILE (PROTECTED)
// =============================
router.get("/something", verifyToken, (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;