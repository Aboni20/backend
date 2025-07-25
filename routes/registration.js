const express = require("express");
const router = express.Router();
const registrationService = require("../services/registrationService");
const { validateRegistrationStatus } = require("../validation/schemas");

// Get registration status by ID
router.post("/status", async (req, res, next) => {
  try {
    const { registrationId } = req.body;
    // Validate registration ID format
    const { error } = validateRegistrationStatus({ registrationId });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Invalid registration ID format",
        details: error.details,
      });
    }

    const registration = await registrationService.getRegistrationByStatus(
      registrationId
    );

    if (!registration) {
      return res.status(404).json({
        status: "error",
        message: "Registration not found",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Registration found",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
});

// Create new registration
router.post("/create", async (req, res, next) => {
  try {
    const registrationData = req.body;

    // Basic validation
    if (
      !registrationData.full_name ||
      !registrationData.email ||
      !registrationData.contact_number
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: full_name, email, and contact_number are required",
      });
    }

    if (
      !registrationData.competitions ||
      !Array.isArray(registrationData.competitions) ||
      registrationData.competitions.length === 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "At least one competition must be selected",
      });
    }

    // Validate registration fee
    if (
      typeof registrationData.registration_fee !== "number" ||
      registrationData.registration_fee < 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid registration fee",
      });
    }

    const newRegistration = await registrationService.createRegistration(
      registrationData
    );

    res.status(201).json({
      status: "success",
      message: "Registration created successfully",
      data: newRegistration,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
