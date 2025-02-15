const RequestedServiceProvider = require("../models/RequestedServiceProvider.js");
const ApprovedServiceProvider = require("../models/ApprovedServiceProvider.js");
const bcrypt = require("bcryptjs");

const registerServiceProvider = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      serviceType,
      phoneNumber,
      serviceArea,
      availableDays,
      timeFrom,
      timeTo,
      experience,
    } = req.body;

    // Check if email already exists
    const existingProvider = await RequestedServiceProvider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate service types
    if (
      !serviceType ||
      !Array.isArray(serviceType) ||
      serviceType.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Please select at least one service type" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new service provider
    const newServiceProvider = new RequestedServiceProvider({
      fullName,
      email,
      password: hashedPassword,
      serviceType,
      phoneNumber,
      serviceArea,
      availableDays,
      timeFrom,
      timeTo,
      experience,
    });

    // Save to database
    await newServiceProvider.save();

    res
      .status(201)
      .json({ message: "Registration request submitted successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await RequestedServiceProvider.find({})
      .select("-password") // Exclude password from the response
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(serviceProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching service providers" });
  }
};

const approveServiceProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Find the requested service provider
    const provider = await RequestedServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    // Create new approved service provider
    const approvedProvider = new ApprovedServiceProvider({
      fullName: provider.fullName,
      email: provider.email,
      password: provider.password,
      serviceType: provider.serviceType,
      phoneNumber: provider.phoneNumber,
      serviceArea: provider.serviceArea,
      availableDays: provider.availableDays,
      timeFrom: provider.timeFrom,
      timeTo: provider.timeTo,
      experience: provider.experience,
    });

    // Save to approved collection
    await approvedProvider.save();

    // Remove from requested collection
    await RequestedServiceProvider.findByIdAndDelete(providerId);

    res.status(200).json({ message: "Service provider approved successfully" });
  } catch (error) {
    console.error("Error approving service provider:", error);
    res.status(500).json({ message: "Server error while approving provider" });
  }
};

module.exports = {
  registerServiceProvider,
  getAllServiceProviders,
  approveServiceProvider
};
