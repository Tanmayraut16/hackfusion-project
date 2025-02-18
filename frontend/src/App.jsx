import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentHome from './pages/Student/StudentHome';
import FacultyHome from './pages/Faculty/FacultyHome';
import AdminHome from './pages/Admin/AdminHome';
import DoctorHome from './pages/Docter/DoctorHome';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            {/* Student Routes */}
            <Route element={<RoleBasedRoute allowedRoles={["student"]} />}>
              <Route path='/student/*' element={<StudentHome />} />
            </Route>

            {/* Faculty Routes */}
            <Route element={<RoleBasedRoute allowedRoles={["faculty"]} />}>
              <Route path='/faculty/*' element={<FacultyHome />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
              <Route path='/admin/*' element={<AdminHome />} />
            </Route>

            {/* Docter Routes */}
            <Route element={<RoleBasedRoute allowedRoles={["doctor"]} />}>
              <Route path='/doctor/*' element={<DoctorHome />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

