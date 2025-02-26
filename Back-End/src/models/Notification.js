const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovedServiceProvider',
    required: true
  },
  serviceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true
  },
  serviceNeeder: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceNeeder' },
    name: { type: String },
    phoneNumber: { type: String }
  },
  serviceProvider: {  // Add this new field
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'ApprovedServiceProvider' },
    name: { type: String },
    phoneNumber: { type: String }
  },
  serviceDetails: {
    serviceType: { type: String },
    location: { type: String },
    address: { type: String },
    date: { type: String },
    timeFrom: { type: String },
    timeTo: { type: String },
    totalHours: { type: Number },
    feePerHour: { type: Number },
    totalFee: { type: Number }
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Notification', notificationSchema);