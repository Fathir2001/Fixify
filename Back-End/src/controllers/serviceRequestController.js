const ServiceRequest = require('../models/ServiceRequest');
const ServiceNeeder = require('../models/ServiceNeeder');
const ApprovedServiceProvider = require('../models/ApprovedServiceProvider');

const createServiceRequest = async (req, res) => {
  try {
    const {
      serviceType,
      location,
      address,
      date,
      timeFrom,
      timeTo,
      providerId
    } = req.body;

    // Calculate total hours
    const startTime = new Date(`2000/01/01 ${timeFrom}`);
    const endTime = new Date(`2000/01/01 ${timeTo}`);
    const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Get service needer details
    const serviceNeeder = await ServiceNeeder.findById(req.user.id);
    
    // Get service provider details
    const serviceProvider = await ApprovedServiceProvider.findById(providerId);

    const serviceRequest = new ServiceRequest({
      serviceNeeder: {
        id: serviceNeeder._id,
        name: serviceNeeder.name,
        phoneNumber: serviceNeeder.phoneNumber
      },
      serviceProvider: {
        id: serviceProvider._id,
        name: serviceProvider.fullName,
        phoneNumber: serviceProvider.phoneNumber
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
        totalFee: totalHours * serviceProvider.serviceFee
      }
    });

    await serviceRequest.save();

    res.status(201).json({
      success: true,
      message: 'Your service request has been sent successfully. Please wait for the provider to accept your request.',
      requestId: serviceRequest._id
    });
  } catch (error) {
    console.error('Service request error:', error);
    res.status(500).json({ message: 'Error creating service request' });
  }
};

const getServiceNeederRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ 'serviceNeeder.id': req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service requests' });
  }
};

const getServiceProviderRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ 'serviceProvider.id': req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service requests' });
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
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: `Service request ${status} successfully`,
      request 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service request status' });
  }
};

module.exports = {
  createServiceRequest,
  getServiceNeederRequests,
  getServiceProviderRequests,
  updateRequestStatus
};