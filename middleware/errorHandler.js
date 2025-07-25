const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = {
    status: "error",
    message: err.message || "Internal server error",
    statusCode: err.statusCode || 500,
  };

  // Supabase errors
  if (err.code) {
    switch (err.code) {
      case "PGRST116":
        error = {
          status: "error",
          message: "Resource not found",
          statusCode: 404,
        };
        break;
      case "23505":
        error = {
          status: "error",
          message: "Resource already exists",
          statusCode: 409,
        };
        break;
      default:
        error = {
          status: "error",
          message: "Database error",
          statusCode: 500,
        };
    }
  }

  // Validation errors
  if (err.name === "ValidationError") {
    error = {
      status: "error",
      message: "Validation failed",
      details: err.details,
      statusCode: 400,
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = {
      status: "error",
      message: "Invalid token",
      statusCode: 401,
    };
  }

  // Send error response
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
