
// importing express module for creating routes
const express = require('express');
// importing userAuth middleware to check if user is logged in
const { userAuth } = require('../middlewares/auth');
// importing User model to update user data in database
const { User } = require('../models/user');
// importing validation function to check if profile update data is valid
const { validateUpdateProfileData } = require('../utils/validation');
// importing bcrypt for hashing passwords
const bcrypt = require('bcrypt');
// importing password validation function
const { validatePassword } = require('../utils/validation');

// creating router instance - handles all /profile routes
const profileRouter = express.Router();

// get profile route - returns the logged in user's profile data
// GET /profile/view - frontend calls this to get user's own profile
// userAuth middleware runs first to make sure user is logged in
profileRouter.get("/view", userAuth, async (req, res, next) => {
    try {
        // userAuth middleware already found the user and attached it to req.user
        // so we can just use it directly
        const user = req.user;
        
        // sending user data back to frontend
        res.status(200);
        res.json({ message: "User profile fetched successfully", user });
        console.log(`Profile of user ${user.firstName} ${user.lastName} fetched successfully...`);
    } catch (error) {
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error fetching user profile" });
    }
});


// update profile route - allows user to update their profile information
// PUT /profile/edit - frontend sends updated data here
// userAuth middleware ensures only logged in users can update their profile
profileRouter.put("/edit", userAuth, async (req, res, next) => {
    // getting the data to update from request body
    const updateData = req.body;
    // getting user ID from req.user (set by userAuth middleware)
    const userId = req.user._id;

    // validating the update data - check if fields are allowed and valid
    if (!validateUpdateProfileData(updateData, res)) {
        return; // if validation fails, stop here
    }
    
    // updating the user in database
    try {
        // User.updateOne() updates the user document
        // { _id: userId } finds the user by ID
        // updateData contains the fields to update
        // { runValidators: true } makes sure updated data follows schema rules
        await User.updateOne({ _id: userId }, updateData, { runValidators: true });
        
        res.status(200);
        res.json({ message: "User profile updated successfully", updateData });
        console.log(`Profile of user with ID ${userId} updated successfully...`);
    } catch (error) {
        // if update fails (like validation error), send error
        res.status(400);
        res.json({ message: "Error updating user profile"+ error.message });
    }
});


// delete account route - allows user to delete their own account
// DELETE /profile/delete - frontend calls this when user wants to delete account
// userAuth middleware ensures only logged in users can delete their account
profileRouter.delete("/delete", userAuth, async (req, res, next) => {
    // getting user ID from req.user (set by userAuth middleware)
    const userId = req.user._id;
    
    try {
        // deleting the user from database
        await User.deleteOne({ _id: userId });
        
        // clearing the authentication cookie since account is deleted
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        
        res.status(200);
        res.json({ message: "User deleted successfully" });
        console.log(`User with ID ${userId} deleted successfully...`);
    } catch (error) {
        // if deletion fails, send error
        res.status(400);
        res.json({ message: "Error deleting user", error });
    }
});


// update password route - allows user to change their password
// PUT /profile/updatePassword - frontend sends old and new password here
// userAuth middleware ensures only logged in users can change password
profileRouter.put("/updatePassword", userAuth, async (req, res, next) => {
    // getting old and new password from request body
    const { oldPassword, newPassword } = req.body;
    // getting user from req.user (set by userAuth middleware)
    const user = req.user;
    
    try {
        // comparing old password with the one stored in database
        // bcrypt.compare() hashes the entered password and checks if it matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        
        // if old password doesn't match, user can't change password
        if (!isMatch) {
            res.status(401);
            res.json({ message: "Old password is incorrect" });
            return;
        }
        
        // validating the new password - check if it's strong enough
        if (!validatePassword(newPassword, res)) {
            return; // if validation fails, stop here
        }
        
        // hashing the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        // updating the password in database
        // runValidators: true ensures password follows schema rules
        await user.updateOne({ _id: user._id }, { password: user.password }, { runValidators: true });
        
        res.status(200);
        res.json({ message: "Password updated successfully" });
        console.log(`Password for user ${user.firstName} ${user.lastName} updated successfully...`);
    } catch (error) {
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error updating password", error });
    }
});

// exporting the router so we can use it in app.js
module.exports = { 
    profileRouter 
};

