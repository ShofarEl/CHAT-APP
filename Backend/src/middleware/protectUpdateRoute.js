import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const protect = async (req, res, next) => {
  try {
    // Check Authorization header first
    let token = req.header("Authorization")?.replace("Bearer ", "");
    
    // If no Authorization header, check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default protect;