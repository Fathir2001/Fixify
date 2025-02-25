const express = require("express");
const router = express.Router();
const {
  createServiceRequest,
  getServiceNeederRequests,
  getServiceProviderRequests,
  updateRequestStatus,
} = require("../controllers/serviceRequestController");
const authMiddleware = require("../middleware/auth");
const Notification = require("../models/Notification");

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
    })
      .populate("serviceRequestId")
      .sort({ createdAt: -1 });

    // Map notifications with necessary fields
    const uiNotifications = notifications.map((notification) => ({
      _id: notification._id,
      message: notification.message,
      createdAt: notification.createdAt,
      read: notification.read,
      serviceRequestId: notification.serviceRequestId?._id,
      serviceProviderId: notification.serviceProviderId,
      serviceNeeder: notification.serviceNeeder,
      serviceDetails: notification.serviceDetails,
      status: notification.status,
    }));

    res.json(uiNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});
// get detailed notification information
router.get(
  "/notifications/:notificationId/details",
  authMiddleware,
  async (req, res) => {
    try {
      const notification = await Notification.findById(
        req.params.notificationId
      )
        .populate("serviceRequestId")
        .populate("serviceNeeder.id");

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      if (notification.serviceProviderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      res.json(notification);
    } catch (error) {
      console.error("Error fetching notification details:", error);
      res.status(500).json({ message: "Error fetching notification details" });
    }
  }
);

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

router.delete(
  "/notifications/:notificationId",
  authMiddleware,
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Check if the notification belongs to the logged-in provider
      if (notification.serviceProviderId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await Notification.findByIdAndDelete(notificationId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting notification" });
    }
  }
);

module.exports = router;
