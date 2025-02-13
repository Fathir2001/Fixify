const express = require('express');
const router = express.Router();
const { registerServiceProvider } = require('../controllers/requestedServiceProvider.js');

router.post('/register', registerServiceProvider);

module.exports = router;