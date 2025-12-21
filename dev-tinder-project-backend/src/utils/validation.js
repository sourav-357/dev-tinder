
const validate = require("validator");

// Function to validate signup data
const validateSignupData = (req, res) => {

    // allowed fields check
    const ALLOWED_FIELDS = [ "firstName", "lastName", "emailID", "password", "age", "gender", "photoUrl", "about", "skills" ];
    const isValidOperation = Object.keys(req.body).every((field) =>
        ALLOWED_FIELDS.includes(field)
    );
    if (!isValidOperation) {
        res.status(400);
        res.json({ message: "Invalid fields in request body!" });
        return false;
    }

    // destructing data from the request body
    const { firstName, lastName, emailID, password, age, gender, photoUrl, about, skills } = req.body;

    // validating each field
    if (!firstName || firstName.length < 3) {
        res.status(400);
        res.json({ message: "First name is required and should be at least 3 characters long." });
        return false;
    }
    if (!lastName || lastName.length < 3) {
        res.status(400);
        res.json({ message: "Last name is required and should be at least 3 characters long." });
        return false;
    }
    if (!emailID || !validate.isEmail(emailID)) {
        res.status(400);
        res.json({ message: "A valid email ID is required." });
        return false;
    }
    if (!password || !validate.isStrongPassword(password)) {
        res.status(400);
        res.json({ message: "Password is not strong enough." });
        return false;
    }
    if (age && age < 18) {
        res.status(400);
        res.json({ message: "Age must be at least 18." });
        return false;
    }
    if (gender) {
        const allowedGenders = ["male", "female", "other"];
        if (!allowedGenders.includes(gender.toLowerCase())) {
            res.status(400);
            res.json({ message: "Gender must be either male, female, or other." });
            return false;
        }
    }
    if (photoUrl && !validate.isURL(photoUrl)) {
        res.status(400);
        res.json({ message: "Invalid URL for photoUrl." });
        return false;
    }
    if (about && about.length < 20 && about.length > 0) {
        res.status(400);
        res.json({ message: "About section should be at least 10 characters long." });
        return false;
    }
    if (skills) {
        if (!Array.isArray(skills) || skills.length < 1 || skills.length > 5) {
            res.status(400);
            res.json({ message: "Skills must be an array with 1 to 5 skills." });
            return false;
        }
    }
    // If all validations pass
    return true;
}


// validating the update profile data
const validateUpdateProfileData = (updateData, res) => {
    const ALLOWED_UPDATES = [ "photoUrl", "about", "skills", "gender", "age", "firstName", "lastName" ];
    const isUpdateAllowed = Object.keys(updateData).every((update) =>
         ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
        res.status(400);
        res.json({ message: "Invalid updates! Only photoUrl, about, skills, gender, age can be updated." });
        return false;
    }
    return true;
}


// validating the strongness of password data
const validatePassword = (password, res) => {
    if (!validate.isStrongPassword(password)) {
        res.status(400);
        res.json({ message: "Password is not strong enough." });
        return false;
    }
    return true;
}


module.exports = {
    validateSignupData,
    validateUpdateProfileData,
    validatePassword,
};

