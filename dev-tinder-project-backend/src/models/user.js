
// importing mongoose module for creating database schemas
const mongoose = require("mongoose");
// importing validator module for validating email, password, URLs, etc.
const validator =  require("validator");

// creating user schema - this defines what fields a user document will have
// schema is like a blueprint for user data in MongoDB
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
    }, 
    lastName: {
        type: String,
    },
    emailID: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email ID");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            const allowedGenders = ["male", "female", "other"];
            if (value && !allowedGenders.includes(value.toLowerCase())) {
                throw new Error("Gender must be either male, female, or other");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png",
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid URL for photoUrl");
            }
        }
    },
    about: {
        type: String,
        default: "This is the random defalt about section.",
    },
    skills: {
        type: [String], // array of strings
        // custom validation - check if skills array has 1 to 5 skills
        validate(value) {
            if (value.length < 1 || value.length > 5) {
                throw new Error("Skills must be an array with 1 to 5 skills.");
            }
        }
    },
},
{
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
});

// creating index for firstName and lastName combination to be unique
userSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

// creating the User model from the schema
const User = mongoose.model("User", userSchema);

// exporting the model so we can use it in other files
module.exports = {
    User,
}

