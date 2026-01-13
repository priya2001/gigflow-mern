import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllGigs } from '../store/gigSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const { gigs, loading, error } = useSelector((state) => state.gigs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllGigs(searchTerm));
  }, [dispatch, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllGigs(searchTerm));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find the Perfect <span className="text-indigo-600">Freelancer</span> for Your Project
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with talented professionals and get your work done efficiently
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for jobs, skills, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 pl-14 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-lg"
          />
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Jobs List Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Jobs {gigs && gigs.length > 0 && `(${gigs.length})`}
        </h2>
        {gigs && gigs.length > 0 && (
          <div className="text-sm text-gray-500">
            Showing {gigs.length} job{gigs.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Jobs List */}
      {gigs && gigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <div key={gig._id} className="card overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{gig.title}</h3>
                  <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                    {gig.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm">{gig.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-indigo-600">${gig.budget}</span>
                  <span className="text-sm text-gray-500">by {gig.ownerId?.name || 'Unknown'}</span>
                </div>
                
                <Link 
                  to={`/gigs/${gig._id}`} 
                  className="btn-outline w-full"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Jobs Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm ? 'Try a different search term.' : 'Be the first to post a job or browse available opportunities!'}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          ) : (
            <Link
              to="/create-gig"
              className="btn-primary"
            >
              Post Your First Job
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;