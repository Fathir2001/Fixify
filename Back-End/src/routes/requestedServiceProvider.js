const express = require("express");
const router = express.Router();
const {
  registerServiceProvider,
  getAllServiceProviders,
  approveServiceProvider,
  getApprovedServiceProviders,
  rejectServiceProvider,
  getRejectedServiceProviders,
  loginServiceProvider,
  getServiceProviderProfile,
  updateServiceProviderProfile,
} = require("../controllers/requestedServiceProvider.js");
const authMiddleware = require('../middleware/auth');

router.post("/register", registerServiceProvider);
router.get("/all", getAllServiceProviders);
router.put("/approve/:providerId", approveServiceProvider);
router.get("/approved", getApprovedServiceProviders);
router.put("/reject/:providerId", rejectServiceProvider);
router.get("/rejected", getRejectedServiceProviders);
router.post("/login", loginServiceProvider);
router.get('/profile', authMiddleware, getServiceProviderProfile);
router.put('/profile/update', authMiddleware, updateServiceProviderProfile);

module.exports = router;
