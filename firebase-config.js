// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, limit, updateDoc, increment, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
  // Check if registration code exists and is available for use
  checkRegistrationCode: async (registrationCode) => {
    try {
      console.log('Checking registration code:', registrationCode);
      
      if (!registrationCode || registrationCode.trim() === '') {
        console.log('No registration code provided');
        return false;
      }
      
      const q = query(
        collection(db, "registrationCodes"),
        where("code", "==", registrationCode.trim()),
        where("used", "==", false),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('Registration code not found or already used');
        return false;
      }
      
      console.log('Registration code is valid and available');
      return true;
    } catch (error) {
      console.error('Error checking registration code:', error);
      return false;
    }
  },

  // Check if invite code exists in Firestore and is available for use (no auth required)
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
      
      if (querySnapshot.empty) {
        console.log('Invite code not found');
        return false;
      }
      
      const userData = querySnapshot.docs[0].data();
      
      // Check if code has been used (single-use implementation)
      if (userData.usedBy && userData.usedBy.length > 0) {
        console.log('Invite code has already been used');
        return false;
      }
      
      console.log('Invite code is valid and available');
      return true;
    } catch (error) {
      console.error('Error checking invite code:', error);
      return false;
    }
  },

  // Sign up with email and password using registration codes
  signUp: async (email, password, registrationCode) => {
    try {
      console.log('Starting sign up process for:', email);
      console.log('Registration code provided:', registrationCode);
      
      // Check if this is the first user by trying to query users collection
      let isFirstUser = false;
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        isFirstUser = querySnapshot.empty;
        console.log('Is first user:', isFirstUser);
      } catch (error) {
        console.log('Error checking if first user, assuming not first:', error);
        isFirstUser = false;
      }
      
      // If not the first user, registration code is required
      if (!isFirstUser) {
        if (!registrationCode || registrationCode.trim() === '') {
          return { success: false, error: "Registration code is required" };
        }
        
        // Check if registration code exists and is unused
        const registrationCodesRef = collection(db, "registrationCodes");
        const codeToFind = registrationCode.trim().toUpperCase();
        const q = query(registrationCodesRef, where("code", "==", codeToFind), where("used", "==", false), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return { success: false, error: "Invalid or already used registration code" };
        }
        
        const codeDoc = querySnapshot.docs[0];
        const codeRef = doc(db, "registrationCodes", codeDoc.id);
        
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        try {
          // Mark registration code as used
          await runTransaction(db, async (transaction) => {
            const codeSnap = await transaction.get(codeRef);
            const codeData = codeSnap.data();
            
            if (codeData.used) {
              throw new Error("Registration code already used");
            }
            
            // Mark code as used
            transaction.update(codeRef, {
              used: true,
              usedAt: new Date().toISOString(),
              usedBy: user.email
            });
          });
          
          console.log('Registration code marked as used successfully');
        } catch (err) {
          console.error('Error marking registration code as used:', err);
          await user.delete();
          return { success: false, error: "Invalid or already used registration code" };
        }
        
        // Create user profile
        const newInviteCode = generateInviteCode();
        const userProfile = {
          email: user.email,
          inviteCode: newInviteCode,
          createdAt: new Date().toISOString(),
          balance: 0,
          solanaWallet: '',
          usedBy: [],
          registeredWith: registrationCode.trim()
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
        return { success: true, user: user };
      } else {
        // First user (without registration code)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const newInviteCode = generateInviteCode();
        const userProfile = {
          email: user.email,
          inviteCode: newInviteCode,
          createdAt: new Date().toISOString(),
          balance: 0,
          solanaWallet: '',
          usedBy: [],
          isFirstUser: true
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
        return { success: true, user: user };
      }
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
        balance: 0, // Initial balance
        solanaWallet: '', // Will be set when user connects wallet
        usedBy: [], // Track who used this invite code
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
        
        // Ensure inviteCode exists
        if (!userData.inviteCode) {
          const newInviteCode = generateInviteCode();
          await setDoc(userDocRef, { inviteCode: newInviteCode }, { merge: true });
          userData.inviteCode = newInviteCode;
          console.log('Generated new invite code:', newInviteCode);
        }
        
        // Ensure usedBy field exists for single-use tracking
        if (!userData.usedBy) {
          await setDoc(userDocRef, { usedBy: [] }, { merge: true });
          userData.usedBy = [];
          console.log('Added usedBy field to user profile');
        }
        
        return { success: true, data: userData };
      } else {
        console.log('User profile not found, creating new one');
        const newInviteCode = generateInviteCode();
        const newUserProfile = {
          email: user.email,
          inviteCode: newInviteCode,
          createdAt: new Date().toISOString(),
          balance: 0, // Initial balance
          solanaWallet: '', // Will be set when user connects wallet
          usedBy: [] // Track who used this invite code
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

  // Update user's Solana wallet address
  updateSolanaWallet: async (userId, walletAddress) => {
    try {
      const user = ensureAuthenticated();
      console.log('Updating Solana wallet for user:', userId, 'Wallet:', walletAddress);
      
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        solanaWallet: walletAddress,
        walletConnectedAt: new Date().toISOString()
      });
      
      console.log('Solana wallet updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update Solana wallet error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user balance
  getUserBalance: async (userId) => {
    try {
      const user = ensureAuthenticated();
      console.log('Getting balance for user:', userId);
      
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const balance = userData.balance || 0;
        console.log('User balance:', balance);
        return { success: true, balance: balance };
      } else {
        console.log('User profile not found');
        return { success: false, error: "User profile not found" };
      }
    } catch (error) {
      console.error('Get user balance error:', error);
      return { success: false, error: error.message };
    }
  },

  // Add balance to user (used by deposit monitor)
  addBalance: async (userId, amount) => {
    try {
      console.log('Adding balance for user:', userId, 'Amount:', amount);
      
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        balance: increment(amount),
        lastDepositAt: new Date().toISOString()
      });
      
      console.log('Balance added successfully');
      return { success: true };
    } catch (error) {
      console.error('Add balance error:', error);
      return { success: false, error: error.message };
    }
  },

  // Find user by Solana wallet address
  findUserByWallet: async (walletAddress) => {
    try {
      console.log('Finding user by wallet:', walletAddress);
      
      const q = query(
        collection(db, "users"),
        where("solanaWallet", "==", walletAddress),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userData = doc.data();
        console.log('User found by wallet:', doc.id, userData);
        return { success: true, userId: doc.id, userData: userData };
      } else {
        console.log('No user found with wallet:', walletAddress);
        return { success: false, error: "User not found" };
      }
    } catch (error) {
      console.error('Find user by wallet error:', error);
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
      console.log('[DEBUG] User authenticated, will redirect to dashboard in 3 seconds...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 3000);
    }
  } else {
    // User is signed out, redirect to signin if на защищённых страницах, кроме deploy.html
    if ((window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('wallet.html') || 
        window.location.pathname.includes('settings.html') ||
        window.location.pathname.includes('mev-bots.html') ||
        window.location.pathname.includes('network.html')) &&
        !window.location.pathname.includes('mev-bots/deploy.html')) {
      window.location.href = 'signin.html';
    }
  }
}); 