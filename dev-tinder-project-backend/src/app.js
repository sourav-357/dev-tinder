
// importing required modules
const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");


// importing routers
const requestsRouter = require("./routes/requestsRouter").requestsRouter;
const authRouter = require("./routes/authRouter").authRouter;
const profileRouter = require("./routes/profileRouter").profileRouter;
const userRouter = require("./routes/userRouter").userRouter;


// creating express app instance
const app = express();
const port = 5000;

// CORS configuration - must be before other middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"], // Allow requests from frontend
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allowed headers
    exposedHeaders: ["Set-Cookie"] // Expose Set-Cookie header
})); // middleware to handle CORS

app.use(express.json()); // middleware to parse JSON request body
app.use(cookieParser()); // middleware to parse cookies


// Health check route (before auth routes)
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running", status: "ok" });
});

// defining routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestsRouter);
app.use("/user", userRouter);

// Debug: Log all registered routes
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

// Catch-all route for undefined routes
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


// Start the server immediately (don't wait for database connection)
app.listen(port, () => {
    console.log(`Server started at port ${port}....`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    
    // Connect to database after server starts
    connectDB()
        .then(() => {
            console.log("Database connection established...");
        })
        .catch((err) => {
            console.error({ message: "Error connecting to the database", error: err });
            console.log("Server is running without database connection...");
        });
});

// exporting the app for testing purposes
module.exports = {app};


// -------------------------------------------- End of src/app.js -------------------------------------------- //