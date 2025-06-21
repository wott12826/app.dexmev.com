// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

// Authentication functions
window.firebaseAuth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
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
  // Protect Firebase elements from Next.js overwrites
  const protectFirebaseElements = () => {
    // Re-attach event listeners if elements were overwritten
    const forms = document.querySelectorAll('[data-firebase-form="true"]');
    const inputs = document.querySelectorAll('[data-firebase-input="true"]');
    const buttons = document.querySelectorAll('[data-firebase-button="true"]');
    const logoutBtn = document.querySelector('[data-firebase-logout="true"]');
    
    // Ensure elements have proper IDs and event listeners
    if (forms.length > 0) {
      forms.forEach(form => {
        if (!form.hasAttribute('data-firebase-protected')) {
          form.setAttribute('data-firebase-protected', 'true');
        }
      });
    }
    
    if (logoutBtn && !logoutBtn.hasAttribute('data-firebase-protected')) {
      logoutBtn.setAttribute('data-firebase-protected', 'true');
    }
  };
  
  // Run protection immediately
  protectFirebaseElements();
  
  // Run protection again after a short delay to catch any late overwrites
  setTimeout(protectFirebaseElements, 100);
  
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