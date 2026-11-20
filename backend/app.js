import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(v => v.trim()) : true,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));
app.get("/", (_req, res) => res.json({ success: true, message: "Welcome to BuildControl API" }));
app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok", timestamp: new Date().toISOString() }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
