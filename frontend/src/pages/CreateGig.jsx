import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createGig } from '../store/gigSlice';
import { useNavigate } from 'react-router-dom';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const { loading, error, message } = useSelector((state) => state.gigs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert budget to number
    const gigData = {
      ...formData,
      budget: Number(formData.budget)
    };
    
    dispatch(createGig(gigData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFormData({
          title: '',
          description: '',
          budget: ''
        });
        // Redirect to dashboard after successful creation
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h2>
          <p className="text-gray-600">Fill out the details to create your job posting</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-3 font-medium">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g. Build a responsive website"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-gray-700 mb-3 font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe what you need done..."
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="budget" className="block text-gray-700 mb-3 font-medium">Budget ($)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g. 500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;