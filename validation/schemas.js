const Joi = require("joi");

// Registration status validation schema
const registrationStatusSchema = Joi.object({
  registrationId: Joi.string()
    .pattern(/^ITMS2025-\d+$/)
    .required()
    .messages({
      "string.pattern.base": "Registration ID must be in format ITMS2025-XXXX",
      "any.required": "Registration ID is required",
    }),
});

// Registration creation validation schema
const registrationSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  institution_name: Joi.string().max(100).optional(),
  current_study_year: Joi.string().max(50).optional(),
  department: Joi.string().max(100).optional(),
  batch: Joi.string().max(50).optional(),
  student_id: Joi.string().max(50).optional(),
  contact_number: Joi.string()
    .pattern(/^[0-9+\-\s]+$/)
    .min(10)
    .max(20)
    .required(),
  whatsapp_number: Joi.string()
    .pattern(/^[0-9+\-\s]+$/)
    .min(10)
    .max(20)
    .required(),
  email: Joi.string().email().max(100).required(),
  tshirt_size: Joi.string().valid("S", "M", "L", "XL", "XXL").optional(),
  competitions: Joi.array().items(Joi.string()).min(1).required(),
  team_name: Joi.string().max(100).optional(),
  payment_method: Joi.string()
    .valid("bkash", "nagad", "bank", "cash")
    .optional(),
  representative: Joi.string().max(100).optional(),
  bkash_number: Joi.string().max(20).optional(),
  transaction_id: Joi.string().max(100).optional(),
  registration_fee: Joi.number().min(0).required(),
});

// Validation functions
const validateRegistrationStatus = (data) => {
  return registrationStatusSchema.validate(data, { abortEarly: false });
};

const validateRegistration = (data) => {
  return registrationSchema.validate(data, { abortEarly: false });
};



module.exports = {
  validateRegistrationStatus,
  validateRegistration,
  registrationStatusSchema,
  registrationSchema,
};
