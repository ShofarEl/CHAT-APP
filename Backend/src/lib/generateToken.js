import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId }, 
        process.env.JWT_SECRET || "fallback-secret-key",
        { expiresIn: "7d" }
    );
    
    // Set the cookie for API auth
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".chatspacez.onrender.com" : undefined
    });

    return token;
}