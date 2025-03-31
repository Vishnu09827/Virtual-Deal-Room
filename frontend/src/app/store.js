import { configureStore } from "@reduxjs/toolkit";
import dealReducer from "../features/deal/dealSlice";
import authReducer, { logoutUser } from "../features/auth/authSlice";

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiErrorMiddleware),
});
