
const mongoose = require("mongoose");
const validator =  require("validator");

// we first create a user Schema that what would be inside the user part 
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
        type: [String],
        // check if the skills array contains more than 1 skill and less than 5 skills
        validate(value) {
            if (value.length < 1 || value.length > 5) {
                throw new Error("Skills must be an array with 1 to 5 skills.");
            }
        }
    },
},
{
    timestamps: true, // record createdAt time and updatedAt time fields
});

// create index for firstName and lastName combination to be unique
userSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

// creating user models 
const User = mongoose.model("User", userSchema);

// exporting the model 
module.exports = {
    User,
}

