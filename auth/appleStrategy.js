const passport = require("passport");
const AppleStrategy = require("passport-apple");
const User = require("../models/User");

passport.use(
    new AppleStrategy(
        {
            clientID: process.env.APPLE_CLIENT_ID,
            teamID: process.env.APPLE_TEAM_ID,
            keyID: process.env.APPLE_KEY_ID,
            privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
            callbackURL: "/auth/apple/callback",
        },
        async (accessToken, refreshToken, idToken, profile, done) => {
            try {
                const user = await User.findOneAndUpdate(
                    { appleId: profile.id },
                    {
                        appleId: profile.id,
                        username: profile.name || "Apple User",
                        email: profile.email,
                    },
                    { new: true, upsert: true }
                );
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

module.exports = passport;
