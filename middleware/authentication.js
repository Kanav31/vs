const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/unauthenticated');


const auth = (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach the routes where we want to redirect the user like our main skillswap page
        req.user = { userId: payload.userId, name: payload.name };
        // const {email} = req.body;
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = auth;