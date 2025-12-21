
// Importing the required modules
const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');
const { ConnectionRequest } = require('../models/connectionRequest');


// Creating router instance
const requestsRouter = express.Router();


// send connection request (interested and ignored) - POST /request/send/:status/:toUserId
requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res, next) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // validating status
    const allowedStatuses = ["interested", "ignored"];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        res.json({ message: "Status must be either interested or ignored." });
        return;
    }
    // checking if toUserId exists
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
    // checking if a request already exists between the two users
    const reverseRequest = await ConnectionRequest.findOne({ fromUserId: toUserId, toUserId: fromUserId });
    if (reverseRequest) {
        res.status(400);
        res.json({ message: "The user has already sent you a connection request. Please review it." });
        return;
    }   
    const existingRequest = await ConnectionRequest.findOne({ fromUserId, toUserId });
    if (existingRequest) {
        res.status(400);
        res.json({ message: "A connection request already exists between you and this user." });
        return;
    }
    // creating connection request
    try {
        const newRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        await newRequest.save();
        res.status(201);
        res.json({ message: "Connection request sent successfully", request: newRequest });
        console.log(`${req.user.firstName} sent a connection request to ${toUser.firstName} successfully...`);
    } catch (error) {
        res.status(500);
        res.json({ message: "Error sending connection request" });
    }
});


// respond to connection request (accept and reject) - POST /request/review/:status/:fromUserId
requestsRouter.post("/review/:status/:fromUserId", userAuth, async (req, res, next) => {
    const toUserId = req.user._id;
    const fromUserId = req.params.fromUserId;
    const status = req.params.status;

    // validating status
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        res.json({ message: "Status must be either accepted or rejected." });
        return;
    }
    // checking if connection request exists
    const existingRequest = await ConnectionRequest.findOne({ fromUserId, toUserId });
    if (!existingRequest) {
        res.status(404);
        res.json({ message: "No connection request found from this user." });
        return;
    }
    // checking if the request has already been reviewed
    if (existingRequest.status === "accepted" || existingRequest.status === "rejected") {
        res.status(400);
        res.json({ message: "This connection request has already been reviewed." });
        return;
    }
    // checking if fromUserId exists
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
    // checking if the request is interested status
    if (existingRequest.status !== "interested") {
        res.status(400);
        res.json({ message: "Only interested connection requests can be reviewed." });
        return;
    }
    // updating the connection request status
    try {
        existingRequest.status = status;
        await existingRequest.save();
        res.status(200);
        res.json({ message: "Connection request reviewed successfully", request: existingRequest });
        console.log(`${fromUser.firstName}'s connection request has been ${status} by ${req.user.firstName} successfully...`);
    } catch (error) {
        res.status(500);
        res.json({ message: "Error reviewing connection request" });
    }
});


// Exporting the router
module.exports = { requestsRouter };

