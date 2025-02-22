import mongoose from "mongoose";
import Election from "../models/election.model.js";
import Student from "../models/students.model.js";
import base64url from "base64url"; // Import Base64 URL-safe encoding
import { verifyOTP, sendOTPEmail } from "../utils/emailServiceOTP.js";

export const createElection = async (req, res) => {
  try {
    const { title, startDate, endDate, positions } = req.body;
    console.log(req.body);
    // Check if election already exists
    const existingElection = await Election.findOne({ title });
    console.log(existingElection);
    if (existingElection) {
      return res.status(400).json({ message: "Election already exists" });
    }

    const newElection = new Election({
      title,
      startDate,
      endDate,
      positions,
    });
    console.log(`this is new election: ${newElection}`);

    await newElection.save();
    console.log("hleo blekjfa");
    // Encode the electionId using Base64 URL encoding
    const encodedElectionId = base64url(newElection._id.toString());
    console.log(encodedElectionId);

    return res.status(201).json({
      message: "Election created successfully",
      election: newElection,
      electionId: encodedElectionId, // Obfuscated ID
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Add a candidate to a specific position.
 */
export const addCandidate = async (req, res) => {
  try {
    const { electionId, positionName, email, manifesto } = req.body;

    // Decode the electionId before using it
    const decodedElectionId = base64url.decode(electionId);
    const election = await Election.findById(decodedElectionId);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const position = election.positions.find(
      (pos) => pos.name === positionName
    );
    if (!position) {
      return res
        .status(404)
        .json({ message: "Position not found in this election" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure candidate is not already added to this position
    const existingCandidate = position.candidates.find((cand) =>
      cand.student.equals(student._id)
    );
    if (existingCandidate) {
      return res
        .status(400)
        .json({ message: "Candidate already exists for this position" });
    }

    position.candidates.push({
      student: student._id,
      manifesto,
    });

    await election.save();
    return res
      .status(201)
      .json({ message: "Candidate added successfully", election });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Cast a vote for a candidate.
 * Expects: { electionId, positionName, candidateName }
 */

export const requestVoteOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email.endsWith("@sggs.ac.in")) {
      return res
        .status(403)
        .json({ message: "Only college-authenticated users can request OTP" });
    }

    await sendOTPEmail(email);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyVoterOTP = (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const castVote = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { electionId, positionName, candidateName } = req.body;

    // Validate required fields
    if (!electionId || !positionName || !candidateName) {
      return res
        .status(400)
        .json({ message: "Missing required fields", receivedData: req.body });
    }

    const voterEmail = req.user?.email;
    // console.log("Voter email:", voterEmail);

    if (!voterEmail || !voterEmail.endsWith("@sggs.ac.in")) {
      return res
        .status(403)
        .json({ message: "Only college-authenticated users can vote" });
    }

    const voter = await Student.findOne({ email: voterEmail });
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    // Validate electionId before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({ message: "Invalid election ID format" });
    }

    let election = await Election.findById(electionId);
    if (!election) {
      console.log("Election not found:", electionId);
      return res.status(404).json({ message: "Election not found" });
    }

    // console.log("Election before population:", election);
    election = await Election.findById(electionId).populate(
      "positions.candidates.student"
    );
    // console.log("Election after population:", election);

    // return res.status(200).json({ election });

    if (!election || !election.isActive) {
      return res
        .status(400)
        .json({ message: "Election not found or not active" });
    }

    const position = election.positions.find(
      (pos) => pos.name === positionName
    );
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    const normalizedCandidateName = candidateName.trim().toLowerCase();
    const candidate = position.candidates.find((cand) => {
      return (
        cand.student?.name?.trim().toLowerCase() === normalizedCandidateName
      );
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const alreadyVoted = position.candidates.some((cand) =>
      cand.voters.includes(voter._id)
    );
    if (alreadyVoted) {
      return res
        .status(422)
        .json({ message: "You have already voted for this position" });
    }

    candidate.votes += 1;
    candidate.voters.push(voter._id);

    await election.save();
    return res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    console.error("Vote Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get live results for an election.
 */
export const getResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const decodedElectionId = base64url.decode(electionId);
    const election = await Election.findById(decodedElectionId).populate(
      "positions.candidates.student"
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const results = election.positions.map((position) => ({
      position: position.name,
      candidates: position.candidates.sort((a, b) => b.votes - a.votes),
    }));

    return res.status(200).json({ election: election.title, results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get the number of votes for a specific position.
 */
export const getPositionVotes = async (req, res) => {
  try {
    const { electionId, positionName } = req.params;
    const decodedElectionId = base64url.decode(electionId);
    const election = await Election.findById(decodedElectionId).populate(
      "positions.candidates.student"
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const position = election.positions.find(
      (pos) => pos.name === positionName
    );
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    const results = position.candidates.map((cand) => ({
      candidate: cand.student.name,
      votes: cand.votes,
    }));

    return res.status(200).json({ position: positionName, results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get the vote count for a specific candidate in a given position.
 *
 * Expects in req.params:
 *  - electionId (Base64 encoded)
 *  - positionName
 *  - candidateName
 *
 * Returns: { candidate, votes }
 */
export const getCandidateVotes = async (req, res) => {
  try {
    const { electionId, positionName, candidateName } = req.params;
    const decodedElectionId = base64url.decode(electionId);
    const election = await Election.findById(decodedElectionId).populate(
      "positions.candidates.student"
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const position = election.positions.find(
      (pos) => pos.name === positionName
    );
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    // Safely search for the candidate by name (case-insensitive, trimming whitespace)
    const normalizedCandidateName = candidateName.trim().toLowerCase();
    const candidate = position.candidates.find((cand) => {
      const storedName = cand.student.name || "";
      return storedName.trim().toLowerCase() === normalizedCandidateName;
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    return res.status(200).json({
      candidate: candidate.student.name,
      votes: candidate.votes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all elections
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch elections" });
  }
};

// Get election by ID
export const getElectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id).populate({
      path: "positions.candidates.student",
      model: "Student",
      select: "name email department", // Select the fields you want to return
    });

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    res.status(200).json(election);
  } catch (error) {
    console.error("Error in getElectionById:", error);
    res.status(500).json({ error: "Failed to fetch election details" });
  }
};

export const getVoters = async (req, res) => {
  try {
    // Ensure req.user is set by your auth middleware
    const userId = req.user._id;

    // Fetch the election and populate the candidate's student field
    const election = await Election.findById(req.params.id).populate(
      "positions.candidates.student"
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Convert to plain object so we can modify it
    const electionObj = election.toObject();

    // For each position, check if the user has voted (i.e. exists in any candidate's voters array)
    electionObj.positions = electionObj.positions.map((position) => {
      let hasVoted = false;
      let votedCandidate = null;

      // For each candidate, add a computed property "hasVoted"
      position.candidates = position.candidates.map((candidate) => {
        // Check if current userId exists in the voters array for this candidate
        const voterIds = candidate.voters.map((v) => v.toString());
        const candidateHasVoted = voterIds.includes(userId.toString());
        if (candidateHasVoted) {
          hasVoted = true;
          votedCandidate = candidate;
        }
        return { ...candidate, hasVoted: candidateHasVoted };
      });

      return { ...position, hasVoted, votedCandidate };
    });

    // Return the election with the additional info
    res.json(electionObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
