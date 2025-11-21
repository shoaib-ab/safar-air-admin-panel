// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration for Safar Air International Admin Panel
// NOTE: Storage access is limited - will be updated when full storage access is available
const firebaseConfig = {
  apiKey: 'AIzaSyBFazgkf0kmt1-qXTgNcpeMC6Jy3fBQ3HY',
  authDomain: 'safar-air.firebaseapp.com',
  projectId: 'safar-air',
  storageBucket: 'safar-air.firebasestorage.app',
  messagingSenderId: '934914718208',
  appId: '1:934914718208:web:191fc31aaabdd2193c36e5',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// Storage will be fully functional when storage access is granted
const storage = getStorage(app);

export { app, db, auth, storage };

