const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/booking');
const authenticateUser = require('./middleware/authentication');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// db
const connectDB = require('./db/connect');

// User routes
app.use('/api/v1/user', userRoutes);

// booking route
app.use('/api/v1/bookings', authenticateUser, bookingRoutes);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();

