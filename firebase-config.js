// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvcUP3TD0ZUjYQvWUhVgE2Tt9Xivi3m7s",
  authDomain: "testtest-c94df.firebaseapp.com",
  projectId: "testtest-c94df",
  storageBucket: "testtest-c94df.firebasestorage.app",
  messagingSenderId: "112669024582",
  appId: "1:112669024582:web:9cfa5fcd8c6325085fc547",
  measurementId: "G-1QQTFLJ7WG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to generate a random invite code
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Authentication functions
window.firebaseAuth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create a user profile in Firestore with an invite code
      const inviteCode = generateInviteCode();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        inviteCode: inviteCode
      });
      
      return { success: true, user: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update email
  updateEmail: async (newEmail, currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user is currently signed in" };
      }

      // Re-authenticate user before updating email
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, newEmail);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update password
  updatePassword: async (newPassword, currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No user is currently signed in" };
      }

      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user profile from Firestore, create if it doesn't exist
  getUserProfile: async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        let userData = userDoc.data();
        if (!userData.inviteCode) {
          const newInviteCode = generateInviteCode();
          await setDoc(userDocRef, { inviteCode: newInviteCode }, { merge: true });
          userData.inviteCode = newInviteCode;
        }
        return { success: true, data: userData };
      } else {
        const user = auth.currentUser;
        if (user && user.uid === userId) {
          const newInviteCode = generateInviteCode();
          const newUserProfile = {
            email: user.email,
            inviteCode: newInviteCode
          };
          await setDoc(userDocRef, newUserProfile);
          return { success: true, data: newUserProfile };
        } else {
          return { success: false, error: "User not found or UID mismatch." };
        }
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check authentication state
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  }
};

// Check if user is already signed in
firebaseAuth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, redirect to dashboard
    if (window.location.pathname.includes('signin.html') || window.location.pathname.includes('signup.html')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // User is signed out, redirect to signin if on protected pages
    // But don't redirect if user is on signup page
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('wallet.html') || 
        window.location.pathname.includes('settings.html') ||
        window.location.pathname.includes('mev-bots.html') ||
        window.location.pathname.includes('network.html')) {
      window.location.href = 'signin.html';
    }
  }
}); 