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
} = require("../controllers/requestedServiceProvider.js");

router.post("/register", registerServiceProvider);
router.get("/all", getAllServiceProviders);
router.put("/approve/:providerId", approveServiceProvider);
router.get("/approved", getApprovedServiceProviders);
router.put("/reject/:providerId", rejectServiceProvider);
router.get("/rejected", getRejectedServiceProviders);
router.post("/login", loginServiceProvider);

module.exports = router;
