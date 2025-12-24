
// importing express module for creating routes
const express = require('express');
// importing userAuth middleware to check if user is logged in
const { userAuth } = require('../middlewares/auth');
// importing User model to check if user exists
const { User } = require('../models/user');
// importing ConnectionRequest model to create and find connection requests
const { ConnectionRequest } = require('../models/connectionRequest');

// creating router instance - handles all /request routes
const requestsRouter = express.Router();

// send connection request route - allows user to send "interested" or "ignored" request
// POST /request/send/:status/:toUserId - frontend calls this when user swipes/interacts
// :status and :toUserId are URL parameters (like /request/send/interested/123)
// userAuth middleware ensures only logged in users can send requests
requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res, next) => {
    // getting logged in user's ID from req.user (set by userAuth middleware)
    const fromUserId = req.user._id;
    // getting target user's ID from URL parameters
    const toUserId = req.params.toUserId;
    // getting status from URL parameters (either "interested" or "ignored")
    const status = req.params.status;

    // validating status - only allow "interested" or "ignored"
    const allowedStatuses = ["interested", "ignored"];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        res.json({ message: "Status must be either interested or ignored." });
        return;
    }
    
    // checking if the target user exists in database
    const toUser = await User.findById(toUserId);
    if (!toUser) {
        res.status(404);
        res.json({ message: "The user you are trying to connect to does not exist." });
        return;
    }
    
    // preventing users from sending requests to themselves
    if (fromUserId.toString() === toUserId.toString()) {
        res.status(400);
        res.json({ message: "You cannot send a connection request to yourself." });
        return;
    }
    
    // checking if the other user has already sent a request to us
    // if they did, we should review it instead of sending a new one
    const reverseRequest = await ConnectionRequest.findOne({ fromUserId: toUserId, toUserId: fromUserId });
    if (reverseRequest) {
        res.status(400);
        res.json({ message: "The user has already sent you a connection request. Please review it." });
        return;
    }
    
    // checking if we already sent a request to this user
    const existingRequest = await ConnectionRequest.findOne({ fromUserId, toUserId });
    if (existingRequest) {
        res.status(400);
        res.json({ message: "A connection request already exists between you and this user." });
        return;
    }
    
    // creating the connection request
    try {
        // creating new connection request object
        const newRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        // saving to database
        await newRequest.save();
        
        res.status(201);
        res.json({ message: "Connection request sent successfully", request: newRequest });
        console.log(`${req.user.firstName} sent a connection request to ${toUser.firstName} successfully...`);
    } catch (error) {
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error sending connection request" });
    }
});


// review connection request route - allows user to accept or reject incoming requests
// POST /request/review/:status/:fromUserId - frontend calls this when user accepts/rejects
// :status and :fromUserId are URL parameters (like /request/review/accepted/123)
// userAuth middleware ensures only logged in users can review requests
requestsRouter.post("/review/:status/:fromUserId", userAuth, async (req, res, next) => {
    // getting logged in user's ID from req.user (set by userAuth middleware)
    // this user is the receiver (toUserId) of the request
    const toUserId = req.user._id;
    // getting sender's ID from URL parameters
    const fromUserId = req.params.fromUserId;
    // getting status from URL parameters (either "accepted" or "rejected")
    const status = req.params.status;

    // validating status - only allow "accepted" or "rejected"
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        res.json({ message: "Status must be either accepted or rejected." });
        return;
    }
    
    // checking if the connection request exists in database
    const existingRequest = await ConnectionRequest.findOne({ fromUserId, toUserId });
    if (!existingRequest) {
        res.status(404);
        res.json({ message: "No connection request found from this user." });
        return;
    }
    
    // checking if the request has already been reviewed
    // once accepted or rejected, can't change it
    if (existingRequest.status === "accepted" || existingRequest.status === "rejected") {
        res.status(400);
        res.json({ message: "This connection request has already been reviewed." });
        return;
    }
    
    // checking if the sender user still exists
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) {
        res.status(404);
        res.json({ message: "The user who sent the connection request does not exist." });
        return;
    }
    
    // preventing users from reviewing their own requests
    if (fromUserId.toString() === toUserId.toString()) {
        res.status(400);
        res.json({ message: "You cannot review your own connection request." });
        return;
    }
    
    // checking if the request status is "interested"
    // only "interested" requests can be reviewed (not "ignored" ones)
    if (existingRequest.status !== "interested") {
        res.status(400);
        res.json({ message: "Only interested connection requests can be reviewed." });
        return;
    }
    
    // updating the connection request status
    try {
        // changing status to "accepted" or "rejected"
        existingRequest.status = status;
        // saving the updated request to database
        await existingRequest.save();
        
        res.status(200);
        res.json({ message: "Connection request reviewed successfully", request: existingRequest });
        console.log(`${fromUser.firstName}'s connection request has been ${status} by ${req.user.firstName} successfully...`);
    } catch (error) {
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error reviewing connection request" });
    }
});

// exporting the router so we can use it in app.js
module.exports = { requestsRouter };

