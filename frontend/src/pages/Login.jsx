import React, { useState } from "react";
import {
  LockKeyhole,
  Mail,
  UserCircle2,
  School,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
// import { AuthLayout } from "../components/AuthLayout.jsx";
// import { Input } from "../components/Input.jsx";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!role) {
      toast.error("Please select your role before logging in.");
      setIsLoading(false);
      return;
    }

    try {
      const credentials = { email, password };
      let endpoint = "";

      switch (role) {
        case "student":
          endpoint = `${import.meta.env.VITE_API_URL}/api/student-login/login`;
          break;
        case "faculty":
          endpoint = `${import.meta.env.VITE_API_URL}/api/faculty-login/login`;
          break;
        case "admin":
          endpoint =
            email === "doctor@sggs.ac.in"
              ? `${import.meta.env.VITE_API_URL}/api/doctor/login`
              : `${import.meta.env.VITE_API_URL}/api/admin/login`;
          break;
        default:
          toast.error("Invalid role selected");
          setIsLoading(false);
          return;
      }

      const response = await axios.post(endpoint, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      const { user, token } = response.data;
      const userRole = email === "doctor@sggs.ac.in" ? "doctor" : role;

      // Use AuthContext's login to update state and localStorage
      login({ token, role: userRole });

      toast.success("Login successful");
      navigate(`/${userRole}/`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Left side - Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80"
            alt="Campus"
            className="h-full w-full object-cover opacity-60" // Added opacity to the image
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-50" />{" "}
          {/* More opaque gradient */}
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-center">
          {/* Title */}
          <h1 className="text-7xl font-extrabold text-white mb-4 drop-shadow-lg">
            Campus Portal
          </h1>

          {/* Subtitle */}
          <p className="text-3xl text-white/90 max-w-md mb-6 drop-shadow-md">
            Access your academic resources, manage courses, and connect with
            your institution.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-200">Please sign in to continue</p>
          </div>

          {!role ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white text-center">
                Select Your Role
              </h3>
              <button
                onClick={() => setRole("student")}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-emerald-500/20"
              >
                <GraduationCap size={24} />
                Login as Student
              </button>
              <button
                onClick={() => setRole("faculty")}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-400 to-violet-600 text-white py-4 px-6 rounded-xl hover:from-violet-500 hover:to-violet-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-violet-500/20"
              >
                <School size={24} />
                Login as Faculty
              </button>
              <button
                onClick={() => setRole("admin")}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white py-4 px-6 rounded-xl hover:from-rose-500 hover:to-rose-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-rose-500/20"
              >
                <ShieldCheck size={24} />
                Login as Admin
              </button>
              <div className="text-center">
                {/* <button
                  onClick={() => setRole("")}
                  className="text-blue-300 hover:text-blue-200 font-medium underline underline-offset-4 transition-colors"
                >
                  Do not have an account? Sign up here
                </button> */}
                <p className="text-center text-sm text-gray-200">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-300 hover:text-blue-200 font-medium underline underline-offset-4 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
                <p className="text-white flex items-center justify-center gap-2">
                  <UserCircle2 size={20} />
                  Logging in as <strong>{role.toUpperCase()}</strong>
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30"
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
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300"
                      size={20}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/30"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/20"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setRole("")}
                  className="text-blue-300 hover:text-blue-200 font-medium underline underline-offset-4 transition-colors"
                >
                  ← Go back to role selection
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
