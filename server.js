const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const wordCountRoutes = require("./routes/wordCountRoutes");

const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const passportGoogle = require("./auth/googleStrategy");
const passportApple = require("./auth/appleStrategy");
const passport = require("passport");

const cors = require('cors');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());

// Log each incoming request
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api", wordCountRoutes )

// Centralized Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});

