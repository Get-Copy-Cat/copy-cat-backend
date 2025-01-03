const express = require("express");
const { register, login, updateSettings } = require("../controllers/userController");
const authenticate = require("../middleware/auth");

const router = express.Router();

// User Routes
router.post("/register", register);
router.post("/login", login);
router.put("/settings", authenticate, updateSettings);

module.exports = router;
