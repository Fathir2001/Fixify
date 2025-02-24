const express = require("express");
const router = express.Router();
const {
  createServiceRequest,
  getServiceNeederRequests,
  getServiceProviderRequests,
  updateRequestStatus,
} = require("../controllers/serviceRequestController");
const authMiddleware = require("../middleware/auth");
const Notification = require('../models/Notification');

// Create service request
router.post("/create", authMiddleware, createServiceRequest);

// Get service needer's requests
router.get("/my-requests", authMiddleware, getServiceNeederRequests);

// Get service provider's requests
router.get("/provider-requests", authMiddleware, getServiceProviderRequests);

// Update request status (accept/reject/complete)
router.patch("/:requestId/status", authMiddleware, updateRequestStatus);

router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      serviceProviderId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.patch("/notifications/mark-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { serviceProviderId: req.user.id },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

module.exports = router;
