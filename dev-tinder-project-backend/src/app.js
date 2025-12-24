
// importing express module for creating the server
const express = require("express");
// importing database connection function from config folder
const { connectDB } = require("./config/database");
// importing cookie-parser module for handling cookies
const cookieParser = require("cookie-parser");
// importing cors module for handling cross-origin requests
const cors = require("cors");

// importing all the routers we created for different routes
const requestsRouter = require("./routes/requestsRouter").requestsRouter;
const authRouter = require("./routes/authRouter").authRouter;
const profileRouter = require("./routes/profileRouter").profileRouter;
const userRouter = require("./routes/userRouter").userRouter;

// creating express app instance - this is our main application
const app = express();

// getting port from environment variable
const port = process.env.PORT || 5000;

// configuring CORS - this allows our frontend (running on different port) to talk to backend
// must be before other middleware or it won't work properly
app.use(cors({
    // list of frontend URLs that are allowed to make requests
    origin: process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(',') 
        : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    // allow cookies to be sent with requests - needed for authentication
    credentials: true,
    // which HTTP methods are allowed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // which headers can be sent
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    // expose Set-Cookie header so frontend knows about cookies
    exposedHeaders: ["Set-Cookie"]
}));

// middleware to parse JSON data from request body
// without this, we can't read JSON data sent from frontend
app.use(express.json());

// middleware to parse cookies from request
// needed because we store authentication token in cookies
app.use(cookieParser());


// health check route - useful for deployment platforms to check if server is running
// deployment platforms ping this route to see if server is alive
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running", status: "ok" });
});

// defining all our routes - these are the endpoints our frontend will call
app.use("/auth", authRouter);
// "/profile" routes go to profileRouter
app.use("/profile", profileRouter);
// "/request" routes go to requestsRouter
app.use("/request", requestsRouter);
// "/user" routes go to userRouter
app.use("/user", userRouter);

// logging all registered routes - helpful for debugging
console.log("Routes registered:");
console.log("  GET /health");
console.log("  POST /auth/signup");
console.log("  POST /auth/login");
console.log("  POST /auth/logout");
console.log("  GET /profile/view");
console.log("  PUT /profile/edit");
console.log("  DELETE /profile/delete");
console.log("  PUT /profile/updatePassword");
console.log("  DELETE /user/deleteconnection/:id");

// catch-all route - if someone tries to access a route that doesn't exist. this will send a 404 error with helpful message
app.use((req, res) => {
    res.status(404).json({ 
        message: `Route not found: ${req.method} ${req.path}`,
        availableRoutes: [
            "GET /health",
            "POST /auth/signup",
            "POST /auth/login",
            "POST /auth/logout"
        ]
    });
});

// starting the server - this makes our backend listen for requests
// we start server first, then connect to database
app.listen(port, () => {
    console.log(`Server started at port ${port}....`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    
    // connecting to database after server starts
    // using .then() and .catch() to handle success and errors
    connectDB()
        .then(() => {
            console.log("Database connection established...");
        })
        .catch((err) => {
            console.error({ message: "Error connecting to the database", error: err });
            console.log("Server is running without database connection...");
        });
});

// exporting the app - sometimes we need this for testing
module.exports = {app};


// -------------------------------------------- End of src/app.js -------------------------------------------- //