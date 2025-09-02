// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  // Default
  let statusCode = 500;
  let message = err.message || "Something went wrong";

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // Mongoose CastError (bad ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const fields = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field(s): ${fields}`;
  }

  res.status(statusCode).json({ success: false, message });
};