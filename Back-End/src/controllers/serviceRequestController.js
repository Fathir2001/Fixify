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
    } = req.body;

    // Validate required fields
    if (
      !serviceType ||
      !location ||
      !address ||
      !date ||
      !timeFrom ||
      !timeTo ||
      !providerId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Calculate total hours
    const startTime = new Date(`2000/01/01 ${timeFrom}`);
    const endTime = new Date(`2000/01/01 ${timeTo}`);
    const totalHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Get service needer details
    const serviceNeeder = await ServiceNeeder.findById(req.user.id);
    if (!serviceNeeder) {
      return res.status(404).json({
        success: false,
        message: "Service needer not found",
      });
    }

    // Get service provider details
    const serviceProvider = await ApprovedServiceProvider.findById(providerId);
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }
    const serviceRequest = new ServiceRequest({
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
        totalFee: totalHours * serviceProvider.serviceFee,
      },
    });

    await serviceRequest.save();

    // Create notification
    const notification = new Notification({
      serviceProviderId: providerId,
      serviceRequestId: serviceRequest._id,
      message: `New service request received for ${serviceType} at ${location} on ${date}`,
      read: false,
    });
    await notification.save();

    // Emit socket event
    const io = req.app.get("io");
    io.emit("newNotification", {
      _id: notification._id,
      message: notification.message,
      createdAt: notification.createdAt,
      read: notification.read,
      serviceRequestId: notification.serviceRequestId,
      serviceProviderId: notification.serviceProviderId,
    });

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
    });
  } catch (error) {
    console.error("Error in createServiceRequest:", error);
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
        serviceFee: provider.serviceFee
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
