const ActiveService = require("../models/ActiveService");
const ConnectedService = require("../models/ConnectedService");

// Function to activate a service when it's within service hours
const activateService = async (req, res) => {
  try {
    const { connectedServiceId } = req.params;

    // Find the connected service
    const connectedService = await ConnectedService.findById(
      connectedServiceId
    );

    if (!connectedService) {
      return res.status(404).json({ message: "Connected service not found" });
    }

    // Check if user is authorized (either service provider or service needer)
    const isAuthorized =
      connectedService.serviceProvider.id.toString() === req.user.id ||
      connectedService.serviceNeeder.id.toString() === req.user.id;

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Not authorized to activate this service" });
    }

    // Check if the service is already active
    const existingActive = await ActiveService.findOne({ connectedServiceId });
    if (existingActive) {
      return res.status(400).json({ message: "Service is already active" });
    }

    // Parse service time to check if it's within service hours
    const currentTime = new Date();
    const serviceDate = new Date(connectedService.serviceDetails.date);

    // Parse timeFrom (e.g., "9:00 AM")
    const timeFromParts = connectedService.serviceDetails.timeFrom.split(" ");
    const timeFromStr = timeFromParts[0];
    const timeFromPeriod = timeFromParts[1] || "";
    let [fromHours, fromMinutes] = timeFromStr.split(":").map(Number);

    // Convert to 24-hour format if PM
    if (timeFromPeriod.toUpperCase() === "PM" && fromHours < 12)
      fromHours += 12;
    if (timeFromPeriod.toUpperCase() === "AM" && fromHours === 12)
      fromHours = 0;

    // Parse timeTo
    const timeToParts = connectedService.serviceDetails.timeTo.split(" ");
    const timeToStr = timeToParts[0];
    const timeToPeriod = timeToParts[1] || "";
    let [toHours, toMinutes] = timeToStr.split(":").map(Number);

    // Convert to 24-hour format if PM
    if (timeToPeriod.toUpperCase() === "PM" && toHours < 12) toHours += 12;
    if (timeToPeriod.toUpperCase() === "AM" && toHours === 12) toHours = 0;

    // Set service start and end times
    const serviceStartTime = new Date(serviceDate);
    serviceStartTime.setHours(fromHours, fromMinutes, 0, 0);

    const serviceEndTime = new Date(serviceDate);
    serviceEndTime.setHours(toHours, toMinutes, 0, 0);

    // Check if current time is within service hours
    const isWithinServiceHours =
      currentTime >= serviceStartTime && currentTime <= serviceEndTime;

    if (!isWithinServiceHours) {
      return res.status(400).json({
        message: "Service can only be activated during scheduled hours",
        currentTime: currentTime.toISOString(),
        serviceStartTime: serviceStartTime.toISOString(),
        serviceEndTime: serviceEndTime.toISOString(),
      });
    }

    // Create new active service
    const activeService = new ActiveService({
      serviceNeeder: connectedService.serviceNeeder,
      serviceProvider: connectedService.serviceProvider,
      serviceDetails: connectedService.serviceDetails,
      connectedServiceId: connectedService._id,
      originalServiceId: connectedService.originalServiceId,
      startedAt: new Date(),
    });

    await activeService.save();

    // Now DELETE the service from ConnectedService collection after it's been moved to ActiveService
    await ConnectedService.findByIdAndDelete(connectedServiceId);

    // Notify via socket
    const io = req.app.get("io");
    if (io) {
      io.emit("serviceActivated", {
        serviceId: activeService._id,
        serviceNeederId: connectedService.serviceNeeder.id,
        serviceProviderId: connectedService.serviceProvider.id,
        serviceType: connectedService.serviceDetails.serviceType,
      });
    }

    res.status(201).json({
      message: "Service activated successfully",
      activeService,
    });
  } catch (error) {
    console.error("Error activating service:", error);
    res
      .status(500)
      .json({ message: "Error activating service", error: error.message });
  }
};

// Function to check if a service can be automatically activated
const checkServiceActivation = async () => {
  try {
    const currentTime = new Date();

    // Find all connected services
    const connectedServices = await ConnectedService.find({
      status: "connected",
    });

    for (const connectedService of connectedServices) {
      // Check if service is already active
      const existingActive = await ActiveService.findOne({
        connectedServiceId: connectedService._id,
      });

      if (existingActive) continue;

      // Parse service date and times
      const serviceDate = new Date(connectedService.serviceDetails.date);

      // Parse timeFrom (e.g., "9:00 AM")
      const timeFromParts = connectedService.serviceDetails.timeFrom.split(" ");
      const timeFromStr = timeFromParts[0];
      const timeFromPeriod = timeFromParts[1] || "";
      let [fromHours, fromMinutes] = timeFromStr.split(":").map(Number);

      // Convert to 24-hour format if PM
      if (timeFromPeriod.toUpperCase() === "PM" && fromHours < 12)
        fromHours += 12;
      if (timeFromPeriod.toUpperCase() === "AM" && fromHours === 12)
        fromHours = 0;

      // Set service start time
      const serviceStartTime = new Date(serviceDate);
      serviceStartTime.setHours(fromHours, fromMinutes, 0, 0);

      // If current time is at or after start time, activate the service
      if (currentTime >= serviceStartTime) {
        // Create new active service
        const activeService = new ActiveService({
          serviceNeeder: connectedService.serviceNeeder,
          serviceProvider: connectedService.serviceProvider,
          serviceDetails: connectedService.serviceDetails,
          connectedServiceId: connectedService._id,
          originalServiceId: connectedService.originalServiceId,
          startedAt: new Date(),
        });

        await activeService.save();

        // DELETE from ConnectedService after moving to ActiveService
        await ConnectedService.findByIdAndDelete(connectedService._id);

        console.log(
          `Service ${connectedService._id} automatically activated and removed from ConnectedServices`
        );
      }
    }
  } catch (error) {
    console.error("Error in automatic service activation check:", error);
  }
};

module.exports = {
  activateService,
  checkServiceActivation,
};
