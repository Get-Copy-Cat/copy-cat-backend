const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            const error = new Error("Username and password are required");
            error.statusCode = 400;
            throw error;
        }

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        if (err.code === 11000) {
            err.statusCode = 400;
            err.message = "Username already exists";
        }
        next(err); // Pass the error to the centralized error handler
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            const error = new Error("Invalid username or password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        next(err); // Pass the error to the centralized error handler
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { theme, notifications } = req.body;

        const updatedSettings = {};
        if (theme) updatedSettings["settings.theme"] = theme;
        if (typeof notifications === "boolean") updatedSettings["settings.notifications"] = notifications;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updatedSettings },
            { new: true, runValidators: true }
        );

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: "Settings updated successfully", settings: user.settings });
    } catch (err) {
        next(err); // Pass the error to the centralized error handler
    }
};
