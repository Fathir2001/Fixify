const express = require('express');
const { registerServiceNeeder } = require('../controllers/serviceNeederController');
const router = express.Router();

router.post('/register', registerServiceNeeder);

module.exports = router;