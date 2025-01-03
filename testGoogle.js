const express = require("express");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");




passport.use(
    new GoogleStrategy(
        {
            clientID: "951238035332-i93o1voug7d4usj5kb59js14h83pk1qd.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            console.log("Access Token:", accessToken);
            console.log("Profile:", profile);
            done(null, profile);
        }
    )
);

const app = express();

app.use(passport.initialize());

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        res.send("Google Login Successful");
    }
);

app.listen(3333, () => console.log("Server running on http://localhost:3333"));
