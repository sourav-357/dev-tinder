
// importing mongoose module for connecting to MongoDB database
const mongoose = require('mongoose');

// function to connect to MongoDB database
// using async/await because database connection takes time
const connectDB = async () => {
    // getting MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;
    
    // connecting to MongoDB using the connection string
    // mongoose.connect() returns a promise, so we await it
    await mongoose.connect(mongoURI);
    
    console.log("Connected to MongoDB database...");
};

// exporting the function so we can use it in other files
module.exports = {
    connectDB,
}