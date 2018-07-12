require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
    // Check if the email is already in the DB
    User.findOne({email: req.body.email}, (err, user) => {
        if (user) {
            console.log("found a user in the DB in signup")
            // Alert the user "email is taken"
            res.status(401).json({
                error: true,
                message: "Email already exists"
            });
        } else {
            console.log("no user found in DB in signup")
        // If the email is not taken...
            // Create the user in the DB
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }, (err, user) => {
            // Check for any DB errors
                if (err) {
                    console.log("ERROR CREATING USER")
                    console.log(err);
                    res.status(401).json(err)
                } else {
                    // Log the user in (Sign a new token)
                    console.log("ABOUT TO SIGN TOKEN")
                    var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
                        expiresIn: 60 * 60 * 24
                    });
                    // Return user and token to React app
                    res.json({
                        user,
                        token
                    });
                }
            })
        }
    })
});

router.post("/login", (req, res) => {
    // Check for user in the DB
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (user) {
            // If there is a user....
            // Check their entered password against the hash
            console.log("Password: ", req.body.password)
            var passwordMatch = bcrypt.compareSync(req.body.password, user.password);
            if (user.authenticated(req.body.password)) {
                // If it matches: log them in (sign a token)
                var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
                    expiresIn: 60 * 60 * 24
                });
                res.json({
                    user,
                    token
                });
            } else {
                // If it doesn't match: Send an error
                res.status(401).json({
                    error: true,
                    message: "Email or password is incorrect"
                });
            }
        } else {
            // If the user isn't in the DB...
            res.status(401).json(err)
        }
    })
});

router.post("/me/from/token", (req, res) => {
    let token = req.body.token;
    // Check for presence of a token
    if (!token) {
        // They did not send a token
        res.status(401).json({
            error: true,
            message: "You must pass a token"
        })
    } else {
        // There is a token
        // Validate the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // If the token is invalid...
                // send an error, redirect to a login screen
                res.status(401).json(err);
            } else {
                // If token is valid...
                // Look up the user in the DB
                User.findById(user._id, (err, user) => {
                    if (err) {
                        res.status(401).json(err);
                    } else {
                        // Send the user and the token back ot the React app
                        res.json({
                            user,
                            token
                        });
                    }
                })
            }
        })
    }
})

module.exports = router;