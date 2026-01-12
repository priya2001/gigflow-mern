import express from "express";
import { createBid, getBids, hireBid } from "../controllers/bidController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .post(protect, createBid);

router.route("/gig/:gigId")
  .get(protect, getBids);

router.route("/:bidId/hire")
  .patch(protect, hireBid);

export default router;