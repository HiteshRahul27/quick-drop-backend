import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./Router/routes/auth.js";
import uploadRoutes from "./Router/routes/upload.routes.js";
import fileRoutes from "./Router/routes/file.routes.js";

import rate from "./middleware/rate.js";
import auth from "./middleware/auth.js";

import cleanup from "./utils/cleanup.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/upload", auth, uploadRoutes);
app.use("/api/files", auth, rate, fileRoutes);

setInterval(() => {
  cleanup();
}, 5 * 60 * 1000);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});