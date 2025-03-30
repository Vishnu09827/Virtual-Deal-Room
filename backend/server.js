require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./config/dbConn");

//Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust for frontend
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust for frontend

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/deals", require("./routes/deal"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (dealId) => {
    socket.join(dealId);
    console.log(`User joined room: ${dealId}`);
  });

  socket.on("sendOffer", ({ dealId, price }) => {
    io.to(dealId).emit("receiveOffer", price);
  });

  socket.on("sendMessage", ({ dealId, message }) => {
    io.to(dealId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
