const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    googleId: { type: String },
    appleId: { type: String },
    settings: {
        theme: { type: String, default: "light" },
        notifications: { type: Boolean, default: true },
    },
});

module.exports = mongoose.model("User", userSchema);
