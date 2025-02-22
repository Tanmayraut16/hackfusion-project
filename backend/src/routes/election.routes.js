import express from "express";
import {
  createElection,
  addCandidate,
  castVote,
  requestVoteOTP,
  getResults,
  getPositionVotes,
  getCandidateVotes,
  getAllElections,
  getElectionById,
  verifyVoterOTP,
  getVoters,
} from "../controllers/election.controller.js";
import {
  verifyToken,
  verifyAdmin,
  verifyStudent,
} from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createElection);
router.post("/candidate", verifyToken, verifyAdmin, addCandidate);
router.post("/vote/request-otp", requestVoteOTP);
router.post("/verify-otp", verifyVoterOTP); // OTP verification endpoint
router.post("/vote", verifyStudent, castVote);
router.get("/:electionId/results", getResults);
// Route to get real-time votes for all candidates in a specific position
router.get("/:electionId/positions/:positionName/votes", getPositionVotes);
router.get("/elections", getAllElections); // Fetch all elections
router.get("/elections/:id", getElectionById); // Fetch a specific election by ID

// Route to get the number of votes for a specific candidate in a specific position
router.get(
  "/:electionId/positions/:positionName/candidate/:candidateName/votes",
  getCandidateVotes
);

// Route to get all elections
router.get("/elections", getAllElections);

// Route to get election by ID
router.get("/elections/:id", getElectionById);

router.get("/voters/:id", verifyStudent, getVoters);

export default router;
