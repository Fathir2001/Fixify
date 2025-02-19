const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const requestedServiceProviderRoutes = require('./routes/requestedServiceProvider.js');
const adminRoutes = require('./routes/adminRoutes');
const serviceNeederRoutes = require('./routes/serviceNeederRoutes');
const authMiddleware = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Fixify API' });
});

app.use('/api/service-providers', requestedServiceProviderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/service-needers', serviceNeederRoutes);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

