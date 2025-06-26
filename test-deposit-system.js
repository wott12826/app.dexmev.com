const admin = require("firebase-admin");
const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");

// Firebase initialization
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "post-ad037"
});

const db = admin.firestore();
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// Test functions
async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Test reading from users collection
    const usersSnapshot = await db.collection("users").limit(1).get();
    console.log('✅ Firebase connection successful');
    console.log(`📊 Found ${usersSnapshot.size} users in database`);
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    return false;
  }
}

async function testSolanaConnection() {
  console.log('🧪 Testing Solana connection...');
  
  try {
    // Test getting recent blockhash
    const blockhash = await connection.getLatestBlockhash();
    console.log('✅ Solana connection successful');
    console.log(`📊 Latest blockhash: ${blockhash.blockhash}`);
    return true;
  } catch (error) {
    console.error('❌ Solana connection failed:', error.message);
    return false;
  }
}

async function testUserOperations() {
  console.log('🧪 Testing user operations...');
  
  try {
    // Test creating a test user
    const testUserId = 'test-user-' + Date.now();
    const testUserData = {
      email: 'test@example.com',
      balance: 1000,
      solanaWallet: 'TestWalletAddress123',
      inviteCode: 'TEST123',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection("users").doc(testUserId).set(testUserData);
    console.log('✅ Test user created successfully');
    
    // Test reading user
    const userDoc = await db.collection("users").doc(testUserId).get();
    if (userDoc.exists()) {
      console.log('✅ Test user read successfully');
      console.log(`📊 User balance: ${userDoc.data().balance}`);
    }
    
    // Test updating balance
    await db.collection("users").doc(testUserId).update({
      balance: admin.firestore.FieldValue.increment(500)
    });
    console.log('✅ Balance update successful');
    
    // Test finding user by wallet
    const userQuery = await db.collection("users")
      .where("solanaWallet", "==", "TestWalletAddress123")
      .limit(1)
      .get();
    
    if (!userQuery.empty) {
      console.log('✅ Find user by wallet successful');
    }
    
    // Cleanup test user
    await db.collection("users").doc(testUserId).delete();
    console.log('✅ Test user cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ User operations failed:', error.message);
    return false;
  }
}

async function testDepositLogging() {
  console.log('🧪 Testing deposit logging...');
  
  try {
    // Test creating a deposit record
    const testDeposit = {
      userId: 'test-user-id',
      userEmail: 'test@example.com',
      senderWallet: 'SenderWallet123',
      receivingWallet: 'ReceivingWallet456',
      solAmount: 0.5,
      tokenReward: 500,
      transactionSignature: 'TestSignature123',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    };
    
    const depositRef = await db.collection("deposits").add(testDeposit);
    console.log('✅ Deposit logging successful');
    console.log(`📊 Deposit ID: ${depositRef.id}`);
    
    // Cleanup test deposit
    await depositRef.delete();
    console.log('✅ Test deposit cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Deposit logging failed:', error.message);
    return false;
  }
}

async function testSystemStatus() {
  console.log('🧪 Testing system status...');
  
  try {
    // Test updating system status
    const status = {
      timestamp: new Date().toISOString(),
      processedSignaturesCount: 0,
      receivingWallet: 'TestWalletAddress',
      connection: 'test'
    };
    
    await db.collection("system").doc("testStatus").set(status);
    console.log('✅ System status update successful');
    
    // Cleanup test status
    await db.collection("system").doc("testStatus").delete();
    console.log('✅ Test status cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ System status failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting deposit system tests...\n');
  
  const tests = [
    { name: 'Firebase Connection', fn: testFirebaseConnection },
    { name: 'Solana Connection', fn: testSolanaConnection },
    { name: 'User Operations', fn: testUserOperations },
    { name: 'Deposit Logging', fn: testDepositLogging },
    { name: 'System Status', fn: testSystemStatus }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        failed++;
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${test.name}: FAILED - ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! System is ready for production.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }
  
  // Cleanup
  process.exit(failed === 0 ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
}); 