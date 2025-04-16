import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const protect = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    let token = req.header("Authorization")?.replace("Bearer ", "");
    
    // 2. Check cookies if no header
    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, no token" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      // Clear invalid token
      res.clearCookie("token");
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    res.clearCookie("token");
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, token failed" 
    });
  }
};

export default protect;