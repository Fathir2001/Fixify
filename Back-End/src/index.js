const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const requestedServiceProviderRoutes = require("./routes/requestedServiceProvider.js");
const adminRoutes = require("./routes/adminRoutes");
const serviceNeederRoutes = require("./routes/serviceNeederRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const authMiddleware = require("./middleware/auth");
const { createTransport } = require("nodemailer");
const adminServiceRoutes = require("./routes/adminServiceRoutes");
const ConnectedService = require('./models/ConnectedService');
const { checkServiceActivation, checkServiceCompletion } = require('./controllers/activeServiceController');

// Set up periodic checks (every minute)
setInterval(() => {
  // Check for services to activate
  checkServiceActivation();
  
  // Check for services to complete
  checkServiceCompletion();
}, 60000);

// Load environment variables
dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware to log incoming requests
console.log("Environment variables check:", {
  PORT: process.env.PORT || "(using default 5000)",
  MONGODB_URI_SET: process.env.MONGODB_URI ? "✓" : "✗",
  JWT_SECRET_SET: process.env.JWT_SECRET ? "✓" : "✗",
  EMAIL_USER_SET: process.env.EMAIL_USER ? "✓" : "✗",
  EMAIL_PASS_SET: process.env.EMAIL_PASS ? "✓" : "✗"
});

// Configure Socket.io
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:5173",
      "https://fixify-frontend.onrender.com",
      "https://jolly-macaron-6caae5.netlify.app" // Add your Netlify domain here
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Configure CORS
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:5173",
    "https://fixify-frontend.onrender.com",
    "https://jolly-macaron-6caae5.netlify.app" // Add your Netlify domain here
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Make io available in routes
app.set("io", io);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Fixify API" });
});

// Add this near your other routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    env: process.env.NODE_ENV || "development"
  });
});

// API Routes
app.use("/api/service-providers", requestedServiceProviderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/service-needers", serviceNeederRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/service-requests", adminServiceRoutes);
app.set("io", io);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Custom event listeners here if needed
  socket.on("requestOTP", (data) => {
    console.log("OTP requested for service:", data.serviceId);
  });

  socket.on("verifyOTP", (data) => {
    console.log("OTP verification for service:", data.serviceId);
  });

  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
});

// Add general error handler for io
io.engine.on("connection_error", (err) => {
  console.error("Socket.IO connection error:", err);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Don't let the server crash on MongoDB connection failure
    // The application can still start, just with limited functionality
  });


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message,
  });
});

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("Email configuration verified successfully");
  } catch (error) {
    console.error("Email configuration error:", {
      message: error.message,
      code: error.code,
    });
  }
};

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Run email verification separately so it doesn't block startup
  verifyEmailConfig().catch(err => {
    console.error("Failed to verify email configuration:", err);
    // App continues running even if email verification fails
  });
});