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

// Load environment variables
dotenv.config();
const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Configure CORS
app.use(cors());

// Middleware
app.use(express.json());

// Make io available in routes
app.set('io', io);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Fixify API" });
});


// API Routes
app.use("/api/service-providers", requestedServiceProviderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);
app.use("/api/service-needers", serviceNeederRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.set('io', io);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
