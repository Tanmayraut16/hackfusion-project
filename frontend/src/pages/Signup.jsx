import React, { useState, useRef } from "react";
import {
  LockKeyhole,
  Mail,
  UserCircle2,
  School,
  GraduationCap,
  Building2,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics and Telecommunication",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Textile Engineering",
  "Instrumentation Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

const departmentCodes = {
  "Computer Science": "bcs",
  "Information Technology": "bit",
  "Electronics and Telecommunication": "bec",
  "Mechanical Engineering": "bme",
  "Civil Engineering": "bce",
  "Electrical Engineering": "bee",
  "Instrumentation Engineering": "bin",
};

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Fill info, Step 2: Enter OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef([]);

  // Initialize the input refs array
  if (!inputRefs.current.length) {
    inputRefs.current = Array(6).fill().map(() => React.createRef());
  }

  const validateStudentEmail = (email, department) => {
    if (role !== "student") return true;
    const deptCode = departmentCodes[department];
    if (!deptCode) return false;
    const emailRegex = new RegExp(`^\\d{4}${deptCode}\\d{3}@sggs\\.ac\\.in$`);
    return emailRegex.test(email.toLowerCase());
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setFormData({ name: "", email: "", password: "", department: "" });
    setOtpSent(false);
    setOtpValues(["", "", "", "", "", ""]);
    setCurrentStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "department" || name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = {};

    // Validate all fields are filled
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!formData.department) {
      newErrors.department = "Please select your department";
      isValid = false;
    }

    // Validate student email format if role is student
    if (role === "student" && formData.email && formData.department) {
      const isValidEmail = validateStudentEmail(
        formData.email,
        formData.department
      );
      if (!isValidEmail) {
        newErrors.email = `Invalid email format. Email should be in the format: ####${
          departmentCodes[formData.department] || "xxx"
        }###@sggs.ac.in`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!validateStep1()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/election/vote/request-otp`,
        {
          email: formData.email,
        }
      );

      if (response.data.success) {
        setOtpSent(true);
        setCurrentStep(2); // Move to OTP step
        toast.success("OTP sent to your email address");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleOtpChange = (index, value) => {
    // Only accept numbers
    if (value && !/^\d+$/.test(value)) return;

    // Allow only one digit per input
    const digit = value.slice(-1);

    // Create a new array with the updated value
    const newOtpValues = [...otpValues];
    newOtpValues[index] = digit;
    setOtpValues(newOtpValues);

    // If we entered a digit and there's a next input, focus it
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press for navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otpValues[index] === "" && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        inputRefs.current[index - 1]?.focus();
      } else if (otpValues[index] !== "") {
        // If current input has a value, clear it
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move to previous input on left arrow
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move to next input on right arrow
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event to distribute digits across inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Filter out non-numeric characters
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    // Fill the OTP inputs with pasted digits
    const newOtpValues = [...otpValues];
    digits.forEach((digit, index) => {
      if (index < 6) newOtpValues[index] = digit;
    });

    setOtpValues(newOtpValues);

    // Focus the input after the last pasted digit
    if (digits.length < 6) {
      inputRefs.current[digits.length]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get OTP from otpValues array
    const otpString = otpValues.join("");
    
    if (!otpSent || otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // First verify OTP
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/election/verify-otp`,
        {
          email: formData.email,
          otp: otpString,
        }
      );

      if (verifyResponse.data.verified) {
        // If OTP is verified, proceed with registration
        const endpoint =
          role === "faculty"
            ? `${import.meta.env.VITE_API_URL}/api/faculty-login/register`
            : `${import.meta.env.VITE_API_URL}/api/student-login/register`;

        const response = await axios.post(endpoint, formData);

        toast.success("Registration successful!");
        setFormData({ name: "", email: "", password: "", department: "" });
        setRole("");
        setOtpValues(["", "", "", "", "", ""]);
        setOtpSent(false);
        setCurrentStep(1);

        // Redirect to login after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(verifyResponse.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-white text-sm font-medium block">
          Full Name
        </label>
        <div className="relative">
          <UserCircle2
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300"
            size={20}
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full bg-white/5 border ${
              errors.name ? "border-red-500" : "border-white/10"
            } text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30`}
            placeholder="John Doe"
            required
          />
        </div>
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium block">
          Email Address
        </label>
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300"
            size={20}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full bg-white/5 border ${
              errors.email ? "border-red-500" : "border-white/10"
            } text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30`}
            placeholder={
              role === "student"
                ? "1234bcs123@sggs.ac.in"
                : "your.email@sggs.ac.in"
            }
            required
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium block">Password</label>
        <div className="relative">
          <LockKeyhole
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300"
            size={20}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full bg-white/5 border ${
              errors.password ? "border-red-500" : "border-white/10"
            } text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30`}
            placeholder="••••••••"
            required
          />
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm font-medium block">
          Department
        </label>
        <div className="relative">
          <Building2
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300"
            size={20}
          />
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full bg-white/5 border ${
              errors.department ? "border-red-500" : "border-white/10"
            } text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none`}
            required
          >
            <option value="" className="bg-slate-800">
              Select your department
            </option>
            {departments.map((dept, index) => (
              <option key={index} value={dept} className="bg-slate-800">
                {dept}
              </option>
            ))}
          </select>
        </div>
        {errors.department && (
          <p className="text-red-400 text-sm mt-1">{errors.department}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSendOTP}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/20"
      >
        {isLoading ? (
          "Sending OTP..."
        ) : (
          <>
            Send OTP <ArrowRight size={20} />
          </>
        )}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-purple-500/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-purple-500/30">
        <p className="text-white text-sm text-center">
          We've sent a verification code to <strong>{formData.email}</strong>
        </p>
      </div>

      <div className="flex justify-center gap-2 md:gap-3" onPaste={handlePaste}>
        {otpValues.map((digit, index) => (
          <div key={index} className="relative">
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-10 h-14 md:w-12 md:h-16 bg-white/5 border ${
                digit ? "border-purple-400" : "border-white/10"
              } text-white text-xl md:text-2xl font-mono text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                digit ? "scale-105" : "scale-100"
              }`}
              aria-label={`Digit ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading || otpValues.some(v => v === "")}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Complete Registration"}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSendOTP}
          className="text-purple-300 hover:text-purple-200 text-sm underline underline-offset-4 transition-colors"
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left side - Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80"
            alt="Campus Life"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-center">
          {/* Title */}
          <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Join Our Campus Community
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-white/90 max-w-md mb-6 drop-shadow-md">
            Start your academic journey with us. Get access to world-class
            resources and connect with peers and mentors.
          </p>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-purple-200">Join our academic community</p>
          </div>

          {!role ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white text-center">
                I am a...
              </h3>
              <button
                onClick={() => handleRoleSelect("student")}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
              >
                <GraduationCap size={24} />
                Student
              </button>
              <button
                onClick={() => handleRoleSelect("faculty")}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-400 to-violet-600 text-white py-4 px-6 rounded-xl hover:from-violet-500 hover:to-violet-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-violet-500/20"
              >
                <School size={24} />
                Faculty Member
              </button>
              <div className="text-center">
                <p className="text-center text-sm text-gray-200">
                  Have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-300 hover:text-blue-200 font-medium underline underline-offset-4 transition-colors"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 1 ? "bg-purple-500" : "bg-purple-500/50"
                    }`}
                  >
                    <span className="text-white font-medium">1</span>
                  </div>
                  <span className="text-white/70 text-xs mt-1">
                    Information
                  </span>
                </div>

                <div className="flex-1 h-1 mx-2 bg-white/10">
                  <div
                    className={`h-full bg-purple-500 ${
                      currentStep === 2 ? "w-full" : "w-0"
                    } transition-all duration-300`}
                  ></div>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 2 ? "bg-purple-500" : "bg-white/10"
                    }`}
                  >
                    <span className="text-white font-medium">2</span>
                  </div>
                  <span className="text-white/70 text-xs mt-1">
                    Verification
                  </span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
                <p className="text-white flex items-center justify-center gap-2">
                  {role === "student" ? (
                    <GraduationCap size={20} />
                  ) : (
                    <School size={20} />
                  )}
                  Registering as <strong>{role.toUpperCase()}</strong>
                </p>
              </div>

              {currentStep === 1 ? renderStep1() : renderStep2()}

              {currentStep === 1 && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setRole("")}
                    className="text-purple-300 hover:text-purple-200 font-medium underline underline-offset-4 transition-colors"
                  >
                    ← Change role
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;