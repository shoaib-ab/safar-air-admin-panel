# Safar Air International - Admin Panel

A separate, standalone admin panel for managing the Safar Air International website.

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

### Installation

```bash
npm install
```

### Configuration

1. Update Firebase configuration in `src/firebase.js` with your Firebase project credentials
2. Set up Firebase Authentication in your Firebase console
3. Create an admin user account

### Development

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
safar-air-admin-panel/
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── layouts/        # Layout components (Sidebar, Header)
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   ├── firebase.js     # Firebase configuration
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json
└── vite.config.js
```

## Design

The admin panel features:
- Modern, clean UI with gradient accents
- Professional color scheme matching the main website
- Responsive design for all devices
- Smooth animations and transitions
- Playfair Display and Inter fonts

## Authentication

The admin panel uses Firebase Authentication. Only authenticated users can access the dashboard and other admin features.

## Routes

- `/login` - Login page
- `/dashboard` - Main dashboard
- `/packages` - Package management
- `/testimonials` - Testimonials management
- `/destinations` - Destinations management
- `/bookings` - Bookings view
- `/analytics` - Analytics dashboard
- `/content` - Content management
- `/settings` - Settings page

