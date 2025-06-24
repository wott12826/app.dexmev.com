// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Helper function to check if user is authenticated
const ensureAuthenticated = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to perform this operation");
  }
  return user;
};

// Authentication functions
window.firebaseAuth = {
  // Check if invite code exists in Firestore (no auth required)
  checkInviteCode: async (inviteCode) => {
    try {
      console.log('Checking invite code:', inviteCode);
      
      if (!inviteCode || inviteCode.trim() === '') {
        console.log('No invite code provided');
        return false;
      }
      
      const q = query(
        collection(db, "users"),
        where("inviteCode", "==", inviteCode.trim()),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const exists = !querySnapshot.empty;
      console.log('Invite code exists:', exists);
      return exists;
    } catch (error) {
      console.error('Error checking invite code:', error);
      return false;
    }
  },

  // Sign up with email and password
  signUp: async (email, password, inviteCode) => {
    try {
      console.log('Starting sign up process for:', email);
      console.log('Invite code provided:', inviteCode);
      
      // Check if this is the first user by trying to query users collection
      let isFirstUser = false;
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        isFirstUser = querySnapshot.empty;
        console.log('Is first user:', isFirstUser);
      } catch (error) {
        console.log('Error checking if first user, assuming not first:', error);
        // If we can't query users collection, we'll assume it's not the first user
        // and require an invite code
        isFirstUser = false;
      }
      
      // If not the first user, invite code is required
      if (!isFirstUser) {
        if (!inviteCode || inviteCode.trim() === '') {
          return { success: false, error: "Invite code is required" };
        }
        
        // Check if invite code exists in Firestore
        try {
          const isValid = await window.firebaseAuth.checkInviteCode(inviteCode);
          if (!isValid) {
            return { success: false, error: "Invalid invite code" };
          }
        } catch (error) {
          console.error('Error checking invite code:', error);
          return { success: false, error: "Unable to verify invite code. Please try again." };
        }
      }
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User account created:', user.uid);
      
      // Create user profile in Firestore
      const newInviteCode = generateInviteCode();
      const userProfile = {
        email: user.email,
        inviteCode: newInviteCode,
        createdAt: new Date().toISOString(),
        ...(isFirstUser ? {} : { invitedBy: inviteCode.trim() })
      };
      
      console.log('Creating user profile:', userProfile);
      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log('User profile created successfully');
      
      return { success: true, user: user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // Special function for creating the first user (bypasses invite code check)
  createFirstUser: async (email, password) => {
    try {
      console.log('Creating first user:', email);
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('First user account created:', user.uid);
      
      // Create user profile in Firestore
      const newInviteCode = generateInviteCode();
      const userProfile = {
        email: user.email,
        inviteCode: newInviteCode,
        createdAt: new Date().toISOString(),
        isFirstUser: true
      };
      
      console.log('Creating first user profile:', userProfile);
      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log('First user profile created successfully');
      
      return { success: true, user: user, inviteCode: newInviteCode };
    } catch (error) {
      console.error('Create first user error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      console.log('Signing in:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential.user.uid);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      console.log('Signing out');
      await signOut(auth);
      console.log('Sign out successful');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update email
  updateEmail: async (newEmail, currentPassword) => {
    try {
      const user = ensureAuthenticated();
      console.log('Updating email for user:', user.uid);

      // Re-authenticate user before updating email
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, newEmail);
      console.log('Email updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update email error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update password
  updatePassword: async (newPassword, currentPassword) => {
    try {
      const user = ensureAuthenticated();
      console.log('Updating password for user:', user.uid);

      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      console.log('Password updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user profile from Firestore, create if it doesn't exist
  getUserProfile: async (userId) => {
    try {
      const user = ensureAuthenticated();
      console.log('Getting profile for user:', userId);
      
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        let userData = userDoc.data();
        console.log('User profile found:', userData);
        
        if (!userData.inviteCode) {
          const newInviteCode = generateInviteCode();
          await setDoc(userDocRef, { inviteCode: newInviteCode }, { merge: true });
          userData.inviteCode = newInviteCode;
          console.log('Generated new invite code:', newInviteCode);
        }
        return { success: true, data: userData };
      } else {
        console.log('User profile not found, creating new one');
        const newInviteCode = generateInviteCode();
        const newUserProfile = {
          email: user.email,
          inviteCode: newInviteCode,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newUserProfile);
        console.log('New user profile created:', newUserProfile);
        return { success: true, data: newUserProfile };
      }
    } catch (error) {
      console.error('Get user profile error:', error);
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
  console.log('Auth state changed:', user ? user.uid : 'No user');
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