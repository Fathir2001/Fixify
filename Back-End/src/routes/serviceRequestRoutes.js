const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  createServiceRequest,
  getServiceNeederRequests,
  getServiceProviderRequests,
  updateRequestStatus,
} = require("../controllers/serviceRequestController");
const ServiceRequest = require("../models/ServiceRequest");
const ServiceAccepted = require("../models/ServiceAccepted");
const Notification = require("../models/Notification");
const SNNotification = require("../models/SNNotification");
const authMiddleware = require("../middleware/auth");

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
      ).populate("serviceRequestId");

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      console.log("Found notification:", notification);

      const details = {
        serviceNeeder: notification.serviceNeeder,
        serviceDetails: {
          serviceRequestId: notification.serviceRequestId._id.toString(), // Convert ObjectId to string
          serviceType: notification.serviceDetails.serviceType,
          location: notification.serviceDetails.location,
          address: notification.serviceDetails.address,
          date: notification.serviceDetails.date,
          timeFrom: notification.serviceDetails.timeFrom,
          timeTo: notification.serviceDetails.timeTo,
          totalHours: notification.serviceDetails.totalHours,
          feePerHour: notification.serviceDetails.feePerHour,
          totalFee: notification.serviceDetails.totalFee,
        },
      };

      res.json(details);
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

router.post("/:requestId/accept", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log("Received requestId:", requestId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid service request ID format",
        receivedId: requestId,
      });
    }

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(requestId);
    console.log("Found service request:", serviceRequest); // Debug log

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
    // Create accepted service record
    const acceptedService = new ServiceAccepted({
      serviceNeeder: serviceRequest.serviceNeeder,
      serviceProvider: serviceRequest.serviceProvider,
      serviceDetails: serviceRequest.serviceDetails,
      status: "accepted",
      originalRequestId: serviceRequest._id,
    });

    // Create notification for service needer
    const snNotification = new SNNotification({
      serviceNeederId: serviceRequest.serviceNeeder.id,
      serviceRequestId: serviceRequest._id,
      serviceProvider: serviceRequest.serviceProvider,
      message: `Your service request has been accepted by ${serviceRequest.serviceProvider.name}`,
      status: "accepted",
    });

    // Save all changes using Promise.all
    await Promise.all([
      acceptedService.save(),
      snNotification.save(),
      ServiceRequest.findByIdAndUpdate(requestId, { status: "accepted" }),
      Notification.findOneAndUpdate(
        { serviceRequestId: requestId },
        { status: "accepted" }
      ),
    ]);

    // Emit socket event if io is available
    const io = req.app.get("io");
    if (io) {
      io.emit("serviceRequestAccepted", {
        serviceNeederId: serviceRequest.serviceNeeder.id,
        notification: snNotification,
      });
    }

    res.status(200).json({
      message: "Service request accepted successfully",
      acceptedService,
    });
  } catch (error) {
    console.error("Error accepting service request:", error);
    res.status(500).json({
      message: "Error accepting service request",
      error: error.message,
    });
  }
});

router.get("/sn-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await SNNotification.find({
      serviceNeederId: req.user.id,
    })
      .populate("serviceRequestId")
      .sort({ createdAt: -1 });

    const uiNotifications = notifications.map((notification) => ({
      _id: notification._id,
      message: notification.message,
      createdAt: notification.createdAt,
      read: notification.read,
      serviceRequestId: notification.serviceRequestId?._id,
      serviceProvider: notification.serviceProvider,
      status: notification.status,
    }));

    res.json(uiNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.patch("/sn-notifications/mark-read", authMiddleware, async (req, res) => {
  try {
    await SNNotification.updateMany(
      { serviceNeederId: req.user.id },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

module.exports = router;
