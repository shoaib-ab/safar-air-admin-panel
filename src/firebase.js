// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
  connectFirestoreEmulator,
} from 'firebase/firestore';
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

// Initialize Firestore WITHOUT offline persistence for admin panel
// This ensures writes happen immediately and don't queue
const db = getFirestore(app);

// Force enable network immediately and keep it enabled
(async () => {
  try {
    await enableNetwork(db);
    console.log('✅ Firestore network enabled');
  } catch (error) {
    console.error('❌ Error enabling Firestore network:', error);
    // Retry after a short delay
    setTimeout(async () => {
      try {
        await enableNetwork(db);
        console.log('✅ Firestore network enabled on retry');
      } catch (retryError) {
        console.error('❌ Failed to enable network on retry:', retryError);
      }
    }, 1000);
  }
})();

const auth = getAuth(app);
// Storage will be fully functional when storage access is granted
const storage = getStorage(app);

export { app, db, auth, storage };
