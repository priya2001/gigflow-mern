import express from "express";
import { createGig, getAllGigs, getGigById, updateGig, deleteGig, getMyGigs } from "../controllers/gigController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .post(protect, createGig)
  .get(getAllGigs);

router.route("/my-gigs")
  .get(protect, getMyGigs);

router.route("/:id")
  .get(getGigById)
  .put(protect, updateGig)
  .delete(protect, deleteGig);

export default router;