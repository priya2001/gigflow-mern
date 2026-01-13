import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import gigSlice from './gigSlice';
import bidSlice from './bidSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    gigs: gigSlice,
    bids: bidSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setCredentials'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;