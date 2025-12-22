
// Importing required modules
const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');
const { validateUpdateProfileData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validation');


// Creating router instance 
const profileRouter = express.Router();


// get profile of logged in user - GET /profile/view
profileRouter.get("/view", userAuth, async (req, res, next) => {
    try {
        const user = req.user; // fetched from userAuth middleware
        res.status(200);
        res.json({ message: "User profile fetched successfully", user });
        console.log(`Profile of user ${user.firstName} ${user.lastName} fetched successfully...`);
    } catch (error) {
        res.status(500);
        res.json({ message: "Error fetching user profile" });
    }
});


// update profile of logged in user - PUT /profile/update
profileRouter.put("/edit", userAuth, async (req, res, next) => {
    const updateData = req.body;
    const userId = req.user._id;

    // validating the update profile data
    if (!validateUpdateProfileData(updateData, res)) {
        return;
    }
    // updating the user
    try {
        await User.updateOne({ _id: userId }, updateData, { runValidators: true });
        res.status(200);
        res.json({ message: "User profile updated successfully", updateData });
        console.log(`Profile of user with ID ${userId} updated successfully...`);
    } catch (error) {
        res.status(400);
        res.json({ message: "Error updating user profile"+ error.message });
    }
});


// delete user by ID - DELETE /profile/delete
profileRouter.delete("/delete", userAuth, async (req, res, next) => {
    const userId = req.user._id;
    try {
        await User.deleteOne({ _id: userId });
        res.status(200);
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        res.json({ message: "User deleted successfully" });
        console.log(`User with ID ${userId} deleted successfully...`);
    } catch (error) {
        res.status(400);
        res.json({ message: "Error deleting user", error });
    }
});


// Update password of logged in user - PUT /profile/updatePassword
profileRouter.put("/updatePassword", userAuth, async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    try {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401);
            res.json({ message: "Old password is incorrect" });
            return;
        }
        // validating the new password
        if (!validatePassword(newPassword, res)) {
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.updateOne({ _id: user._id }, { password: user.password }, { runValidators: true } /* to check everyspects defined in schema */);
        res.status(200);
        res.json({ message: "Password updated successfully" });
        console.log(`Password for user ${user.firstName} ${user.lastName} updated successfully...`);
    } catch (error) {
        res.status(500);
        res.json({ message: "Error updating password", error });
    }
});


// Exporting the router
module.exports = { 
    profileRouter 
};

