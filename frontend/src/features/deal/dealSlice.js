import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../app/api/api";
import { logoutUser } from "../auth/authSlice";

export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/deals", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        dispatch(logoutUser());
      }
      return rejectWithValue({ error: error.message });
    }
  }
);
export const fetchDeal = createAsyncThunk(
  "deals/fetchDeal",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/deals/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        dispatch(logoutUser());
      }
      return rejectWithValue({ error: error.message });
    }
  }
);

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (dealData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/deals", dealData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logoutUser());
      }
      return rejectWithValue({ error: error.message });
    }
  }
);

export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async (dealData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/deals/${dealData._id}`, dealData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logoutUser());
      }
      return rejectWithValue({ error: error.message });
    }
  }
);

export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/deals/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logoutUser());
      }
      return rejectWithValue({ error: error.message });
    }
  }
);

const dealSlice = createSlice({
  name: "deals",
  initialState: { deals: [], loading: false, error: null, deal: null },
  reducers: {
    updateDealStatus: (state, action) => {
      const { id, status } = action.payload;
      const deal = state.deals.find((d) => d._id === id);
      if (deal) {
        deal.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.deals.push(action.payload);
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        state.deal = action.payload;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.deal = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        console.log(action);
        const deletedDeal = action.payload.data;
        if (!deletedDeal || !deletedDeal._id) return;

        state.deals = state.deals.filter(
          (deal) => deal._id !== deletedDeal._id
        );
      });
  },
});

export default dealSlice.reducer;
