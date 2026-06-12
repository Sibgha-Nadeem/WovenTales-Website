const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app"
  ],
  credentials: true,
})
);

// Ensure uploads folder exists (NOTE: won't persist on Vercel, but safe to keep)
const avatarsDir = path.join(__dirname, "uploads/avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
});

// Serve uploaded files (will not persist on Vercel, but kept for compatibility)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/followers", require("./routes/followerRoutes"));
app.use("/api/scenes", require("./routes/sceneRoutes"));
app.use("/api/explorer", require("./routes/explorerRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("API is running on Vercel");
});

// IMPORTANT: export for Vercel
module.exports = serverless(app);