const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =============================
// VERIFY TOKEN
// =============================
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Bearer TOKEN handle
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next(); // ✅ IMPORTANT

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};


// =============================
// ADMIN CHECK
// =============================
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


// =============================
// GENERATE TOKEN
// =============================
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// =============================
module.exports = {
  verifyToken,
  isAdmin,
  generateToken,
};