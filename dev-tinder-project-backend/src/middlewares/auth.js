
const jwt = require("jsonwebtoken");
const User = require("../models/user").User;


// middleware functions for authentication and authorization
const userAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401);
        res.json({ message: "Unauthorized access - No token provided" });
        return;
    }
    try { // verify the token
        const decoded = jwt.verify(token, "your_jwt_secret_key");
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401);
            res.json({ message: "Unauthorized access - User not found" });
            return;
        }
        req.user = user; // attach user to request object
        next(); // proceed to the next middleware or route handler
    } 
    catch (error) { // if token is invalid or expired
        res.status(401);
        res.json({ message: "Unauthorized access - Invalid token" });
        return;
    }
}

module.exports = {
    userAuth,
}

