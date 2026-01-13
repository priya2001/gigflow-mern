import express from "express";
import { createBid, getBidsForGig, getMyBids, hireBid, updateBid, deleteBid } from "../controllers/bidController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .post(protect, createBid);

router.route("/my-bids")
  .get(protect, getMyBids);

router.route("/gig/:gigId")
  .get(protect, getBidsForGig);

router.route("/:bidId/hire")
  .put(protect, hireBid);

router.route("/:bidId")
  .put(protect, updateBid)
  .delete(protect, deleteBid);

export default router;