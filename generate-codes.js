const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxQhqQhqQhqQhqQhqQhqQhqQhqQhqQhqQ",
  authDomain: "dexmev-app.firebaseapp.com",
  projectId: "dexmev-app",
  storageBucket: "dexmev-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to generate random code
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to generate unique codes
function generateUniqueCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    codes.add(generateCode());
  }
  return Array.from(codes);
}

// Function to save codes to Firebase
async function saveCodesToFirebase(codes) {
  console.log('Generating and saving codes to Firebase...');
  
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const codeData = {
      code: code,
      used: false,
      createdAt: new Date(),
      usedAt: null,
      usedBy: null
    };
    
    try {
      // Save to 'codes' collection
      await addDoc(collection(db, 'codes'), codeData);
      console.log(`Code ${i + 1}/50: ${code} - Saved successfully`);
    } catch (error) {
      console.error(`Error saving code ${code}:`, error);
    }
  }
  
  console.log('\n✅ All 50 codes have been generated and saved to Firebase!');
  console.log('\nGenerated codes:');
  codes.forEach((code, index) => {
    console.log(`${index + 1}. ${code}`);
  });
}

// Generate and save 50 codes
async function main() {
  try {
    const codes = generateUniqueCodes(50);
    await saveCodesToFirebase(codes);
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the script
main(); 