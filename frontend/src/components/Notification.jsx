import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearMessage } from '../store/authSlice';

const Notification = () => {
  const { error, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(clearError());
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  if (!error && !message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;