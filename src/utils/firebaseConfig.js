// Firebase SDK Configuration for BuddySign
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "buddysign-app.firebaseapp.com",
  projectId: "buddysign-app",
  storageBucket: "buddysign-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development (optional)
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if using Firebase emulators for local development
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

// Auth configuration
auth.useDeviceLanguage(); // Use device language for auth emails

// Export the app instance
export default app;

/*
SETUP INSTRUCTIONS:
1. Go to Firebase Console (https://console.firebase.google.com/)
2. Create a new project or select existing 'BuddySign' project
3. Go to Project Settings > General > Your apps
4. Add a Web app and copy the config object
5. Replace the firebaseConfig object above with your actual config
6. Enable Authentication > Sign-in method > Email/Password and Google
7. Create Firestore database with rules:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Parents can read/write their own document and children
       match /Parents/{parentId} {
         allow read, write: if request.auth != null && request.auth.uid == parentId;
         
         // Children subcollection under parent
         match /Children/{childId} {
           allow read, write: if request.auth != null && request.auth.uid == parentId;
         }
       }
       
       // Public lesson content (read-only for authenticated users)
       match /Lessons/{lessonId} {
         allow read: if request.auth != null;
       }
     }
   }
*/