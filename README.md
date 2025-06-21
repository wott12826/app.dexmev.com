# Firebase Authentication Setup

This project now includes Firebase authentication for user sign-in and sign-up functionality.

## Features

- **User Registration**: Users can create accounts with email and password
- **User Login**: Users can sign in with their email and password
- **Authentication State Management**: Automatic redirects based on authentication status
- **Logout Functionality**: Users can sign out from the dashboard
- **Form Validation**: Client-side validation for registration and login forms

## Files Modified

1. **`firebase-config.js`** - Firebase configuration and authentication functions
2. **`signin.html`** - Updated with Firebase authentication for login
3. **`signup.html`** - Updated with Firebase authentication for registration
4. **`dashboard.html`** - Added logout functionality

## How It Works

### Authentication Flow

1. **Unauthenticated Users**: Redirected to `signin.html`
2. **Registration**: Users fill out the signup form with email, password, confirm password, and invite code
3. **Login**: Users enter their email and password
4. **Authenticated Users**: Automatically redirected to `dashboard.html`
5. **Logout**: Users can click the logout button in the sidebar to sign out

### Firebase Configuration

The Firebase configuration uses the following services:
- **Authentication**: Email/password authentication
- **Analytics**: Basic analytics tracking

### Security Features

- Password validation (minimum 6 characters)
- Email format validation
- Invite code requirement for registration
- Automatic session management
- Protected route redirects

## Usage

### For Users

1. **Registration**: 
   - Go to `signup.html`
   - Fill in email, password, confirm password, and invite code
   - Click "Sign Up"

2. **Login**:
   - Go to `signin.html`
   - Enter email and password
   - Click "Login"

3. **Logout**:
   - From the dashboard, click the logout button in the sidebar

### For Developers

The authentication system is modular and can be easily extended:

- Add more authentication providers (Google, Facebook, etc.)
- Implement password reset functionality
- Add email verification
- Store additional user data in Firestore

## Firebase Project Setup

Make sure your Firebase project has:
1. Authentication enabled with Email/Password provider
2. Proper security rules configured
3. The correct configuration in `firebase-config.js`

## Error Handling

The system includes comprehensive error handling:
- Network errors
- Invalid credentials
- User not found
- Weak passwords
- Email already in use

All errors are displayed to users in a user-friendly format. 