import express from 'express';
import {
  createBooking,
  getBookings,
  getBooking,
  approveBooking,
  rejectBooking,
  listFacilities,
  verifyBooking,
} from '../controllers/booking.controller.js';
import { verifyAll, verifyFacultyOrAdmin, verifyStudentOrFaculty } from '../middlewares/auth.middlware.js'; 

const router = express.Router();

router.get('/facilities', verifyStudentOrFaculty, listFacilities);
router.post('/bookings', verifyStudentOrFaculty, createBooking);
router.get('/bookings', verifyAll, getBookings);
router.get('/bookings/:id', verifyStudentOrFaculty, getBooking);

// Admin-only route to approve a booking
router.put('/:id/approve', verifyFacultyOrAdmin, approveBooking);

// Admin-only route to reject a booking
// FIX: Changed from verifyStudentOrFaculty to verifyFacultyOrAdmin for security
router.put('/bookings/:id/reject', verifyFacultyOrAdmin, rejectBooking);

// This endpoint will be called by the Verification Page when a QR is scanned
router.get('/verify/:id', verifyAll, verifyBooking);

export default router;