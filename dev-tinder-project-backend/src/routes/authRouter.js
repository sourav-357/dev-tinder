
// importing express module for creating routes
const express = require('express');
// importing User model to save and find users in database
const { User } = require('../models/user');
// importing validation function to check if signup data is valid
const { validateSignupData } = require('../utils/validation');
// importing bcrypt module for hashing passwords - never store plain passwords!
const bcrypt = require('bcrypt');
// importing jsonwebtoken module for creating authentication tokens
const jwt = require('jsonwebtoken');

// creating router instance - this handles all /auth routes
const authRouter = express.Router();


// signup route - creates a new user account
// POST /auth/signup - frontend sends user data here
authRouter.post("/signup", async (req, res, next) => {
    // first validate the data - check if email is valid, password is strong, etc.
    if (!validateSignupData(req, res)) {
        return; // if validation fails, stop here
    }
    
    // encrypting the password before saving - bcrypt.hash() converts password to unreadable hash. 10 is the number of rounds - higher is more secure but slower
    const { password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
    req.body.password = passwordhash; // replace plain password with hash

    // creating a new user object with data from request body
    const user = new User({
        firstName: req.body.firstName || "", 
        lastName: req.body.lastName || "",
        emailID: req.body.emailID || "",
        password: req.body.password || "", // this is now hashed
        age: req.body.age || 0,
        gender: req.body.gender || "",
        photoUrl: req.body.photoUrl || "",
        about: req.body.about || "",
        skills: req.body.skills || [],
    });
    
    // saving the user to database
    try {
        // creating JWT token for authentication, token contains userId and emailID so we know who is logged in
        // getting secret from environment variable for security
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: user._id, emailID: user.emailID }, jwtSecret, { expiresIn: "1h" });
        console.log("Generated JWT Token:");
  
        // setting the token in a cookie - this is how we remember user is logged in
        // httpOnly: true means JavaScript can't access this cookie (more secure)
        // secure: false for localhost, true for HTTPS in production
        // sameSite: "lax" allows cookie to be sent with cross-site requests
        // maxAge: 3600000 means cookie expires in 1 hour (in milliseconds)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production (HTTPS), false in development
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" needed for cross-origin in production
            maxAge: 3600000 // 1 hour
        });
        
        // saving user to database - this actually creates the user record
        await user.save();
        
        // sending success response back to frontend
        res.status(201);
        res.json({ message: "User signed up successfully", user });
        console.log(`User ${user.firstName} ${user.lastName} signed up successfully...`);
    } catch (error) {
        // if something goes wrong (like email already exists), send error
        res.status(500);
        res.json({ message: "Error signing up user", error });
    }
});


// login route - checks if email and password are correct
// POST /auth/login - frontend sends email and password here
authRouter.post("/login", async (req, res, next) => {
    // getting email and password from request body
    const { emailID, password } = req.body;
    
    try {
        // finding user in database by email
        const user = await User.findOne({ emailID: emailID });
        
        // if user not found, email doesn't exist
        if (!user) {
            res.status(404);
            res.json({ message: "User not found" });
            console.log(`User with emailID ${emailID} not found...`);
            return;
        }
        
        // comparing the password user entered with the hashed password in database. bcrypt.compare() hashes the entered password and checks if it matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        // if passwords don't match, login fails
        if (!isPasswordMatch) {
            res.status(401);
            res.json({ message: "Invalid password" });
            console.log(`Invalid password for user with emailID ${emailID}...`);
            return;
        }
        
        // if we reach here, email and password are correct - create token
        const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";
        const token = jwt.sign({ userId: user._id, emailID: user.emailID }, jwtSecret, { expiresIn: "1h" });
        console.log("Generated JWT Token:");
  
        // setting token in cookie so user stays logged in
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 3600000 // 1 hour
        })
        .status(200)
        .json({ message: "User logged in successfully", user }); 
        console.log(`User with emailID ${emailID} logged in successfully...`);
    } 
    catch (error) {
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error logging in user", error });
    }
});


// logout route - removes the authentication cookie
// POST /auth/logout - frontend calls this when user clicks logout
authRouter.post("/logout", (req, res, next) => {
    // clearing the token cookie - this logs the user out. must use same settings as when we set the cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    .status(200)
    .json({ message: "User logged out successfully" });
    console.log("User logged out successfully...");
});

// exporting the router so we can use it in app.js
module.exports = {
    authRouter,
}

