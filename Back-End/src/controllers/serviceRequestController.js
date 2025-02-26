const ServiceRequest = require("../models/ServiceRequest");
const ServiceNeeder = require("../models/ServiceNeeder");
const ApprovedServiceProvider = require("../models/ApprovedServiceProvider");
const Notification = require("../models/Notification");

const createServiceRequest = async (req, res) => {
  try {
    const {
      serviceType,
      location,
      address,
      date,
      timeFrom,
      timeTo,
      providerId,
      totalHours,
    } = req.body;

    // Get service needer details
    const serviceNeeder = await ServiceNeeder.findById(req.user.id);
    const serviceProvider = await ApprovedServiceProvider.findById(providerId);

    if (!serviceNeeder || !serviceProvider) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total fee
    const totalFee = totalHours * serviceProvider.serviceFee;

    // Create service request with all required fields
    const serviceRequest = new ServiceRequest({
      serviceNeeder: {
        id: serviceNeeder._id,
        name: serviceNeeder.name,
        phoneNumber: serviceNeeder.phoneNumber,
      },
      serviceProvider: {
        id: providerId,
        name: serviceProvider.fullName,
        phoneNumber: serviceProvider.phoneNumber,
      },
      serviceDetails: {
        //  serviceDetails object
        serviceType,
        location,
        address,
        date,
        timeFrom,
        timeTo,
        totalHours,
        feePerHour: serviceProvider.serviceFee,
        totalFee,
      },
      serviceType,
      location,
      address,
      date,
      timeFrom,
      timeTo,
      totalHours,
      totalFee,
      status: "pending",
    });

    await serviceRequest.save();

    // Create notification with provider details
    const notification = new Notification({
      serviceProviderId: providerId,
      serviceRequestId: serviceRequest._id,
      serviceNeeder: {
        id: serviceNeeder._id,
        name: serviceNeeder.name,
        phoneNumber: serviceNeeder.phoneNumber,
      },
      serviceProvider: {
        id: serviceProvider._id,
        name: serviceProvider.fullName,
        phoneNumber: serviceProvider.phoneNumber,
      },
      serviceDetails: {
        serviceType,
        location,
        address,
        date,
        timeFrom,
        timeTo,
        totalHours,
        feePerHour: serviceProvider.serviceFee,
        totalFee,
      },
      message: `New service request for ${serviceType} at ${location} on ${date}`,
      status: "pending",
    });

    await notification.save();

    // Emit socket event
    const io = req.app.get("io");
    io.emit("newNotification", {
      _id: notification._id,
      message: notification.message,
      createdAt: notification.createdAt,
      read: notification.read,
      serviceRequestId: serviceRequest._id,
      serviceProviderId: providerId,
      serviceNeeder: notification.serviceNeeder,
      serviceDetails: notification.serviceDetails,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      requestId: serviceRequest._id,
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ message: "Error creating service request" });
  }
};

const getServiceNeederRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      "serviceNeeder.id": req.user.id,
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service requests" });
  }
};

const getServiceProviderRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      "serviceProvider.id": req.user.id,
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service requests" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.status(200).json({
      success: true,
      message: `Service request ${status} successfully`,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating service request status" });
  }
};

const getProfile = async (req, res) => {
  try {
    const provider = await ApprovedServiceProvider.findById(req.user.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json({
      _id: provider._id,
      fullName: provider.fullName,
      email: provider.email,
      serviceType: provider.serviceType,
      phoneNumber: provider.phoneNumber,
      serviceArea: provider.serviceArea,
      availableDays: provider.availableDays,
      timeFrom: provider.timeFrom,
      timeTo: provider.timeTo,
      experience: provider.experience,
      approvedAt: provider.approvedAt,
      serviceFee: provider.serviceFee,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createServiceRequest,
  getServiceNeederRequests,
  getServiceProviderRequests,
  updateRequestStatus,
  getProfile,
};
