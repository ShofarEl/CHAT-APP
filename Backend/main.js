import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./src/lib/socket.js";
import authRoutes from "./src/routes/authRoutes.js";
import msgRoutes from "./src/routes/msgRoutes.js";
import { connectDB } from "./src/lib/db.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express middleware
app.use(cors({
  origin: [
    "https://chatzspace.onrender.com",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// API Routes (must come before static files)
app.get("/", (req, res) => res.send("Chat server is running"));
app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// Serve static files from Frontend/dist (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/dist'), {
    dotfiles: 'ignore',
    index: false,
    maxAge: '1y'
  }));

  // Handle client-side routing - exclude API routes
  app.get(/^(?!\/?api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'), {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  });
}

// Error handler (must be last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Server Error", 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB().catch(err => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1); // Exit if DB connection fails
  });
});