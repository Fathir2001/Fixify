const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getServiceNeederRequests,
  getServiceProviderRequests,
  updateRequestStatus
} = require('../controllers/serviceRequestController');
const authMiddleware = require('../middleware/auth');

// Create service request
router.post('/create', authMiddleware, createServiceRequest);

// Get service needer's requests
router.get('/my-requests', authMiddleware, getServiceNeederRequests);

// Get service provider's requests
router.get('/provider-requests', authMiddleware, getServiceProviderRequests);

// Update request status (accept/reject/complete)
router.patch('/:requestId/status', authMiddleware, updateRequestStatus);

module.exports = router;