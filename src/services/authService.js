// Authentication Service for BuddySign
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';

// Custom error messages for better UX
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Create parent document in Firestore
const createParentDocument = async (user, additionalData = {}) => {
  const parentRef = doc(db, 'Parents', user.uid);
  
  const parentData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || additionalData.name || '',
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isEmailVerified: user.emailVerified,
    // BuddySign specific fields
    subscription: {
      type: 'free', // 'free', 'premium', 'family'
      startDate: serverTimestamp(),
      endDate: null,
      features: ['basic_lessons', 'progress_tracking']
    },
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        push: true,
        childProgress: true,
        weeklyReports: true
      },
      theme: 'light'
    },
    childrenCount: 0,
    totalPoints: 0,
    // Override with any additional data
    ...additionalData
  };

  await setDoc(parentRef, parentData, { merge: true });
  return parentData;
};

// Get parent document from Firestore
const getParentDocument = async (uid) => {
  const parentRef = doc(db, 'Parents', uid);
  const parentSnap = await getDoc(parentRef);
  
  if (parentSnap.exists()) {
    return { uid, ...parentSnap.data() };
  }
  return null;
};

// Email/Password Signup
export const signUpWithEmail = async (email, password, additionalData = {}) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (additionalData.name) {
      await updateProfile(user, {
        displayName: additionalData.name
      });
    }

    // Send email verification
    await sendEmailVerification(user);

    // Create parent document in Firestore
    const parentData = await createParentDocument(user, additionalData);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        ...parentData
      },
      message: 'Account created successfully! Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get parent data from Firestore
    let parentData = await getParentDocument(user.uid);
    
    // Create parent document if it doesn't exist (for legacy users)
    if (!parentData) {
      parentData = await createParentDocument(user);
    }

    // Update last login time
    await updateDoc(doc(db, 'Parents', user.uid), {
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        ...parentData
      },
      message: 'Signed in successfully!'
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Get or create parent data
    let parentData = await getParentDocument(user.uid);
    
    if (!parentData) {
      // First time Google sign-in, create parent document
      parentData = await createParentDocument(user, {
        authProvider: 'google'
      });
    } else {
      // Update last login time
      await updateDoc(doc(db, 'Parents', user.uid), {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        ...parentData
      },
      message: 'Signed in with Google successfully!'
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Signed out successfully!'
    };
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Password Reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Update Parent Profile
export const updateParentProfile = async (uid, updates) => {
  try {
    const parentRef = doc(db, 'Parents', uid);
    
    // Update Firestore document
    await updateDoc(parentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    // Update Firebase Auth profile if display name changed
    if (updates.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName
      });
    }

    return {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    console.error('Profile update error:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

// Get Current User with Firestore data
export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const parentData = await getParentDocument(user.uid);
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      ...parentData
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Export auth instance for direct access
export { auth };

/*
INTEGRATION GUIDE:

1. In your Sign-Up component:
   import { signUpWithEmail } from '../services/authService';
   
   const handleSignUp = async (email, password, name) => {
     try {
       const result = await signUpWithEmail(email, password, { name });
       // Show success message: result.message
       // Redirect to dashboard or email verification page
     } catch (error) {
       // Show error message: error.message
     }
   };

2. In your Sign-In component:
   import { signInWithEmail, signInWithGoogle } from '../services/authService';
   
   const handleEmailSignIn = async (email, password) => {
     try {
       const result = await signInWithEmail(email, password);
       // Show success message and redirect to dashboard
     } catch (error) {
       // Show error message
     }
   };

3. For logout in any component:
   import { signOutUser } from '../services/authService';
   
   const handleLogout = async () => {
     try {
       await signOutUser();
       // Redirect to sign-in page
     } catch (error) {
       // Show error message
     }
   };
*/