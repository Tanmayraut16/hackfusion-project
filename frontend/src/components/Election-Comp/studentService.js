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

// Fetch all students
export const fetchAllStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/details/allStudents`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};