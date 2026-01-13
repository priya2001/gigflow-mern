import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/authSlice';

// Custom hook to get current user
export const useGetCurrentUserQuery = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  return { user, isAuthenticated, loading };
};

// Custom hook to check authentication status
export const useAuth = () => {
  return useSelector((state) => state.auth);
};