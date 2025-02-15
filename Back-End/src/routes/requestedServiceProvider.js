const express = require('express');
const router = express.Router();
const { registerServiceProvider, getAllServiceProviders, approveServiceProvider } = require('../controllers/requestedServiceProvider.js');

router.post('/register', registerServiceProvider);
router.get('/all', getAllServiceProviders);
router.put('/approve/:providerId', approveServiceProvider);

module.exports = router;