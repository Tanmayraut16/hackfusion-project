import React, { useState } from "react";
import {
  LockKeyhole,
  Mail,
  UserCircle2,
  School,
  GraduationCap,
  Building2,
  KeyRound,
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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
    setShowOTPInput(false);
    setOtpSent(false);
    setOTP("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "department" || name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    if (role === "student") {
      const isValidEmail = validateStudentEmail(
        formData.email,
        formData.department
      );
      if (!isValidEmail) {
        setErrors({
          email: `Invalid email format. Email should be in the format: ####${
            departmentCodes[formData.department] || "xxx"
          }###@sggs.ac.in`,
        });
        toast.error("Please use a valid college email address");
        return;
      }
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
        setShowOTPInput(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent || !otp) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    setIsLoading(true);
    try {
      // First verify OTP
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/election/verify-otp`,
        {
          email: formData.email,
          otp: otp,
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
        setOTP("");
        setShowOTPInput(false);
        setOtpSent(false);

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
                onClick={() => setRole("student")}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
              >
                <GraduationCap size={24} />
                Student
              </button>
              <button
                onClick={() => setRole("faculty")}
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
                      className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email verification section */}
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium block">
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
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
                        disabled={otpSent}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={isLoading || otpSent}
                      className="px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      {otpSent ? "Sent" : "Send OTP"}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* OTP Input field */}
                {showOTPInput && (
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium block">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <KeyRound
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300"
                        size={20}
                      />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium block">
                    Password
                  </label>
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
                      className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30"
                      placeholder="••••••••"
                      required
                    />
                  </div>
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
                      className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                      required
                    >
                      <option value="" className="bg-slate-800">
                        Select your department
                      </option>
                      {departments.map((dept, index) => (
                        <option
                          key={index}
                          value={dept}
                          className="bg-slate-800"
                        >
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !otpSent}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/20"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setRole("")}
                  className="text-purple-300 hover:text-purple-200 font-medium underline underline-offset-4 transition-colors"
                >
                  ← Change role
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
