module.exports = function(io, redisClient) {
    io.on('connection', (socket) => {
      console.log('New client connected');
  
      // Join deal room
      socket.on('joinDeal', async ({ dealId, userId }) => {
        socket.join(dealId);
        console.log(`User ${userId} joined deal ${dealId}`);
  
        // Cache active deal in Redis
        await redisClient.saddAsync(`activeDeals:${userId}`, dealId);
      });
  
      // Leave deal room
      socket.on('leaveDeal', async ({ dealId, userId }) => {
        socket.leave(dealId);
        console.log(`User ${userId} left deal ${dealId}`);
  
        // Remove from Redis cache
        await redisClient.sremAsync(`activeDeals:${userId}`, dealId);
      });
  
      // Price negotiation
      socket.on('priceUpdate', async ({ dealId, newPrice, userId }) => {
        // In a real app, validate user can update price
        io.to(dealId).emit('priceUpdated', { newPrice, updatedBy: userId });
        
        // Cache the updated price
        await redisClient.setAsync(`dealPrice:${dealId}`, newPrice);
      });
  
      // Real-time chat
      socket.on('sendMessage', async ({ dealId, message, senderId }) => {
        const newMessage = {
          dealId,
          senderId,
          content: message,
          createdAt: new Date()
        };
  
        // Broadcast to all in the deal room except sender
        socket.broadcast.to(dealId).emit('newMessage', newMessage);
        
        // Cache last 10 messages
        // await redisClient.lpushAsync(`messages:${dealId}`, JSON.stringify(newMessage));
        // await redisClient.ltrimAsync(`messages:${dealId}`, 0, 9);
      });
  
      // Typing indicator
      socket.on('typing', ({ dealId, userId, isTyping }) => {
        socket.broadcast.to(dealId).emit('typing', { userId, isTyping });
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  };