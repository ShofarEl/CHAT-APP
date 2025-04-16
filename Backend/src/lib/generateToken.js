import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId }, 
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    
    // Production cookie settings
    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = isProduction ? ".chatspacez.onrender.com" : undefined;

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        domain: cookieDomain,
        path: "/",
    });

    return token;
};