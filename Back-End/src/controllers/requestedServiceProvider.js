const RequestedServiceProvider = require("../models/RequestedServiceProvider.js");
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
      .select('-password')  // Exclude password from the response
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(serviceProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ message: "Server error while fetching service providers" });
  }
};

module.exports = {
  registerServiceProvider,
  getAllServiceProviders,
};
