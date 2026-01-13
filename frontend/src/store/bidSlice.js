import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Submit a bid
export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async ({ gigId, message, price }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/bids', {
        gigId,
        message,
        price
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get bids for a specific gig (owner only)
export const getBidsForGig = createAsyncThunk(
  'bids/getBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/bids/gig/${gigId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all bids by current freelancer
export const getMyBids = createAsyncThunk(
  'bids/getMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/bids/my-bids');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Hire a freelancer
export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/bids/${bidId}/hire`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a bid
export const updateBid = createAsyncThunk(
  'bids/updateBid',
  async ({ bidId, bidData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/bids/${bidId}`, bidData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a bid
export const deleteBid = createAsyncThunk(
  'bids/deleteBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/bids/${bidId}`);
      return { bidId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    bidsForGig: [],
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    addBid: (state, action) => {
      state.bids.push(action.payload);
    },
    resetBids: (state) => {
      state.bids = [];
      state.bidsForGig = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit bid
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to submit bid';
      })
      // Get bids for gig
      .addCase(getBidsForGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBidsForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.bidsForGig = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getBidsForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bids';
      })
      // Get my bids
      .addCase(getMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bids';
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to hire freelancer';
      })
      // Update bid
      .addCase(updateBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBid.fulfilled, (state, action) => {
        state.loading = false;
        // Update bid in bids array if it exists
        const index = state.bids.findIndex(bid => bid._id === action.payload.data._id);
        if (index !== -1) {
          state.bids[index] = action.payload.data;
        }
        state.message = action.payload.message;
      })
      .addCase(updateBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update bid';
      })
      // Delete bid
      .addCase(deleteBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBid.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from bids array
        state.bids = state.bids.filter(bid => bid._id !== action.payload.bidId);
        state.message = action.payload.message;
      })
      .addCase(deleteBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete bid';
      });
  }
});

export const { clearError, clearMessage, addBid, resetBids } = bidSlice.actions;
export default bidSlice.reducer;