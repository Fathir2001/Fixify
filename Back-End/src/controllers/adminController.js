const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
  // Admin Login
  login: async (req, res) => {
    try {
      // Check JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const { email, password } = req.body;

      // Validate request body
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        console.log(`Login attempt failed: Email ${email} not found`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        console.log(`Login attempt failed: Invalid password for ${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ 
        token,
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = adminController;