

const passport = require("passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();




console.log("Google Strategy Configuration:");
console.log("Client ID:", process.env.GOOGLE_CLIENT_ID || "Missing");
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET || "Missing");
console.log("Callback URL:", "/auth/google/callback");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Ensure these values exist
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOneAndUpdate(
                    { googleId: profile.id },
                    {
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                    },
                    { new: true, upsert: true } // Create a new user if none exists
                );
                
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

module.exports = passport;