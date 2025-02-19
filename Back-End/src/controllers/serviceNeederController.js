const ServiceNeeder = require('../models/ServiceNeeder');
const jwt = require('jsonwebtoken');

const registerServiceNeeder = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await ServiceNeeder.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new service needer
    const serviceNeeder = new ServiceNeeder({
      name,
      email,
      password,
      phoneNumber
    });

    await serviceNeeder.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: serviceNeeder._id, email: serviceNeeder.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: serviceNeeder._id,
        name: serviceNeeder.name,
        email: serviceNeeder.email,
        phoneNumber: serviceNeeder.phoneNumber
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = { registerServiceNeeder };