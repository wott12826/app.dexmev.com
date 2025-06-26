const admin = require("firebase-admin");
const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");

// Firebase initialization
// You need to download your service account key from Firebase Console
// Project Settings -> Service Accounts -> Generate New Private Key
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "post-ad037"
});

const db = admin.firestore();
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// Receiving wallet address (where users send SOL deposits)
// Replace with your actual receiving wallet address
const receivingWallet = new PublicKey("8RbHXFBbS1ZhKT3EcDewE2QjuKbFjJp97QumHDieKag9");

// Store processed transaction signatures to avoid duplicates
let processedSignatures = new Set();

// Load processed signatures from Firestore on startup
async function loadProcessedSignatures() {
  try {
    const signaturesDoc = await db.collection("system").doc("processedSignatures").get();
    if (signaturesDoc.exists()) {
      const data = signaturesDoc.data();
      processedSignatures = new Set(data.signatures || []);
      console.log(`Loaded ${processedSignatures.size} processed signatures from database`);
    }
  } catch (error) {
    console.error('Error loading processed signatures:', error);
  }
}

// Save processed signatures to Firestore
async function saveProcessedSignatures() {
  try {
    await db.collection("system").doc("processedSignatures").set({
      signatures: Array.from(processedSignatures),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving processed signatures:', error);
  }
}

// Main function to check for deposits
async function checkForDeposits() {
  try {
    console.log('🔍 Checking for new deposits...');
    
    // Get recent transactions for the receiving wallet
    const signatures = await connection.getSignaturesForAddress(receivingWallet, { 
      limit: 50 
    });

    for (const sigInfo of signatures) {
      const signature = sigInfo.signature;
      
      // Skip if already processed
      if (processedSignatures.has(signature)) {
        continue;
      }

      try {
        // Get full transaction details
        const transaction = await connection.getTransaction(signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0
        });

        if (!transaction || !transaction.meta) {
          console.log(`⚠️ Skipping transaction ${signature}: No transaction data`);
          processedSignatures.add(signature);
          continue;
        }

        // Check if this is a SOL transfer (not a token transfer)
        const preBalances = transaction.meta.preBalances;
        const postBalances = transaction.meta.postBalances;
        
        // Find the receiving wallet index
        const receivingWalletIndex = transaction.transaction.message.accountKeys.findIndex(
          key => key.toBase58() === receivingWallet.toBase58()
        );

        if (receivingWalletIndex === -1) {
          console.log(`⚠️ Skipping transaction ${signature}: Receiving wallet not found in transaction`);
          processedSignatures.add(signature);
          continue;
        }

        // Calculate SOL received
        const preBalance = preBalances[receivingWalletIndex];
        const postBalance = postBalances[receivingWalletIndex];
        const solReceived = (postBalance - preBalance) / 1e9; // Convert lamports to SOL

        if (solReceived > 0) {
          console.log(`💰 ${solReceived} SOL received in transaction ${signature}`);
          
          // Find the sender (first account that's not the receiving wallet)
          let senderAddress = null;
          for (let i = 0; i < transaction.transaction.message.accountKeys.length; i++) {
            const accountKey = transaction.transaction.message.accountKeys[i];
            if (accountKey.toBase58() !== receivingWallet.toBase58()) {
              senderAddress = accountKey.toBase58();
              break;
            }
          }

          if (senderAddress) {
            console.log(`📤 Sender: ${senderAddress}`);
            
            // Find user by wallet address
            const userQuery = await db.collection("users")
              .where("solanaWallet", "==", senderAddress)
              .limit(1)
              .get();

            if (!userQuery.empty) {
              const userDoc = userQuery.docs[0];
              const userId = userDoc.id;
              const userData = userDoc.data();
              
              // Calculate reward (1 SOL = 1000 tokens)
              const reward = Math.floor(solReceived * 1000);
              
              // Update user balance
              await db.collection("users").doc(userId).update({
                balance: admin.firestore.FieldValue.increment(reward),
                lastDepositAt: admin.firestore.FieldValue.serverTimestamp()
              });

              // Log the deposit transaction
              await db.collection("deposits").add({
                userId: userId,
                userEmail: userData.email,
                senderWallet: senderAddress,
                receivingWallet: receivingWallet.toBase58(),
                solAmount: solReceived,
                tokenReward: reward,
                transactionSignature: signature,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                status: "completed"
              });

              console.log(`✅ Added ${reward} tokens to user ${userData.email} (${userId})`);
              console.log(`📊 New balance: ${(userData.balance || 0) + reward} tokens`);
            } else {
              console.log(`⚠️ No user found with wallet ${senderAddress}`);
              
              // Log unknown deposit
              await db.collection("deposits").add({
                senderWallet: senderAddress,
                receivingWallet: receivingWallet.toBase58(),
                solAmount: solReceived,
                transactionSignature: signature,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                status: "unknown_sender"
              });
            }
          } else {
            console.log(`⚠️ Could not identify sender in transaction ${signature}`);
          }
        } else {
          console.log(`ℹ️ No SOL received in transaction ${signature}`);
        }

        // Mark as processed
        processedSignatures.add(signature);
        
        // Save processed signatures periodically
        if (processedSignatures.size % 10 === 0) {
          await saveProcessedSignatures();
        }

      } catch (error) {
        console.error(`❌ Error processing transaction ${signature}:`, error);
        // Still mark as processed to avoid infinite retries
        processedSignatures.add(signature);
      }
    }

    // Save processed signatures
    await saveProcessedSignatures();
    
  } catch (error) {
    console.error('❌ Error checking for deposits:', error);
  }
}

// Function to get system status
async function getSystemStatus() {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      processedSignaturesCount: processedSignatures.size,
      receivingWallet: receivingWallet.toBase58(),
      connection: "active"
    };

    // Save status to Firestore
    await db.collection("system").doc("monitorStatus").set(status);
    
    console.log('📊 System status updated:', status);
    return status;
  } catch (error) {
    console.error('Error updating system status:', error);
  }
}

// Initialize the monitor
async function initializeMonitor() {
  console.log('🚀 Initializing deposit monitor...');
  console.log(`📥 Monitoring wallet: ${receivingWallet.toBase58()}`);
  
  // Load processed signatures
  await loadProcessedSignatures();
  
  // Initial status update
  await getSystemStatus();
  
  console.log('✅ Deposit monitor initialized successfully');
}

// Start the monitoring process
async function startMonitoring() {
  await initializeMonitor();
  
  // Check for deposits every 15 seconds
  setInterval(checkForDeposits, 15000);
  
  // Update system status every 5 minutes
  setInterval(getSystemStatus, 300000);
  
  console.log('🔄 Deposit monitoring started');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down deposit monitor...');
  await saveProcessedSignatures();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down deposit monitor...');
  await saveProcessedSignatures();
  process.exit(0);
});

// Start the monitor
startMonitoring().catch(error => {
  console.error('❌ Failed to start deposit monitor:', error);
  process.exit(1);
}); 