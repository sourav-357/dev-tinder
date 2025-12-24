
// importing express module for creating routes
const express = require('express');
// importing userAuth middleware to check if user is logged in
const { userAuth } = require('../middlewares/auth');
// importing User model to find users in database
const { User } = require('../models/user');
// importing ConnectionRequest model to find connection requests
const { ConnectionRequest } = require('../models/connectionRequest');

// creating router instance - handles all /user routes
const userRouter = express.Router();

// get connection requests route - shows all requests received by logged in user
// GET /user/requests - frontend calls this to show pending requests
// userAuth middleware ensures only logged in users can see their requests
userRouter.get("/requests", userAuth, async (req, res, next) => {
    // getting user ID from req.user (set by userAuth middleware)
    const userId = req.user._id;
    
    try {
        // finding all connection requests where this user is the receiver (toUserId)
        // populate() fills in the fromUserId field with actual user data
        // second parameter specifies which fields to include from the user
        const requests = await ConnectionRequest.find({ toUserId: userId })
            .populate("fromUserId", "firstName lastName age gender about skills photoUrl");
        
        // if no requests found at all
        if (requests.length === 0) {
            res.status(200);
            res.json({ message: "No connection requests found." });
            console.log(`No connection requests found for user ${req.user.firstName}...`);
            return;
        }
        
        // filtering to get only pending requests (status = "interested")
        // we only show requests that haven't been accepted or rejected yet
        const pendingRequests = requests.filter(request => request.status === "interested");
        
        // if no pending requests found
        if (pendingRequests.length === 0) {
            res.status(200);
            res.json({ message: "No pending connection requests found." });
            console.log(`No pending connection requests found for user ${req.user.firstName}...`);
            return;
        }
        
        // sending pending requests back to frontend
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
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error fetching connection requests", error: error.message });
        console.error(`Error fetching connection requests for user ${req.user.firstName}:`, error);
    }
});



// get connections route - shows all users that are connected (accepted requests)
// GET /user/connections - frontend calls this to show all connections
// userAuth middleware ensures only logged in users can see their connections
userRouter.get("/connections", userAuth, async (req, res, next) => {
    // getting user ID from req.user (set by userAuth middleware)
    const userId = req.user._id;
    
    try {
        // finding all accepted connection requests where this user is involved
        // $or means "either condition can be true"
        // we check if user is the sender (fromUserId) OR receiver (toUserId)
        // and status must be "accepted"
        const acceptedRequests = await ConnectionRequest.find({ 
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
            ]
        }).populate("fromUserId toUserId", "firstName lastName age gender about skills photoUrl");
        
        // creating array of connected users
        // we need to figure out which user is the "other" user (not the logged in user)
        const connections = acceptedRequests.map(request => {
            // if logged in user is the sender, return the receiver
            if (request.fromUserId._id.toString() === userId.toString()) {
                return request.toUserId;
            } else {
                // if logged in user is the receiver, return the sender
                return request.fromUserId;
            }
        });
        
        // if no connections found
        if (connections.length === 0) {
            res.status(200);
            res.json({ message: "No connected users found." });
            console.log(`No connected users found for ${req.user.firstName}...`);
            return;
        }
        
        // sending connections back to frontend
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
        // if something goes wrong, send error
        res.status(500);
        res.json({ message: "Error fetching connected users", error: error.message });
        console.error(`Error fetching connected users for ${req.user.firstName}:`, error);
    }
});



// get user feed route - shows potential connections (users you haven't interacted with)
// GET /user/feed?page=1&limit=10 - frontend calls this to show discovery feed
// userAuth middleware ensures only logged in users can see the feed
// pagination allows loading users in batches (better performance)
userRouter.get("/feed", userAuth, async (req, res) => {
  // getting user ID from req.user (set by userAuth middleware)
  const userId = req.user._id;

  // reading page and limit from query parameters (URL parameters)
  // if not provided, use defaults: page=1, limit=10
  // Math.max() ensures values are at least 1 (can't be 0 or negative)
  const page  = Math.max(parseInt(req.query.page)  || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  // calculating how many users to skip (for pagination)
  // page 1: skip 0, page 2: skip 10, page 3: skip 20, etc.
  const skip  = (page - 1) * limit;

  try {
    // step 1: find all connection requests involving the logged-in user
    // this includes requests they sent, received, accepted, rejected, ignored
    const excludedRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    // step 2: build a list of user IDs to exclude from feed
    // we don't want to show users we've already interacted with
    const excludedUserIds = excludedRequests.reduce((ids, request) => {
      // adding both sender and receiver IDs to the set
      ids.add(request.fromUserId.toString());
      ids.add(request.toUserId.toString());
      return ids;
    }, new Set());
    // also exclude ourselves (can't connect with yourself!)
    excludedUserIds.add(userId.toString());

    // converting Set to Array because MongoDB needs an array
    const excludedIdsArray = Array.from(excludedUserIds);

    // step 3: count total users available for feed (for pagination info)
    // $nin means "not in" - find users whose ID is NOT in excludedIdsArray
    const totalUsers = await User.countDocuments({
      _id: { $nin: excludedIdsArray },
    });

    // step 4: fetch users for the current page
    // $nin excludes users we've already interacted with
    // second parameter specifies which fields to return (we don't need password)
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
      .skip(skip)  // skip users from previous pages
      .limit(limit); // only get 'limit' number of users

    // if no users found for this page
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

    // sending feed users back to frontend with pagination info
    res.status(200).json({
      message: "User feed fetched successfully",
      feed: feedUsers,
      page,
      limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      hasNextPage: page * limit < totalUsers, // true if there are more pages
    });
  } catch (error) {
    // if something goes wrong, send error
    console.error(`Error fetching user feed for ${req.user.firstName}:`, error);
    res
      .status(500)
      .json({ message: "Error fetching user feed", error: error.message });
  }
});



// delete connection route - removes a connection between two users
// DELETE /user/deleteconnections/:userId - frontend calls this to remove a connection
// userAuth middleware ensures only logged in users can delete connections
userRouter.delete("/deleteconnections/:userId", userAuth, async (req, res) => {
  // getting logged in user's ID from req.user (set by userAuth middleware)
  const loggedInUserId = req.user._id;
  // getting the other user's ID from URL parameters
  const { userId } = req.params;

  // if no user ID provided in URL, send error
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // finding the accepted connection between these two users
    // $or checks both directions - user A to B or user B to A
    // status must be "accepted" (only delete actual connections)
    const connection = await ConnectionRequest.findOne({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUserId, toUserId: userId },
        { fromUserId: userId, toUserId: loggedInUserId },
      ],
    });
    
    // if no connection found, they're not connected
    if (!connection) {
      return res
        .status(404)
        .json({ message: "No active connection found" });
    }
    
    // deleting the connection from database
    await ConnectionRequest.deleteOne({ _id: connection._id });
    
    return res.status(200).json({
      message: "Connection deleted successfully",
    });
  } 
  catch (error) {
    // if something goes wrong, send error
    console.error("Error deleting connection:", error);
    return res.status(500).json({
      message: "Error deleting connection",
      error: error.message,
    });
  }
});

// exporting the router so we can use it in app.js
module.exports = {
    userRouter
};

