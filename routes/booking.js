const express = require('express');
const { bookSlot } = require('../controllers/booking');


const router = express.Router();

router.post('/bookslot', bookSlot);

module.exports = router;
