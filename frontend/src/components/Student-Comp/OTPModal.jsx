import React, { useState } from "react";
import { Mail, Lock, X, ArrowRight, Loader2 } from "lucide-react";

const OTPModal = ({ email, setEmail, otp, setOtp, onClose, onVerify }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const requestOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/vote/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
      setStep(2); // Move to OTP input step
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/election/verify-otp`, {
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 bg-zinc-900/50 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-medium text-white">Verify Your Identity</h2>
          <p className="text-sm text-zinc-400 mt-1">
            {step === 1 ? "Enter your college email to receive OTP" : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              step === 1 ? 'bg-indigo-500' : 'bg-indigo-500/20'
            }`} />
            <div className="w-16 h-0.5 bg-zinc-800" />
            <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              step === 2 ? 'bg-indigo-500' : 'bg-indigo-500/20'
            }`} />
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  placeholder="Enter your college email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                onClick={requestOTP}
                disabled={loading || !email}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading || !otp}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Change Email
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPModal;