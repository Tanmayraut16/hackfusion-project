import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'userModel', // Points to the field below
        required: true 
    },
    userModel: { 
        type: String, 
        required: true, 
        enum: ['Student', 'Faculty'] // Matches the userType sent from frontend
    },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    approval_status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    reason: { type: String },
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;