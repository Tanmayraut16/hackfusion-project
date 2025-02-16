import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login  from './pages/Login';
import Signup from './pages/Signup';
import StudentHome from './pages/Student/StudentHome';
import FacultyHome from './pages/Faculty/FacultyHome';
import AdminHome from './pages/Admin/AdminHome';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/student-home' element={<StudentHome />} />
          <Route path='/faculty-home' element={<FacultyHome />} />
          <Route path='/admin-home' element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
