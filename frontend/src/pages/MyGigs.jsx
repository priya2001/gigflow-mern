import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyGigs } from '../store/gigSlice';
import { Link } from 'react-router-dom';

const MyGigs = () => {
  const { myGigs, loading, error } = useSelector((state) => state.gigs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyGigs());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-600">Manage your posted jobs and view applications</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <Link 
          to="/create-gig" 
          className="btn-primary inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Post New Job
        </Link>
      </div>

      {myGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myGigs.map((gig) => (
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
                  <span className="text-sm text-gray-500">Posted: {new Date(gig.createdAt).toLocaleDateString()}</span>
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
        <div className="text-center py-16 card">
          <div className="text-gray-400 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Jobs Posted Yet</h3>
          <p className="text-gray-600 mb-8">You haven't posted any jobs. Start by creating your first job posting!</p>
          <Link 
            to="/create-gig" 
            className="btn-primary"
          >
            Post Your First Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyGigs;