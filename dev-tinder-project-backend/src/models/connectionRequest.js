
const mongoose = require("mongoose");

// Defining the ConnectionRequest schema
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to User model
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to User model
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "Status must be either interested, ignored, accepted, or rejected",
        },
    },
}, 
{ 
    timestamps: true 
});

// Ensuring unique connection requests between two users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// Creating the ConnectionRequest model
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

// Exporting the model  
module.exports = { 
    ConnectionRequest
};
