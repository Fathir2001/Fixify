const express = require('express');
const router = express.Router();
const { registerServiceProvider, getAllServiceProviders } = require('../controllers/requestedServiceProvider.js');

router.post('/register', registerServiceProvider);
router.get('/all', getAllServiceProviders);

module.exports = router;