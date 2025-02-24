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
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);