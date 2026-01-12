import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import mongoose from "mongoose";
import { notifyFreelancerHired, notifyClientNewBid } from "../utils/notifications.js";

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Validate required fields
    if (!gigId || !message || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide gigId, message, and price'
      });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot bid on a closed gig'
      });
    }

    // Check if user is the owner of the gig (can't bid on own gig)
    if (gig.ownerId.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bid on your own gig'
      });
    }

    // Check if user already submitted a bid for this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }

    // Create new bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price
    });

    // Get gig details to notify the client
    const gigDetails = await Gig.findById(gigId);
    if (gigDetails) {
      notifyClientNewBid(gigDetails.ownerId, {
        gigId: gigDetails._id,
        gigTitle: gigDetails.title,
        bidderName: req.user.name,
        bidId: bid._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid
    });
  } catch (error) {
    console.error('Submit bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bid submission'
    });
  }
};

export const getBids = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user owns the gig
    if (gig.ownerId.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email');

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    console.error('Get bids for gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during fetching bids'
    });
  }
};

export const hireBid = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bidId = req.params.bidId;

      // Find the bid
      const bid = await Bid.findById(bidId).session(session);
      if (!bid) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: 'Bid not found'
        });
      }

      // Find the associated gig
      const gig = await Gig.findById(bid.gigId).session(session);
      if (!gig) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: 'Gig not found'
        });
      }

      // Check if the requesting user is the owner of the gig
      if (gig.ownerId.toString() !== req.user.id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({
          success: false,
          message: 'Not authorized to hire for this gig'
        });
      }

      // Check if the gig is still open
      if (gig.status !== 'open') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: 'Gig is no longer open for hiring'
        });
      }

      // Update the selected bid to 'hired'
      await Bid.findByIdAndUpdate(
        bidId,
        { status: 'hired' },
        { new: true, session }
      );

      // Update the gig status to 'assigned'
      await Gig.findByIdAndUpdate(
        bid.gigId,
        { status: 'assigned' },
        { new: true, session }
      );

      // Reject all other bids for this gig
      await Bid.updateMany(
        {
          gigId: bid.gigId,
          _id: { $ne: bidId },
          status: 'pending'
        },
        { status: 'rejected' },
        { session }
      );

      // Get gig title for notification
      const gigInfo = await Gig.findById(bid.gigId);
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Send real-time notification to the hired freelancer
      notifyFreelancerHired(bid.freelancerId, gigInfo.title);

      res.status(200).json({
        success: true,
        message: 'Freelancer hired successfully',
        data: {
          bid: bidId,
          gig: bid.gigId,
          hiredFreelancerId: bid.freelancerId
        }
      });
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Hire freelancer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during hiring process'
    });
  }
};