import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize Express
const app = express();

// Middleware để kết nối database
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Không thể kết nối database" });
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", clerkWebhooks);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Lỗi server" });
});

module.exports = app;
