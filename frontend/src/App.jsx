import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Notification from './components/Notification';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
          <Navbar />
          <Notification />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route 
                path="/create-gig" 
                element={
                  <ProtectedRoute>
                    <CreateGig />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gigs/:id" 
                element={<GigDetails />} 
              />
              <Route 
                path="/my-gigs" 
                element={
                  <ProtectedRoute>
                    <MyGigs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-bids" 
                element={
                  <ProtectedRoute>
                    <MyBids />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;