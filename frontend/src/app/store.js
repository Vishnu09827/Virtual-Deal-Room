import { configureStore } from "@reduxjs/toolkit";
import dealReducer from "../features/deal/dealSlice";
import authReducer, { logoutUser } from "../features/auth/authSlice";
import notificationReducer, {
  listenForNotifications,
} from "../slices/notificationSlice";

const apiErrorMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith("/rejected") && action.payload === "Unauthorized") {
    store.dispatch(logoutUser());
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deals: dealReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiErrorMiddleware),
});

store.dispatch(listenForNotifications());
