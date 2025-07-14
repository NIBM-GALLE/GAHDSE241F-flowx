import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, pool } from "./utils/db.js";
import logger from "./utils/logger.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { networkInterfaces } from 'os'; 

// Debug imports
console.log("🛠️ Loading route files...");
import authRoutes from "./routers/auth.routes.js";
import areaRoutes from "./routers/area.routes.js";
import floodRoutes from "./routers/flood.routes.js";
import announcementRoutes from "./routers/announcement.routes.js";
import shelterRoutes from "./routers/shelter.routes.js";
import subsidiesRoutes from "./routers/subsidies.routes.js";
import victimRoutes from "./routers/victim.routes.js";
console.log("✅ Routes loaded successfully");

dotenv.config();
console.log("⚙️ Environment variables loaded");

const PORT = process.env.PORT || 8005;
console.log(`🔌 Configuring server to run on port ${PORT}`);

const app = express();

console.log("🛡️ Setting up CORS and middleware");
// Allow all localhost origins (any port) for dev
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

console.log("🩺 Adding health check endpoint");
app.get('/', (req, res) => {
  console.log("🏥 Health check requested");
  res.send('Backend is running!');
});

// Validate environment variables
console.log("🔍 Checking required environment variables");
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required env var: ${varName}`);
  } else {
    console.log(`✔️ Found env var: ${varName}`);
  }
});

console.log("🛣️ Setting up routes");
app.use("/api/auth", authRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/flood", floodRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/shelter", shelterRoutes);
app.use("/api/subsidies", subsidiesRoutes);
app.use("/api/victim", victimRoutes);
console.log("✅ All routes configured");

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔗 Connect using:");
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Network: http://${getIpAddress()}:${PORT}`);
  
  connectDB().catch(error => {
    console.error("💥 Database connection failed:", error);
    process.exit(1);
  });
});

// Helper function to get IP address
function getIpAddress() {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT - Shutting down gracefully");
  await shutdown();
});