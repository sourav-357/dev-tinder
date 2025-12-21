# DevTinder Frontend

React-based single-page application for the DevTinder platform. Built with modern tools and best practices: component-based architecture, context API for state management, protected routes, and responsive design.

## Overview

This frontend provides the complete user interface for the DevTinder platform. Users can sign up, discover other developers, send connection requests, manage their profile, and view their connections - all through an intuitive, responsive interface.

## Tech Stack

- **React 19** - UI library with hooks
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **DaisyUI** - Component library built on Tailwind
- **Axios** - HTTP client (configured for cookie-based auth)
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx          # Login form component
│   │   └── Signup.jsx         # Registration form
│   ├── common/
│   │   └── ProtectedRoute.jsx # Route guard component
│   ├── connections/
│   │   ├── ConnectionCard.jsx # Individual connection card
│   │   └── ConnectionsList.jsx # Connections page
│   ├── feed/
│   │   ├── Feed.jsx            # Discovery feed page
│   │   └── UserCard.jsx        # User card in feed
│   ├── profile/
│   │   ├── ProfileView.jsx     # View profile
│   │   ├── ProfileEdit.jsx     # Edit profile form
│   │   └── UpdatePassword.jsx # Password change form
│   └── requests/
│       ├── RequestCard.jsx     # Individual request card
│       └── RequestsList.jsx    # Requests page
├── context/
│   └── AuthContext.jsx         # Global auth state management
├── pages/
│   └── Home.jsx                # Landing/home page
├── utils/
│   └── api.js                  # API client (axios config)
├── App.jsx                      # Main app component (routing)
├── Body.jsx                     # Layout wrapper
├── NavBar.jsx                   # Navigation component
├── Footer.jsx                   # Footer component
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

## Key Features

### Authentication Flow
- Signup with validation (password strength, email format)
- Login with error handling
- Logout that clears session
- Protected routes that redirect unauthenticated users
- Auth state managed globally via Context API

### State Management
Using React Context instead of Redux because:
- Simpler for this app size
- Less boilerplate
- Easier to understand for code reviews
- Sufficient for current needs

The `AuthContext` provides:
- `user` - Current user object
- `isAuthenticated` - Boolean auth status
- `login` - Login function
- `logout` - Logout function
- `loading` - Auth check loading state

### Component Organization
Feature-based folder structure:
- Related components grouped together
- Easy to find code for specific features
- Scales well as features grow
- Clear separation of concerns

### API Integration
Centralized API client in `utils/api.js`:
- Axios configured with `withCredentials: true` (for cookies)
- All endpoints abstracted into functions
- Consistent error handling
- Response interceptor for 401 handling

### User Experience
- **Loading states** - Spinners during async operations
- **Error handling** - User-friendly error messages
- **Empty states** - Helpful messages when no data
- **Responsive design** - Works on mobile, tablet, desktop
- **Form validation** - Client-side validation before API calls

## Component Details

### ProtectedRoute
Wraps routes that require authentication:
- Checks auth status from context
- Redirects to login if not authenticated
- Shows loading state during auth check

### Feed Component
Discovery feed with pagination:
- Fetches users in batches
- "Interested" and "Ignore" buttons
- Handles pagination state
- Shows empty state when no more users

### Profile Components
- **ProfileView** - Displays current user info (read-only)
- **ProfileEdit** - Form to update profile fields
- **UpdatePassword** - Secure password change (requires old password)

### Connection Management
- **RequestsList** - Shows pending incoming requests with accept/reject
- **ConnectionsList** - Shows all accepted connections with delete option

## Styling Approach

**Tailwind CSS** for utility-first styling:
- Fast development (no CSS files to switch between)
- Consistent design system
- Easy responsive design (sm:, md:, lg: breakpoints)
- Small bundle size (purges unused classes)

**DaisyUI** for components:
- Pre-built components (cards, buttons, alerts)
- Theme support
- Accessible by default
- Customizable with Tailwind classes

**Responsive Design:**
- Mobile-first approach
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Touch-friendly button sizes on mobile
- Optimized spacing and typography

## API Integration

All API calls go through `utils/api.js`:

