import React, { useState } from "react";
import {
  LockKeyhole,
  Mail,
  UserCircle2,
  School,
  GraduationCap,
  Building2,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
// import { AuthLayout } from "../components/AuthLayout.jsx";

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

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setFormData({ name: "", email: "", password: "", department: "" }); // Reset form when changing role
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const endpoint =
        role === "faculty"
          ? "http://localhost:3000/api/faculty-login/register"
          : "http://localhost:3000/api/student-login/register";

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(
        response.data.message ||
          "Registration successful. Please wait for admin verification."
      );

      // Reset form after successful registration
      setFormData({ name: "", email: "", password: "", department: "" });
      setRole("");

      setTimeout(() => {
        navigate("/login"); // Redirect to login
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
                      className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/30"
                      placeholder="your.email@college.com"
                      required
                    />
                  </div>
                </div>

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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-purple-500/20"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center">
                <button
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
