import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getGigById } from '../store/gigSlice';
import { submitBid, getBidsForGig, hireFreelancer } from '../store/bidSlice';

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bidsForGig, loading: bidsLoading, error } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    message: '',
    price: ''
  });

  useEffect(() => {
    dispatch(getGigById(id));
    
    // If user is authenticated and is the owner of the gig, fetch bids
    if (isAuthenticated && user && gig && gig.ownerId && gig.ownerId._id === user.id) {
      dispatch(getBidsForGig(id));
    }
  }, [id, dispatch, isAuthenticated, user, gig]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    
    const bidPayload = {
      gigId: id,
      message: bidData.message,
      price: Number(bidData.price)
    };
    
    dispatch(submitBid(bidPayload)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setBidData({ message: '', price: '' });
        setShowBidForm(false);
        // Refresh the gig details to show updated bid count
        dispatch(getGigById(id));
      }
    });
  };

  const handleHireFreelancer = (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) {
      dispatch(hireFreelancer(bidId)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          // Refresh the gig details and bids
          dispatch(getGigById(id));
          dispatch(getBidsForGig(id));
        }
      });
    }
  };

  if (gigLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isOwner = user && gig.ownerId && gig.ownerId._id === user.id;
  const canBid = isAuthenticated && !isOwner && gig.status === 'open';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Job Details */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
                <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                  {gig.status}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <span>Posted by {gig.ownerId?.name || 'Unknown'}</span>
                <span className="mx-3">•</span>
                <span>${gig.budget}</span>
              </div>
              
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">{gig.description}</p>
              </div>
              
              <div className="flex justify-between items-center border-t pt-8">
                <div>
                  <p className="text-xl font-semibold text-gray-800">Budget: ${gig.budget}</p>
                  <p className="text-gray-600">Status: {gig.status}</p>
                </div>
                
                {!isAuthenticated ? (
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                  >
                    Login to Bid
                  </button>
                ) : canBid ? (
                  <button 
                    onClick={() => setShowBidForm(!showBidForm)}
                    className="btn-primary"
                  >
                    {showBidForm ? 'Cancel Bid' : 'Place Bid'}
                  </button>
                ) : isOwner ? (
                  <button 
                    onClick={() => navigate('/my-gigs')}
                    className="btn-primary"
                  >
                    My Jobs
                  </button>
                ) : (
                  <button 
                    disabled
                    className="bg-gray-300 text-white px-6 py-3 rounded-lg cursor-not-allowed font-medium"
                  >
                    {gig.status === 'assigned' ? 'Already Assigned' : 'Cannot Bid on Own Job'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bid Form */}
          {showBidForm && (
            <div className="mt-8 card">
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Submit Your Bid</h3>
                <form onSubmit={handleBidSubmit}>
                  <div className="mb-8">
                    <label htmlFor="message" className="block text-gray-700 mb-3 font-medium">Your Proposal</label>
                    <textarea
                      id="message"
                      name="message"
                      value={bidData.message}
                      onChange={(e) => setBidData({...bidData, message: e.target.value})}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Tell the client why you're the best fit for this job..."
                    ></textarea>
                  </div>
                  
                  <div className="mb-8">
                    <label htmlFor="price" className="block text-gray-700 mb-3 font-medium">Your Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={bidData.price}
                      onChange={(e) => setBidData({...bidData, price: e.target.value})}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g. 300"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-success"
                  >
                    Submit Bid
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Bids Panel */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Bids Received</h2>
            
            {bidsLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : bidsForGig && bidsForGig.length > 0 ? (
              <div className="space-y-5">
                {bidsForGig.map((bid) => (
                  <div key={bid._id} className={`p-5 rounded-lg border ${
                    bid.status === 'hired' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{bid.freelancerId.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">${bid.price}</p>
                      </div>
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
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bid.message}</p>
                    
                    {bid.status === 'pending' && gig.status === 'open' && isOwner && (
                      <button
                        onClick={() => handleHireFreelancer(bid._id)}
                        className="w-full btn-success text-sm"
                      >
                        Hire Freelancer
                      </button>
                    )}
                    
                    {bid.status === 'hired' && (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Hired
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p className="text-gray-600">No bids received yet.</p>
                {isOwner && <p className="text-gray-500 text-sm mt-1">Share your job to attract more freelancers!</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;