# Safar Air Admin Panel - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Open `src/firebase.js`
   - Replace the placeholder values with your Firebase project credentials:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`

3. **Set Up Firebase Authentication**
   - Go to Firebase Console → Authentication
   - Enable Email/Password authentication
   - Create an admin user account

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Admin Panel**
   - Navigate to `http://localhost:5173`
   - Login with your admin credentials

## Project Structure

```
safar-air-admin-panel/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── PackageCard.jsx
│   │   ├── PackageForm.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx
│   ├── layouts/             # Layout components
│   │   ├── AdminLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Packages.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Destinations.jsx
│   │   ├── Bookings.jsx
│   │   ├── Analytics.jsx
│   │   ├── Content.jsx
│   │   └── Settings.jsx
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── firebase.js          # Firebase configuration
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## Features

- ✅ Modern, professional UI design
- ✅ Firebase Authentication
- ✅ Package Management (CRUD)
- ✅ Testimonials Management
- ✅ Destinations Management
- ✅ Bookings View
- ✅ Analytics Dashboard
- ✅ Content Management
- ✅ Settings Configuration
- ✅ Responsive Design
- ✅ Mobile-friendly sidebar

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

You can deploy this admin panel to:
- Vercel
- Netlify
- Firebase Hosting
- Any static hosting service

Make sure to set up environment variables for Firebase configuration if needed.

