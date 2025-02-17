import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login  from './pages/Login';
import Signup from './pages/Signup';
import StudentHome from './pages/Student/StudentHome';
import FacultyHome from './pages/Faculty/FacultyHome';
import AdminHome from './pages/Admin/AdminHome';
import DocterDashboard from './pages/Docter/DocterDashboard';
import LeaveApplication from './pages/Docter/LeaveApplication';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/student/*' element={<StudentHome />} />
          <Route path='/faculty/*' element={<FacultyHome />} />
          <Route path='/admin/*' element={<AdminHome />} />
          <Route path='/docter' element={<DocterDashboard />} />
          <Route path='/docter/leave-application' element={<LeaveApplication />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
