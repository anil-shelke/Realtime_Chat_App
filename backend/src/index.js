import express from "express";
import dotenv  from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

import { connectDB } from "./lib/db.js";
import { setupSocket } from "./lib/socket.js";
import authRoutes    from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const buildPath  = path.resolve(__dirname, "../../frontend/dist");

// ─── App / server ───────────────────────────────────────────
const app    = express();
const server = createServer(app);
setupSocket(server);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// REST API
app.use("/api/auth",     authRoutes);
app.use("/api/messages", messageRoutes);

// Static React in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static(buildPath));
  app.get("/:splat*", (_, res) => res.sendFile(path.join(buildPath, "index.html")));
}

const PORT = process.env.PORT || 5001;
console.log(`mode=${process.env.NODE_ENV} | static=${buildPath}`);

connectDB().then(() => {
  server.listen(PORT, () => console.log(`server running on ${PORT}`));
});
