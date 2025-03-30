import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dealReducer from "../features/deal/dealSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deals: dealReducer,
  },
});
