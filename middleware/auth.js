const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =============================
// VERIFY TOKEN MIDDLEWARE
// =============================
const verifyToken = async (req, res, next) => {
  try {   
    // token header se lena
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Bearer TOKEN format handle
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // verify JWT
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // user find
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // req me user set
    req.user = user;

    next(); // ✅ VERY IMPORTANT

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
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
// EXPORTS
// =============================
module.exports = {
  verifyToken,
  isAdmin,
  generateToken,
};   