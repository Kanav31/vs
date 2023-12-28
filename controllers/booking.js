const Booking = require('../models/booking');

const calculateCharge = (typeOfAppointment) => {
    const charges = {
        'in-clinit': 500,
        'audio': 525,
        'video': 525,
    };

    return charges[typeOfAppointment] || 0;
};

const bookSlot = async (req, res) => {
    try {
        const { user, date, typeOfAppointment } = req.body;

        const doctorInfo = {
            name: 'Dr. Your Doctor',
            specialization: 'Specialization',
            bio: 'Doctor\'s bio goes here.',
            experience: '12 years of experience',
            clinicName: 'Your Clinic',
        };

        const charge = calculateCharge(typeOfAppointment);

        const newBooking = new Booking({ user, doctor: doctorInfo, date, typeOfAppointment, charge });
        await newBooking.save();

        res.json({ message: 'Booking successful.', booking: newBooking });
    } catch (error) {
        console.error('Error booking slot:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    bookSlot,
};
