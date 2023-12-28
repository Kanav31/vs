const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true }, // Assuming user is identified by some identifier
    doctor: {
        name: { type: String, required: true },
        specialization: { type: String, required: true },
        bio: { type: String, required: true },
        experience: { type: String, required: true },
        clinicName: { type: String, required: true }, // Add clinic name field
    },
    date: { type: Date, required: true },
    typeOfAppointment: { type: String, enum: ['audio', 'video', 'in-person'], required: true },
    charge: { type: Number, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
