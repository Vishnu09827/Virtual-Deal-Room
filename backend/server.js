require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./config/dbConn");
const Deal = require("./models/Deal");

//Connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust for frontend

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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", async ({ dealId, userType }) => {
    socket.join(dealId);
    console.log(`${userType} joined deal ${dealId}`);
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      { $set: { status: "pending" } },
      { new: true, runValidators: true }
    );
    io.to(dealId).emit("receive_message", {
      type: "info",
      text: `${userType} joined the deal.`,
    });
  });

  // Handle text messages
  socket.on("send_message", ({ dealId, sender, text }) => {
    console.log(`Message from ${sender}: ${text}`);
    io.to(dealId).emit("receive_message", {
      type: "chat",
      sender,
      text,
    });
  });

  // Handle Activity
  socket.on("typing", (data) => {
    console.log(`User ${socket.id.substring(0, 5)} is typing`, data);
    socket.broadcast.to(data.room).emit("typing", data.name);
  });

  // Handle price offers
  socket.on("send_offer", async ({ dealId, sender, price }) => {
    console.log(`Offer from ${sender}: $${price}`);
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      { $set: { status: "in_progress" } },
      { new: true, runValidators: true }
    );
    io.to(dealId).emit("receive_message", {
      type: "offer",
      sender,
      price,
    });
  });

  // Handle offer acceptance/rejection
  socket.on("accept_offer", async ({ dealId, sender, price }) => {
    console.log(`Offer accepted: $${price}`);
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      { $set: { price, status: "completed" } },
      { new: true, runValidators: true }
    );
    io.to(dealId).emit("deal_updated", updatedDeal);
    io.to(dealId).emit("receive_message", {
      type: "status",
      text: `Offer accepted: $${price} by ${sender}`,
    });
  });

  socket.on("reject_offer", ({ dealId, sender, price }) => {
    console.log(`Offer rejected: $${price}`);
    io.to(dealId).emit("receive_message", {
      type: "status",
      text: `Offer rejected: $${price} by ${sender}`,
    });
  });

  socket.on("leave_room", async (dealId) => {
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      { $set: { price, status: "cancelled" } },
      { new: true, runValidators: true }
    );
    socket.leave(dealId);
    io.to(dealId).emit("receive_message", {
      type: "info",
      text: "A user has left the deal.",
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
