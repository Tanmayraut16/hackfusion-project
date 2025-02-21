import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { Input } from "../components/Input.jsx";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

      // Use switch case for role-based API endpoint selection
      switch (role) {
        case "student":
          endpoint = "http://localhost:3000/api/student-login/login";
          break;
        case "faculty":
          endpoint = "http://localhost:3000/api/faculty-login/login";
          break;
        case "admin":
          if (email === "doctor@sggs.ac.in") {
            endpoint = "http://localhost:3000/api/doctor/login";
          } else {
            endpoint = "http://localhost:3000/api/admin/login";
          }
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

      // Store user role and token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "role",
        email === "doctor@sggs.ac.in" ? "doctor" : role
      );

      toast.success("Login successful");
      console.log(
        "Redirecting to:",
        `/${email === "doctor@sggs.ac.in" ? "doctor" : role}`
      );

      setTimeout(() => {
        navigate(`/${email === "doctor@sggs.ac.in" ? "doctor" : role}/`);
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      {!role ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 text-center">
            Select Your Role
          </h2>
          <button
            onClick={() => setRole("student")}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            Login as Student
          </button>
          <button
            onClick={() => setRole("faculty")}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
          >
            Login as Faculty
          </button>
          <button
            onClick={() => setRole("admin")}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
          >
            Login as Admin
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-center text-sm text-gray-600">
            Logging in as <strong>{role.toUpperCase()}</strong>
          </p>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@college.com"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default Login;
