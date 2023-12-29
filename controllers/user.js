const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../errors/bad-requests');
const { UnauthenticatedError } = require('../errors/unauthenticated');


// Function to generate a random numeric OTP
const generateNumericOTP = (length) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// Function to hash the password using bcrypt
// const hashPassword = async (password) => {
//     const saltRounds = 10;
//     return bcrypt.hash(password, saltRounds);
// };

// Signup route for user registration
const signup = async (req, res) => {
    try {
        const { name, email } = req.body;

        const otp = generateNumericOTP(6);
        // const hashedPassword = await hashPassword(password);

        // Use "pending" as the initial verification status
        const newUser = new User({ name, email, verificationStatus: 'pending', otp });
        await newUser.save();

        // Send verification email with OTP
        await sendVerificationEmail(email, otp);

        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'User signed up successfully. Verification email sent.', newUser, token });
    } catch (error) {
        console.error('Error signing up:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, otp: req.body.otp });

        if (!user) {
            return res.status(404).json({ error: 'User not found or OTP is incorrect.' });
        }

        // Update the verification status to "verified"
        user.verificationStatus = 'verified';
        await user.save();

        res.json({ message: 'User verified successfully. Redirect to main doctor page.' });
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// const signin = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         throw new BadRequestError('Please provide email and password');
//     }

//     const user = await User.findOne({ email });
//     console.log(user);

//     if (!user) {
//         throw new UnauthenticatedError('Invalid Credentials');
//     }

//     const isPasswordMatch = await user.comparePassword(password);

//     if (!isPasswordMatch) {
//         throw new UnauthenticatedError('Invalid Credentials');
//     }

//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ message: 'User signed in successfully.', token });
// };
// // Function to send verification email
const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error.message);
        throw error;
    }
};



module.exports = {
    signup,
    verifyOTP,
    // signin
};
