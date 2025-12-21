
// importing required modules
const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');
const { ConnectionRequest } = require('../models/connectionRequest');

// creating router instance
const userRouter = express.Router();


// show all connection requests received by the user - GET /user/requests
userRouter.get("/requests", userAuth, async (req, res, next) => {
    const userId = req.user._id;
    try {
        const requests = await ConnectionRequest.find({ toUserId: userId }).populate( "fromUserId",  "firstName lastName age gender about skills photoUrl" );
        // check if no requests found
        if (requests.length === 0) {
            res.status(200);
            res.json({ message: "No connection requests found." });
            console.log(`No connection requests found for user ${req.user.firstName}...`);
            return;
        }
        // if no pending requests found
        const pendingRequests = requests.filter(request => request.status === "interested");
        if (pendingRequests.length === 0) {
            res.status(200);
            res.json({ message: "No pending connection requests found." });
            console.log(`No pending connection requests found for user ${req.user.firstName}...`);
            return;
        }
        try {
            res.status(200);
            res.json({ message: "Connection requests fetched successfully", requests: pendingRequests });
            console.log(`Connection requests for user ${req.user.firstName} fetched successfully...`);
        } catch (error) {
            res.status(500);
            res.json({ message: "Error fetching connection requests", error: error.message });
            console.error(`Error fetching connection requests for user ${req.user.firstName}:`, error);
        }
    } catch (error) {
        res.status(500);
        res.json({ message: "Error fetching connection requests", error: error.message });
        console.error(`Error fetching connection requests for user ${req.user.firstName}:`, error);
    }
});



// show all the connected users - GET /user/connections
userRouter.get("/connections", userAuth, async (req, res, next) => {
    const userId = req.user._id;
    try {
        const acceptedRequests = await ConnectionRequest.find({ 
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
            ]
        }).populate("fromUserId toUserId", "firstName lastName age gender about skills photoUrl");
        // setting up the connections array
        const connections = acceptedRequests.map(request => {
            if (request.fromUserId._id.toString() === userId.toString()) {
                return request.toUserId;
            } else {
                return request.fromUserId;
            }
        });
        // check if no connections found
        if (connections.length === 0) {
            res.status(200);
            res.json({ message: "No connected users found." });
            console.log(`No connected users found for ${req.user.firstName}...`);
            return;
        }
        // sending response
        try {    
            res.status(200);
            res.json({ message: "Connected users fetched successfully", connections });
            console.log(`Connected users for ${req.user.firstName} fetched successfully...`);
        } catch (error) {
            res.status(500);
            res.json({ message: "Error fetching connected users", error: error.message });
            console.error(`Error fetching connected users for ${req.user.firstName}:`, error);
        }
    } catch (error) {
        res.status(500);
        res.json({ message: "Error fetching connected users", error: error.message });
        console.error(`Error fetching connected users for ${req.user.firstName}:`, error);
    }
});



// Getting the user feed and adding pagination  - GET /user/feed?page=1&limit=10
userRouter.get("/feed", userAuth, async (req, res) => {
  const userId = req.user._id;

  // read page & limit from query, with defaults
  const page  = Math.max(parseInt(req.query.page)  || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip  = (page - 1) * limit;

  try {
    // 1) find all requests involving the logged-in user
    const excludedRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    // 2) build excluded user id set (connected / ignored / rejected + self)
    const excludedUserIds = excludedRequests.reduce((ids, request) => {
      ids.add(request.fromUserId.toString());
      ids.add(request.toUserId.toString());
      return ids;
    }, new Set());
    excludedUserIds.add(userId.toString());

    const excludedIdsArray = Array.from(excludedUserIds);

    // 3) total count (for pagination metadata)
    const totalUsers = await User.countDocuments({
      _id: { $nin: excludedIdsArray },
    });

    // 4) fetch paginated feed users
    const feedUsers = await User.find(
      { _id: { $nin: excludedIdsArray } },
      {
        firstName: 1,
        lastName: 1,
        age: 1,
        gender: 1,
        about: 1,
        skills: 1,
        photoUrl: 1,
      }
    )
      .skip(skip)
      .limit(limit);

    if (feedUsers.length === 0) {
      return res.status(200).json({
        message: "No users found for feed.",
        feed: [],
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      });
    }

    res.status(200).json({
      message: "User feed fetched successfully",
      feed: feedUsers,
      page,
      limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      hasNextPage: page * limit < totalUsers,
    });
  } catch (error) {
    console.error(`Error fetching user feed for ${req.user.firstName}:`, error);
    res
      .status(500)
      .json({ message: "Error fetching user feed", error: error.message });
  }
});



// Deleting the user's particular connection -> DELETE /user/connections/:userId
userRouter.delete("/deleteconnections/:userId", userAuth, async (req, res) => {
  const loggedInUserId = req.user._id;
  const { userId } = req.params;

  // if there is no user Id to be deleted 
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // find accepted connection between both users
    const connection = await ConnectionRequest.findOne({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUserId, toUserId: userId },
        { fromUserId: userId, toUserId: loggedInUserId },
      ],
    });
    // if both the users are not in connection of one another
    if (!connection) {
      return res
        .status(404)
        .json({ message: "No active connection found" });
    }
    // deleting the connection between two users 
    await ConnectionRequest.deleteOne({ _id: connection._id });
    return res.status(200).json({
      message: "Connection deleted successfully",
    });
  } 
  catch (error) {
    console.error("Error deleting connection:", error);
    return res.status(500).json({
      message: "Error deleting connection",
      error: error.message,
    });
  }
});



// exporting the router
module.exports = {
    userRouter
};

