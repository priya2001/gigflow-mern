import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyGigs } from '../store/gigSlice';
import { getMyBids } from '../store/bidSlice';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { myGigs } = useSelector((state) => state.gigs);
  const { bids } = useSelector((state) => state.bids);
  const dispatch = useDispatch();
  
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyGigs());
      dispatch(getMyBids());
      
      // Setup socket connection for real-time notifications
      const socket = io(process.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000');
      
      // Join user's room for notifications
      if (user) {
        socket.emit('join-room', user.id);
      }
      
      // Listen for notifications
      socket.on('notification', (data) => {
        setNotifications(prev => [...prev, { ...data, id: Date.now() }]);
        
        // Show browser notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.data.message, {
            body: data.data.gigTitle ? `Job: ${data.data.gigTitle}` : 'New update available',
            icon: '/favicon.ico'
          });
        }
      });
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Cleanup
      return () => {
        socket.disconnect();
      };
    }
  }, [dispatch, user, isAuthenticated]);

  // Filter user's bids
  const myActiveBids = bids.filter(bid => bid.status === 'pending');
  const myHiredBids = bids.filter(bid => bid.status === 'hired');

  // Stats
  const totalGigs = myGigs.length;
  const openGigs = myGigs.filter(gig => gig.status === 'open').length;
  const activeBids = myActiveBids.length;
  const hiredCount = myHiredBids.length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-200">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6">
            <span className="text-white text-2xl font-bold">GF</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Login to Continue
            </Link>
            <Link to="/register" className="btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with your jobs and bids.</p>
      </div>
  
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Jobs</h3>
              <p className="text-2xl font-bold text-indigo-600">{totalGigs}</p>
            </div>
          </div>
        </div>
  
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Open Jobs</h3>
              <p className="text-2xl font-bold text-green-600">{openGigs}</p>
            </div>
          </div>
        </div>
  
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Bids</h3>
              <p className="text-2xl font-bold text-yellow-600">{activeBids}</p>
            </div>
          </div>
        </div>
  
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Hired</h3>
              <p className="text-2xl font-bold text-purple-600">{hiredCount}</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.slice(-5).reverse().map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'HIRED_NOTIFICATION' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-indigo-500 bg-indigo-50'
                }`}
              >
                <p className="font-medium">{notification.data.message}</p>
                {notification.data.gigTitle && (
                  <p className="text-sm text-gray-600 mt-1">Job: {notification.data.gigTitle}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Jobs */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Jobs</h2>
            <Link to="/my-gigs" className="text-indigo-600 hover:text-indigo-500 font-medium">View All</Link>
          </div>
          {myGigs.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {myGigs.slice(0, 5).map((gig) => (
                <li key={gig._id} className="py-3">
                  <Link to={`/gigs/${gig._id}`} className="block">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{gig.title}</h3>
                      <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                        {gig.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">${gig.budget}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No jobs posted yet.</p>
          )}
        </div>
  
        {/* My Bids */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Bids</h2>
            <Link to="/my-bids" className="text-indigo-600 hover:text-indigo-500 font-medium">View All</Link>
          </div>
          {bids.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bids.slice(0, 5).map((bid) => (
                <li key={bid._id} className="py-3">
                  <Link to={`/gigs/${bid.gigId._id}`} className="block">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{bid.gigId.title}</h3>
                      <span className={`badge ${
                        bid.status === 'pending' 
                          ? 'badge-pending' 
                          : bid.status === 'hired'
                            ? 'badge-hired'
                            : 'badge-rejected'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Bid: ${bid.price}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bids placed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;