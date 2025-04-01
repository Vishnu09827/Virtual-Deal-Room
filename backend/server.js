require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const connectDB = require("./config/dbConn");
const Deal = require("./models/Deal");
const dealSocket = require("./sockets/dealSocket");

//Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust for frontend

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust for frontend
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/deals", require("./routes/deal"));

dealSocket(io);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