```javascript
// Example usage
import { login, getProfile, sendConnectionRequest } from './utils/api';

// Login
const response = await login(emailID, password);

// Get profile
const profile = await getProfile();

// Send connection request
await sendConnectionRequest(userId, 'interested');
```

**Error Handling:**
- Try-catch blocks in components
- User-friendly error messages
- 401 errors handled globally (redirect to login)

## Routing Structure

```
/                    → Home (public)
/login               → Login form
/signup              → Signup form
/feed                → Discovery feed (protected)
/requests            → Connection requests (protected)
/connections         → Accepted connections (protected)
/profile             → View profile (protected)
/profile/edit        → Edit profile (protected)
/profile/password     → Update password (protected)
```

## Development

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite dev server on `http://localhost:5173` with hot module replacement.

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Configuration

### API Base URL
Update `API_BASE_URL` in `src/utils/api.js`:
```javascript
const API_BASE_URL = "http://localhost:5000"; // Development
// const API_BASE_URL = "https://api.yourdomain.com"; // Production
```

### CORS
Make sure backend CORS is configured to allow your frontend origin. The frontend sends credentials (cookies) with all requests.

## Responsive Design

The UI is fully responsive with breakpoints:
- **Mobile** (< 640px): Single column, full-width buttons, centered content
- **Tablet** (640px - 1024px): Adjusted spacing, side-by-side layouts
- **Desktop** (> 1024px): Full layout with optimal spacing

**Mobile optimizations:**
- Smaller text sizes
- Touch-friendly button sizes
- Reduced padding/margins
- Stacked layouts instead of side-by-side

## State Management Decisions

**Why Context API over Redux?**
- Simpler for this application size
- Less boilerplate code
- Easier to understand and maintain
- Sufficient for current state needs

**What's in Context?**
- Authentication state (user, isAuthenticated)
- Auth methods (login, logout)
- Loading states

**What's in Local State?**
- Component-specific UI state (form inputs, modals)
- API response data (feed, requests, connections)
- Loading/error states per component

## Code Organization Principles

1. **Feature-based folders** - Related components together
2. **Reusable components** - Cards, forms extracted
3. **Centralized API** - All HTTP calls in one place
4. **Consistent naming** - Clear, descriptive component names
5. **Props documentation** - JSDoc comments for components

## Performance Considerations

- **Code splitting** - React Router handles this automatically
- **Optimistic updates** - UI updates before API confirmation where safe
- **Lazy loading** - Can implement for heavy components
- **Image optimization** - Using placeholder images, can add lazy loading
- **Bundle size** - Tailwind purges unused CSS in production

## What I Learned

- Building authentication flows from scratch
- Managing global state without Redux
- Creating responsive designs with Tailwind
- Handling async operations and loading states
- Structuring React apps for scalability
- Integrating with REST APIs
- Building reusable component libraries

## Future Enhancements

- Add loading skeletons instead of spinners
- Implement infinite scroll for feed
- Add image upload functionality
- Real-time notifications (WebSocket integration)
- Dark mode toggle
- Advanced filtering in feed
- Search functionality
- Unit tests with React Testing Library
- E2E tests with Cypress

## Deployment

### Build Process
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Options
- **Vercel** - Zero config, automatic deployments
- **Netlify** - Similar to Vercel, great for SPAs
- **AWS S3 + CloudFront** - For more control
- **Nginx** - Traditional server deployment

### Important Notes
- Update `API_BASE_URL` to production backend URL
- Ensure backend CORS allows your frontend domain
- Use HTTPS in production (required for secure cookies)
- Set up environment variables for different environments

## Notes for Reviewers

This frontend was built with attention to:
- **User experience** - Loading states, error handling, empty states
- **Code quality** - Clean structure, reusable components, consistent patterns
- **Responsive design** - Works well on all screen sizes
- **Maintainability** - Well-organized, commented where needed

The code follows React best practices and is structured for easy extension. No third-party UI libraries beyond DaisyUI - everything else is custom-built to understand the fundamentals.

---

Built to learn and demonstrate full-stack capabilities. The focus was on understanding how all the pieces fit together: routing, state management, API integration, and responsive design.
