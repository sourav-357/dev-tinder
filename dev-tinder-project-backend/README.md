# DevTinder Backend API

RESTful API server for the DevTinder platform. Built with Express and MongoDB, focusing on clean architecture, secure authentication, and efficient data handling. This backend handles everything from user authentication to complex connection workflows.

## What This Backend Does

The API manages the entire backend logic for a developer networking platform:
- User authentication and session management
- Profile CRUD operations with validation
- Connection request lifecycle (interested → accepted/rejected)
- Smart feed algorithm that excludes already-interacted users
- Pagination for scalable data retrieval

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens stored in HTTP-only cookies
- **Security:** bcrypt for password hashing, CORS for cross-origin requests
- **Validation:** Custom validation utilities + validator library

## Project Structure

```
src/
├── app.js                 # Express app setup and route mounting
├── config/
│   └── database.js        # MongoDB connection logic
├── middlewares/
│   └── auth.js             # JWT verification middleware
├── models/
│   ├── user.js             # User schema (profile, auth fields)
│   └── connectionRequest.js # Connection relationship schema
├── routes/
│   ├── authRouter.js       # Signup, login, logout
│   ├── profileRouter.js    # Profile CRUD operations
│   ├── requestsRouter.js   # Connection request handling
│   └── userRouter.js       # Feed, requests list, connections
└── utils/
    └── validation.js       # Input validation helpers
```

## Core Features

### Authentication Flow
JWT tokens are issued on login and stored in HTTP-only cookies. This approach:
- Prevents XSS attacks (JavaScript can't access cookies)
- Automatically sent with requests (no manual token management)
- Server can invalidate sessions by clearing cookies

**Implementation details:**
- Passwords hashed with bcrypt (10 rounds)
- JWT expires after 1 hour
- Cookies configured for CORS (sameSite: 'lax', httpOnly: true)

### Connection Workflow
The connection system tracks relationships through explicit states:

1. **Interested/Ignored** - User sends initial request
2. **Accepted/Rejected** - Recipient reviews the request
3. **Connected** - Both users can see each other in connections list

**Business logic implemented:**
- Prevents duplicate requests between same users
- Blocks self-requests
- Handles reverse requests (if B already sent to A, A can't send to B)
- Validates status transitions (can't review non-interested requests)

### Feed Algorithm
The discovery feed is smart about what to show:

```javascript
// Excludes:
// 1. Self
// 2. Users who already have any connection request (interested, ignored, accepted, rejected)
// 3. Supports pagination with metadata (total, hasNextPage, etc.)
```

This ensures users only see new potential connections, improving UX and reducing redundant API calls.

### Validation Layer
Centralized validation in `utils/validation.js`:
- Email format checking
- Strong password requirements (min length, special chars, etc.)
- Skill count limits (1-5 skills)
- Gender domain validation
- URL validation for photo URLs
- Field whitelisting (prevents mass assignment attacks)

## API Endpoints

### Authentication
```
POST   /auth/signup              Create new user account
POST   /auth/login               Authenticate and set JWT cookie
POST   /auth/logout              Clear session cookie
```

### Profile (Protected - requires JWT)
```
GET    /profile/view             Get current user profile
PUT    /profile/edit            Update profile fields
PUT    /profile/updatePassword   Change password
DELETE /profile/delete           Delete account
```

### Connection Requests (Protected)
```
POST   /request/send/:status/:toUserId      Send request (interested/ignored)
POST   /request/review/:status/:fromUserId  Review request (accept/reject)
```

### User Data (Protected)
```
GET    /user/feed?page=1&limit=10          Paginated discovery feed
GET    /user/requests                       Pending incoming requests
GET    /user/connections                    Accepted connections
DELETE /user/deleteconnections/:userId      Remove connection
```

### Health Check
```
GET    /health                              Server status
```

## Database Models

### User Schema
```javascript
{
  firstName: String (required, min 3 chars)
  lastName: String (required, min 3 chars)
  emailID: String (required, unique, validated email)
  password: String (required, hashed with bcrypt)
  age: Number (optional, min 18)
  gender: String (optional, enum: male/female/other)
  photoUrl: String (optional, validated URL)
  about: String (optional, min 20 chars if provided)
  skills: [String] (optional, 1-5 items)
  timestamps: true
}
```

### ConnectionRequest Schema
```javascript
{
  fromUserId: ObjectId (ref: User)
  toUserId: ObjectId (ref: User)
  status: String (enum: interested, ignored, accepted, rejected)
  timestamps: true
}
```

## Security Considerations

**Implemented:**
- Password hashing (bcrypt with salt rounds)
- JWT in HTTP-only cookies (XSS protection)
- Input validation on all endpoints
- Field whitelisting (prevents mass assignment)
- CORS configured for specific origins
- Environment variables for secrets

**For Production:**
- Rate limiting (prevent brute force)
- HTTPS only (Secure cookie flag)
- Request logging and monitoring
- Database connection pooling
- Error sanitization (don't leak stack traces)

## Setup & Development

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_here
```

### Running
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### Testing the API
```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","emailID":"john@example.com","password":"SecurePass123!"}'

# Login (cookie will be set automatically)
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"emailID":"john@example.com","password":"SecurePass123!"}'
```

## Architecture Decisions

**Why Express Router?**
- Clean separation of route logic
- Easy to add new routes without cluttering app.js
- Middleware can be applied per-router

**Why Mongoose?**
- Schema validation at database level
- Easy relationship management (populate)
- Built-in timestamps
- Type safety with schema definitions

**Why Custom Validation?**
- More control over error messages
- Reusable validation functions
- Can add business logic (e.g., skill count limits)

**Why Separate Models?**
- ConnectionRequest as separate model allows querying relationships easily
- Can add indexes for performance
- Future-proof for features like blocking/reporting

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "User-friendly error message",
  "error": "Detailed error (development only)"
}
```

Status codes used:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

## Performance Considerations

- Database indexes on frequently queried fields (emailID, userIds in ConnectionRequest)
- Pagination prevents loading all users at once
- Connection pooling for MongoDB
- Efficient queries (using $nin for exclusion, populate for relationships)

## What I'd Add Next

- Rate limiting middleware
- Request/response logging
- Email verification flow
- Password reset functionality
- Soft deletes (archive instead of delete)
- WebSocket support for real-time updates
- Comprehensive test suite

## Notes

This backend was built to be production-ready in structure, but some production features (like rate limiting and comprehensive logging) are marked for future implementation. The focus was on getting the core functionality right: secure authentication, clean API design, and efficient data handling.

The code follows Express best practices and is structured for easy maintenance and extension.

---

Questions or feedback? The code is well-commented and should be self-explanatory, but feel free to reach out!
