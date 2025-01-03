const logger = require("../utils/logger");

// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error
    logger.error(`${req.method} ${req.url} - ${message}`);

    res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorHandler;
