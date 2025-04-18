require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/dbConn");
const dealSocket = require("./sockets/dealSocket");

//Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.REACT_APP_URL, credentials: true })); // Adjust for frontend

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_URL, // Adjust for frontend
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/deals", require("./routes/deal"));
app.use("/api/payment", require("./routes/payment"));

dealSocket(io);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
