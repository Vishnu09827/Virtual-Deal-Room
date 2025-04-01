import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend server

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Add new notifications on top
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

// Listen for socket events
export const listenForNotifications = () => (dispatch) => {
  socket.on("newDealNotification", (deal) => {
    dispatch(
      addNotification({ type: "New Deal", message: `New deal created: ${deal.title}` })
    );
  });

  socket.on("dealStatusNotification", (deal) => {
    dispatch(
      addNotification({ type: "Deal Update", message: `Deal "${deal.title}" status changed to ${deal.status}` })
    );
  });

  socket.on("newMessageNotification", (message) => {
    dispatch(
      addNotification({ type: "New Message", message: `New message: ${message.text}` })
    );
  });
};
