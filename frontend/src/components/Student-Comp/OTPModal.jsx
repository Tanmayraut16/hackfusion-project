import React, { useState, useEffect } from "react";
import { Mail, Lock, X, ArrowRight, Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import OTPInput from "./OTPInput";

const OTPModal = ({ 
  email, 
  setEmail, 
  otp, 
  setOtp, 
  onClose, 
  onVerify 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const requestOTP = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid college email address");
      return;
    }

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
      setCountdown(60); // Start 60 second countdown for resend
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

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
      
      setSuccess(true);
      
      // Delay to show success state before closing
      setTimeout(() => {
        onVerify();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const resendOTP = () => {
    if (countdown === 0) {
      requestOTP();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div 
        className="w-full max-w-md bg-gradient-to-b from-zinc-900/90 to-black/90 rounded-xl 
                  border border-zinc-800/80 shadow-2xl overflow-hidden backdrop-blur-md
                  transition-all duration-300 animate-slideUp"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-zinc-900/50 border-b border-zinc-800/60">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-zinc-400 hover:text-white 
                     transition-colors hover:rotate-90 duration-300"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <Lock size={16} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">Verify Your Identity</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {step === 1 ? "Enter your college email to receive OTP" : "Enter the OTP sent to your email"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-3">
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 
                           ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-500/20 text-indigo-300'}`}>
              <span className="text-sm font-medium">1</span>
              {step > 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle size={16} className="text-indigo-300" />
                </div>
              )}
            </div>
            
            <div className={`h-0.5 w-16 transition-colors duration-300 ${
              step > 1 ? 'bg-indigo-500/70' : 'bg-zinc-800'
            }`} />
            
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 
                           ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-indigo-500/20 text-indigo-300/50'}`}>
              <span className="text-sm font-medium">2</span>
              {success && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
              )}
            </div>
          </div>

          <div className={`transition-all duration-500 transform ${
            step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'
          }`}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="relative">
                  <Mail 
                    size={20} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-all duration-300 group-focus-within:text-indigo-400" 
                  />
                  <input
                    type="email"
                    placeholder="Enter your college email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-3.5 bg-zinc-900/40 border border-zinc-800 rounded-lg 
                              text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 
                              focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200
                              shadow-inner backdrop-blur-sm"
                  />
                </div>
                
                <button
                  onClick={requestOTP}
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-lg 
                            font-medium transition-all duration-300 disabled:opacity-50 
                            disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 
                            text-white shadow-md hover:shadow-indigo-600/20 active:scale-98"
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
            )}
          </div>

          <div className={`transition-all duration-500 transform ${
            step === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'
          }`}>
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-2">
                  <p className="text-zinc-300 text-sm mb-2">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-indigo-400 font-medium">{email}</p>
                </div>
                
                <OTPInput 
                  value={otp}
                  onChange={setOtp}
                  length={6}
                  disabled={loading || success}
                />
                
                <button
                  onClick={verifyOTP}
                  disabled={loading || otp.length !== 6 || success}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-lg 
                            font-medium transition-all duration-300 disabled:opacity-50 
                            disabled:cursor-not-allowed shadow-md active:scale-98
                            ${success 
                              ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20' 
                              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'}`}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle size={18} />
                      <span>Verified Successfully</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() => setStep(1)}
                    className="text-zinc-400 hover:text-indigo-400 transition-colors"
                  >
                    Change Email
                  </button>
                  
                  <button
                    onClick={resendOTP}
                    disabled={countdown > 0 || loading}
                    className={`flex items-center space-x-1 transition-colors ${
                      countdown > 0 ? 'text-zinc-500 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
                    }`}
                  >
                    <RefreshCw size={14} className={countdown > 0 ? '' : 'animate-pulse'} />
                    <span>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-slideIn">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPModal;