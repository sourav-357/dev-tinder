
// importing mongoose module for creating database schemas
const mongoose = require("mongoose");

// creating connection request schema - defines what a connection request document looks like
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: "User", // reference to User model - allows us to populate user data
        required: true, // this field is required
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to User model
        required: true,
    },
    status: {
        type: String,
        required: true,
        // enum means only these specific values are allowed
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "Status must be either interested, ignored, accepted, or rejected",
        },
    },
}, 
{ 
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true 
});

// creating index to ensure unique connection requests between two users. this prevents duplicate requests between the same two users. index also makes database queries faster
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// creating the ConnectionRequest model from the schema. this is what we use to create, find, update, delete connection requests
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

// exporting the model so we can use it in other files
module.exports = { 
    ConnectionRequest
};
