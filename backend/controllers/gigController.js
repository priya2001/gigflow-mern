import Gig from "../models/Gig.js";

// Create a new gig
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Validate required fields
    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and budget'
      });
    }

    // Create new gig
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig
    });
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during gig creation'
    });
  }
};

// Get all open gigs (with search capability)
export const getGigs = async (req, res) => {
  try {
    const { search } = req.query;

    // Build query
    let query = { status: 'open' };
    
    // Add search functionality
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case insensitive search
    }

    const gigs = await Gig.find(query).populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during fetching gigs'
    });
  }
};