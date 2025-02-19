const express = require('express');
const { registerServiceNeeder, loginServiceNeeder } = require('../controllers/serviceNeederController');
const router = express.Router();

router.post('/register', registerServiceNeeder);
router.post('/login', loginServiceNeeder);

module.exports = router;