# Safar Air International - Admin Panel

A modern, professional admin panel for managing the Safar Air International website.

## Features

- **Dashboard**: Overview with statistics and quick actions
- **Package Management**: Add, edit, and delete travel packages
- **Testimonials**: Manage customer testimonials
- **Destinations**: Manage destination highlights
- **Bookings**: View and manage customer bookings
- **Analytics**: Track business performance
- **Content Management**: Manage website content
- **Settings**: Configure admin panel settings

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase project configured

### Setup

1. Configure Firebase in `src/admin/firebase.js` (or it will use the main firebase config)
2. Set up Firebase Authentication
3. Create an admin user in Firebase Authentication

### Access

Navigate to `/admin/login` to access the admin panel.

## Structure

```
src/admin/
├── components/     # Reusable components
├── context/        # React context providers
├── layouts/        # Layout components (Sidebar, Header)
├── pages/          # Page components
├── utils/          # Utility functions
└── App.jsx         # Admin app router
```

## Design

The admin panel uses:
- Modern, clean UI with gradient accents
- Professional color scheme
- Responsive design
- Smooth animations and transitions

## Authentication

The admin panel uses Firebase Authentication. Only authenticated users can access the dashboard and other admin features.

