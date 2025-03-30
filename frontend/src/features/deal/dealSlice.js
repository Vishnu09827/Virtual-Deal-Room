import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../app/api/api";

export const fetchDeals = createAsyncThunk("deals/fetchDeals", async () => {
  const response = await api.get("/deals");
  return response.data;
});

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (dealData) => {
    const response = await api.post("/deals", dealData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

const dealSlice = createSlice({
  name: "deals",
  initialState: { deals: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.deals.push(action.payload);
      });
  },
});

export default dealSlice.reducer;
