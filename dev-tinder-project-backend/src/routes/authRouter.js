

// importing required modules
const express = require('express');
const { User } = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// creating router instance 
const authRouter = express.Router();


// Signup route - create a new user - POST /auth/signup
authRouter.post("/signup", async (req, res, next) => {

    // validating the signup data
    if (!validateSignupData(req, res)) {
        return;
    }
    // encryt the password before saving to the database
    const { password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
    req.body.password = passwordhash;

    // creating a new instance of User model
    const user = new User({
        firstName: req.body.firstName || "", 
        lastName: req.body.lastName || "",
        emailID: req.body.emailID || "",
        password: req.body.password || "",
        age: req.body.age || 0,
        gender: req.body.gender || "",
        photoUrl: req.body.photoUrl || "",
        about: req.body.about || "",
        skills: req.body.skills || [],
    });
    // saving the user to the database
    try {
        // create a JWT token for the user
        const token = jwt.sign({ userId: user._id, emailID: user.emailID }, "your_jwt_secret_key", { expiresIn: "1h" });
        console.log("Generated JWT Token:");
  
        res // setting the token in cookie with CORS-friendly settings
        .cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to false for localhost, true for HTTPS in production
            sameSite: "lax", // Allows cookies to be sent with cross-site requests
            maxAge: 3600000 // 1 hour in milliseconds
        })
        await user.save();
        res.status(201);
        res.json({ message: "User signed up successfully", user });
        console.log(`User ${user.firstName} ${user.lastName} signed up successfully...`);
    } catch (error) {
        res.status(500);
        res.json({ message: "Error signing up user", error });
    }
});


// login route - authenticate a user - POST /auth/login
authRouter.post("/login", async (req, res, next) => {
    const { emailID, password } = req.body;
    try {
        const user = await User.findOne({ emailID: emailID });
        if (!user) {
            res.status(404);
            res.json({ message: "User not found" });
            console.log(`User with emailID ${emailID} not found...`);
            return;
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401);
            res.json({ message: "Invalid password" });
            console.log(`Invalid password for user with emailID ${emailID}...`);
            return;
        }
        // create a JWT token for the user
        const token = jwt.sign({ userId: user._id, emailID: user.emailID }, "your_jwt_secret_key", { expiresIn: "1h" });
        console.log("Generated JWT Token:");
  
        res // setting the token in cookie with CORS-friendly settings
        .cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to false for localhost, true for HTTPS in production
            sameSite: "lax", // Allows cookies to be sent with cross-site requests
            maxAge: 3600000 // 1 hour in milliseconds
        })
        .status(200)
        .json({ message: "User logged in successfully", user }); 
        console.log(`User with emailID ${emailID} logged in successfully...`);
    } 
    catch (error) {
        res.status(500);
        res.json({ message: "Error logging in user", error });
    }
});


// logout route - logout a user - POST /auth/logout
authRouter.post("/logout", (req, res, next) => {
    res
    .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    .status(200)
    .json({ message: "User logged out successfully" });
    console.log("User logged out successfully...");
});


// exporting the router
module.exports = {
    authRouter,
}

