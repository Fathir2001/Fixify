const RequestedServiceProvider = require('../models/RequestedServiceProvider.js');
const bcrypt = require('bcryptjs');

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
      experience
    } = req.body;

    // Check if email already exists
    const existingProvider = await RequestedServiceProvider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: 'Email already registered' });
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
      experience
    });

    // Save to database
    await newServiceProvider.save();

    res.status(201).json({ message: 'Registration request submitted successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  registerServiceProvider
};