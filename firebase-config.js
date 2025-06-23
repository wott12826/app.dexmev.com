// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuL4tpaSsw1ylXf2VZrQ1b_2t_Kxd97cI",
  authDomain: "post-ad037.firebaseapp.com",
  projectId: "post-ad037",
  storageBucket: "post-ad037.firebasestorage.app",
  messagingSenderId: "377312187432",
  appId: "1:377312187432:web:565f47c145e0e73ac0911d",
  measurementId: "G-T48NR3B9VW"
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
  // Check if invite code exists
  checkInviteCode: async (inviteCode) => {
    try {
      const q = query(collection(db, "users"), where("inviteCode", "==", inviteCode));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      return false;
    }
  },

  // Sign up with email and password
  signUp: async (email, password, inviteCode) => {
    try {
      // Check invite code
      const isValid = await window.firebaseAuth.checkInviteCode(inviteCode);
      if (!isValid) {
        return { success: false, error: "Invalid invite code" };
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create a user profile in Firestore with a new invite code
      const newInviteCode = generateInviteCode();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        inviteCode: newInviteCode,
        invitedBy: inviteCode
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