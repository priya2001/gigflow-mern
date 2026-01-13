import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Get all gigs
export const getAllGigs = createAsyncThunk(
  'gigs/getAllGigs',
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/gigs?search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get my gigs
export const getMyGigs = createAsyncThunk(
  'gigs/getMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/gigs/my-gigs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a gig
export const createGig = createAsyncThunk(
  'gigs/createGig',
  async ({ title, description, budget }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/gigs', {
        title,
        description,
        budget
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a gig
export const updateGig = createAsyncThunk(
  'gigs/updateGig',
  async ({ id, gigData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/gigs/${id}`, gigData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a gig
export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/gigs/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get a specific gig by ID
export const getGigById = createAsyncThunk(
  'gigs/getGigById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/gigs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    myGigs: [],
    gig: null,
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
    resetGigs: (state) => {
      state.myGigs = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all gigs
      .addCase(getAllGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getAllGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch gigs';
      })
      // Get my gigs
      .addCase(getMyGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch my gigs';
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs.push(action.payload.gig);
        state.myGigs.unshift(action.payload.gig); // Add to top of my gigs
        state.message = action.payload.message;
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create gig';
      })
      // Update gig
      .addCase(updateGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGig.fulfilled, (state, action) => {
        state.loading = false;
        // Update in gigs array
        const index = state.gigs.findIndex(gig => gig._id === action.payload.data._id);
        if (index !== -1) {
          state.gigs[index] = action.payload.data;
        }
        // Update in myGigs array
        const myGigIndex = state.myGigs.findIndex(gig => gig._id === action.payload.data._id);
        if (myGigIndex !== -1) {
          state.myGigs[myGigIndex] = action.payload.data;
        }
        state.gig = action.payload.data; // Update current gig if applicable
        state.message = action.payload.message;
      })
      .addCase(updateGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update gig';
      })
      // Delete gig
      .addCase(deleteGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from gigs array
        state.gigs = state.gigs.filter(gig => gig._id !== action.payload.id);
        // Remove from myGigs array
        state.myGigs = state.myGigs.filter(gig => gig._id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete gig';
      })
      // Get gig by ID
      .addCase(getGigById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.gig = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(getGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch gig';
      });
  }
});

export const { clearError, clearMessage, resetGigs } = gigSlice.actions;
export default gigSlice.reducer;