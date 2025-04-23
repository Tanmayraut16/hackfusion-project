import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return token;
};

// Configure headers with token
const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
};

// Fetch all elections
export const fetchAllElections = async () => {
  try {
    const response = await axios.get(`${API_URL}/election/elections`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching elections:", error);
    throw error;
  }
};

// Create a new election
export const createElection = async (electionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/election/`,
      electionData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating election:", error);
    throw error;
  }
};

// Additional election-related API calls can be added here