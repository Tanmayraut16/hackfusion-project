import React, { useState } from "react";

const OTPModal = ({ email, setEmail, otp, setOtp, onClose, onVerify }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/election/vote/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/election/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");
      onVerify();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
        <input
          type="email"
          placeholder="Enter College Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          onClick={requestOTP}
          className="w-full bg-blue-500 text-white p-2 rounded mb-3"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          onClick={verifyOTP}
          className="w-full bg-green-500 text-white p-2 rounded mb-3"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button onClick={onClose} className="w-full bg-gray-400 text-white p-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
