const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const oauth2Client = require("../utils/googleAuth");
require("dotenv").config();




const router = express.Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));



router.get("/google/callback", async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send("Authorization code is missing.");
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Redirect to frontend with the token
        res.redirect(`http://localhost:5173/home?token=${tokens.id_token}`);
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        res.status(500).send("Authentication failed.");
    }
});



// Apple OAuth
router.get("/apple", passport.authenticate("apple"));

router.post(
    "/apple/callback",
    passport.authenticate("apple", { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id, username: req.user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
);

module.exports = router;
