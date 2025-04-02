const Deal = require("../models/Deal");
const mongoose = require("mongoose");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", ({ dealId, userType }) => {
      socket.join(dealId);
      console.log(`${userType} joined deal ${dealId}`);

      io.to(dealId).emit("receive_message", {
        dealId,
        type: "info",
        text: `${userType} joined the deal.`,
      });
    });

    socket.on("send_message", ({ dealId, sender, text }) => {
      console.log(`Message from ${sender}: ${text}`);
      io.to(dealId).emit("receive_message", {dealId, type: "chat", sender, text:`${sender}: ${text}` });
    });

    socket.on("typing", (data) => {
      socket.broadcast.to(data.room).emit("typing", data.name);
    });

    socket.on("send_offer", async ({ dealId, sender, price }) => {
      try {
        console.log(`Offer from ${sender}: $${price}`);
        const session = await mongoose.startSession();
        session.startTransaction();

        const updatedDeal = await Deal.findByIdAndUpdate(
          dealId,
          { $set: { status: "in_progress", price } },
          { new: true, runValidators: true }
        );

        if (!updatedDeal) {
          console.error("Deal not found while sending offer");
          await session.abortTransaction();
          session.endSession();
          socket.emit("error", { message: "Deal not found" });
          return;
        }
        await session.commitTransaction();
        session.endSession();

        io.to(dealId).emit("receive_message", {
          type: "offer",
          sender,
          price,
        });
      } catch (error) {
        console.error("Error in send_offer:", error.message);
        socket.emit("error", { message: "Failed to send offer" });
      }
    });

    socket.on("accept_offer", async ({ dealId, sender, price }) => {
      try {
        console.log(`Offer accepted: $${price}`);
        const updatedDeal = await Deal.findByIdAndUpdate(
          dealId,
          { $set: { price, status: "completed" } },
          { new: true, runValidators: true }
        );

        if (!updatedDeal) {
          console.error("Deal not found while accepting offer");
          return;
        }

        io.to(dealId).emit("deal_updated", updatedDeal);
        io.to(dealId).emit("receive_message", {
          dealId,
          type: "status",
          text: `Offer accepted: $${price} by ${sender}`,
        });
      } catch (error) {
        console.error("Error in accept_offer:", error.message);
      }
    });

    socket.on("reject_offer", async ({ dealId, sender, price }) => {
      try {
        console.log(`Offer rejected: $${price}`);
        io.to(dealId).emit("receive_message", {
          type: "status",
          text: `Offer rejected: $${price} by ${sender}`,
        });
      } catch (error) {
        console.error("Error in reject_offer:", error.message);
      }
    });

    socket.on("document_uploaded", ({ dealId, ...rest }) => {
      try {
        io.to(dealId).emit("document_uploaded", { ...rest });
      } catch (error) {
        console.error("Error in document_uploaded:", error.message);
      }
    });

    socket.on("leave_room", async (dealId) => {
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
};
