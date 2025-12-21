# DevTinder - Developer Networking Platform

A full-stack developer networking application built from scratch. Think Tinder, but for developers looking to connect, collaborate, and build together. This project demonstrates end-to-end development skills: RESTful API design, authentication flows, state management, and responsive UI implementation.

## Project Overview

This is a complete MERN-like stack application (minus the R - using Express instead of React Native for now). The backend handles authentication, connection management, and feed algorithms, while the frontend provides an intuitive interface for users to discover and connect with other developers.

**What makes this different:**
- Cookie-based JWT authentication (no localStorage security risks)
- Stateful connection workflow (interested → accepted/rejected → connected)
- Smart feed algorithm that excludes already-interacted users
- Production-ready error handling and validation
- Fully responsive design with mobile-first approach

## Project Structure

```
season-02/
├── dev-tinder-frontend/       # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # Feature-based component organization
│   │   │   ├── auth/          # Login, Signup forms
│   │   │   ├── feed/          # Discovery feed with pagination
│   │   │   ├── requests/     # Connection request management
│   │   │   ├── connections/  # Accepted connections view
│   │   │   └── profile/       # Profile CRUD operations
│   │   ├── context/           # AuthContext for global state
│   │   ├── utils/             # API client (axios config)
│   │   └── pages/             # Route-level components
│   └── package.json
│
└── dev-tinder-project-backend/  # Express API server
    ├── src/
    │   ├── routes/            # RESTful route handlers
    │   ├── models/           # Mongoose schemas
    │   ├── middlewares/      # JWT auth middleware
    │   ├── utils/            # Validation helpers
    │   └── config/           # Database connection
    └── package.json
```

## Tech Stack

**Frontend:**
- React 19 with hooks
- React Router 7 for navigation
- Tailwind CSS 4 + DaisyUI for styling
- Axios for API calls (configured with credentials)
- Vite for fast development and optimized builds

**Backend:**
- Node.js with Express 5
- MongoDB with Mongoose ODM
- JWT for authentication (stored in HTTP-only cookies)
- bcrypt for password hashing
- CORS configured for cross-origin requests

## Key Features

### Authentication System
- Secure signup with password strength validation
- JWT-based session management via HTTP-only cookies
- Protected routes with middleware authentication
- Logout functionality that clears server-side sessions

### Profile Management
- View and edit profile information
- Update password with old password verification
- Account deletion with proper cleanup
- Field-level validation (email format, skill limits, etc.)

### Connection Workflow
- Discovery feed with pagination (excludes self and previous interactions)
- Send "Interested" or "Ignore" requests
- Review incoming connection requests (accept/reject)
- View all accepted connections
- Delete existing connections

### User Experience
- Loading states for async operations
- Error handling with user-friendly messages
- Empty states for better UX
- Responsive design (mobile, tablet, desktop)
- Optimistic UI updates where appropriate

## API Endpoints

**Authentication:**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate and set session cookie
- `POST /auth/logout` - Clear session

**Profile:**
- `GET /profile/view` - Get current user profile
- `PUT /profile/edit` - Update profile fields
- `PUT /profile/updatePassword` - Change password
- `DELETE /profile/delete` - Remove account

**Connections:**
- `GET /user/feed?page=1&limit=10` - Paginated discovery feed
- `GET /user/requests` - Pending incoming requests
- `GET /user/connections` - Accepted connections
- `POST /request/send/:status/:toUserId` - Send request (interested/ignored)
- `POST /request/review/:status/:fromUserId` - Review request (accept/reject)
- `DELETE /user/deleteconnections/:userId` - Remove connection

## Getting Started

### Prerequisites
- Node.js 20+ installed
- MongoDB database (local or Atlas)
- npm or yarn package manager

### Backend Setup

```bash
cd dev-tinder-project-backend
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd dev-tinder-frontend
npm install
npm run dev    # Starts dev server on http://localhost:5173
```

For production build:
```bash
npm run build      # Creates optimized build in dist/
npm run preview    # Preview production build locally
```

### Configuration

Make sure the frontend API base URL in `src/utils/api.js` matches your backend URL. Default is `http://localhost:5000` for development.

## Architecture Decisions

**Why HTTP-only cookies for JWT?**
- Prevents XSS attacks (JavaScript can't access cookies)
- Automatic cookie handling by browsers
- More secure than localStorage for sensitive tokens

**Why feature-based component structure?**
- Easier to locate related code
- Better scalability as features grow
- Clear separation of concerns

**Why pagination in the feed?**
- Better performance with large user bases
- Improved UX (faster initial load)
- Allows for infinite scroll implementation later

**Why stateful connection requests?**
- Tracks relationship status explicitly
- Prevents duplicate requests
- Enables future features (blocking, reporting, etc.)

## Deployment Considerations

**Backend:**
- Use environment variables for secrets (never commit .env)
- Set `Secure` and `SameSite` cookie flags for HTTPS
- Configure CORS to allow only your frontend domain
- Use process managers (PM2) for production
- Enable MongoDB connection pooling

**Frontend:**
- Build static assets with `npm run build`
- Deploy to static hosting (Vercel, Netlify, S3)
- Update API_BASE_URL to production backend URL
- Ensure HTTPS for cookie security

## What I Learned Building This

- Implementing secure authentication without third-party libraries
- Designing RESTful APIs with proper status codes and error handling
- Managing application state with React Context (avoiding Redux complexity)
- Building responsive UIs with Tailwind CSS utility classes
- Handling edge cases in connection workflows (duplicates, self-requests, etc.)
- Optimizing database queries for feed algorithms

## Future Enhancements

- Real-time notifications using WebSockets
- Advanced filtering in discovery feed (skills, location, etc.)
- Messaging system between connected users
- Email verification and password reset flows
- Rate limiting and API security hardening
- Unit and integration tests

## Notes for Reviewers

This project was built to demonstrate full-stack capabilities. Every feature was implemented from scratch - no code generators or boilerplate templates. The focus was on understanding the fundamentals: how authentication works, how to structure a scalable codebase, and how to create a good user experience.

The code is production-ready in terms of structure and security practices, though some features (like rate limiting and comprehensive testing) are marked for future enhancement.

---

Built with attention to detail and a focus on learning. Feedback welcome!
