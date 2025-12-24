
// importing jsonwebtoken module for verifying JWT tokens
const jwt = require("jsonwebtoken");
// importing User model to find user from database
const User = require("../models/user").User;

// middleware function for authentication - checks if user is logged in this function runs before protected routes to verify the user
const userAuth = async (req, res, next) => {
    // getting the token from cookies - we stored it there during login
    const token = req.cookies.token;
    
    // if no token found, user is not logged in
    if (!token) {
        res.status(401);
        res.json({ message: "Unauthorized access - No token provided" });
        return;
    }
    
    try {
        // verifying the token using our secret key
        const jwtSecret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwtSecret);
        
        // finding the user in database using the userId from token
        const user = await User.findById(decoded.userId);
        
        // if user not found in database, token is invalid
        if (!user) {
            res.status(401);
            res.json({ message: "Unauthorized access - User not found" });
            return;
        }
        
        // attaching user to request object so route handlers can access it - this way we don't need to find user again in every route
        req.user = user;
        
        // calling next() to proceed to the actual route handler 
        next();
    } 
    catch (error) {
        // if token is invalid or expired, jwt.verify will throw an error
        res.status(401);
        res.json({ message: "Unauthorized access - Invalid token" });
        return;
    }
}

// exporting the middleware so we can use it in routes
module.exports = {
    userAuth,
}

