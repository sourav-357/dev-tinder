
// Importing the required modules
const mongoose = require('mongoose');

// connecting to DB in a async await function
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://souravdev:sourav1976@namstenodejs.4v6bcyl.mongodb.net/devTinder"
    );
};

// exporting module
module.exports = {
    connectDB,
}