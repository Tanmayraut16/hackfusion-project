import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Input } from '../components/Input.jsx';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setFormData({ name: '', email: '', password: '' }); // Reset form when changing role
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
      const endpoint = role === 'faculty'
        ? 'http://localhost:3000/api/faculty-login/register'
        : 'http://localhost:3000/api/student-login/register';

      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success(response.data.message || 'Registration successful. Please wait for admin verification.');

      // Reset form after successful registration
      setFormData({ name: '', email: '', password: '' });
      setRole('');

      setTimeout(() => {
        navigate('/login'); // Redirect to login
      }, 1500); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an Account">
      {!role ? (
        // Step 1: Role Selection
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-medium text-gray-700">Select your role:</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Student
            </button>
            <button
              onClick={() => handleRoleSelect('faculty')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Faculty
            </button>
          </div>
        </div>
      ) : (
        // Step 2: Registration Form
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Register as {role === 'student' ? 'Student' : 'Faculty'}
          </h2>

          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.name@college.com"
            error={errors.email}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => setRole('')} // Back to role selection
            className="w-full text-gray-500 hover:underline mt-2"
          >
            Change Role
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default Signup;
