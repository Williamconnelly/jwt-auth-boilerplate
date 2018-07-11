require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const jtw = require("jsonwebtoken");

router.post("/signup", (req, res) => {
    // Check if the email is already in the DB
        // Alert the user "email is taken"
        // Redirect to signup
    // If the email is not taken...
        // Create the user in the DB
        // Check for any DB errors
        // Log the user in (Sign a new token)
        // Return user and token to React app
});

router.post("/login", (req, res) => {
    // Check for user in the DB
    // If there is a user..
        // Check their entered password against the hash
        // If it matches: log them in (sign a token)
        // If it doesn't match: Send an error, redirect to login
    // If the user isn't in the DB...
        // Redirect to login
});

router.post("/me/from/token", (req, res) => {
    let token = req.body.token;
    // Check for presence of a token
    if (!token) {
        // They did not send a token
        res
    } else {
        // There is a token
        // Validate the token
            // If token is valid...
            // Look up the user in the DB
            // Send the user and the token back ot the React app
            // If the token is invalid...
            // send an error, redirect to a login screen
    }
})