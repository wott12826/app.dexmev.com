// Universal Wallet System for DexMev Platform
// This script provides wallet connection functionality for all pages

(function() {
    // Global variables for wallet state
    let walletConnected = false;
    let walletAddress = '';
    let userBalance = 0;
    let currentUser = null;

    // Get user balance from Firebase
    async function getUserBalance() {
        if (currentUser) {
            try {
                const result = await window.firebaseAuth.getUserBalance(currentUser.uid);
                if (result.success) {
                    userBalance = result.balance;
                    updateBalanceDisplay();
                    console.log('Wallet system - User balance updated:', userBalance);
                } else {
                    console.error('Error getting user balance:', result.error);
                }
            } catch (error) {
                console.error('Error getting user balance:', error);
            }
        }
    }

    // Update balance display
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('solBalance');
        if (balanceElement) {
            if (walletConnected && userBalance > 0) {
                balanceElement.textContent = userBalance.toLocaleString() + ' $SOGENT';
            } else {
                balanceElement.textContent = '0';
            }
        }
    }

    // Check if user is authenticated and wallet is connected
    async function checkUserAndWallet() {
        currentUser = window.firebaseAuth.getCurrentUser();
        
        if (currentUser) {
            console.log('User authenticated:', currentUser.uid);
            
            // Get user profile to check if wallet is connected
            try {
                console.log('Checking user profile for saved wallet address...');
                const profileResult = await window.firebaseAuth.getUserProfile(currentUser.uid);
                if (profileResult.success && profileResult.data.solanaWallet) {
                    walletAddress = profileResult.data.solanaWallet;
                    walletConnected = true;
                    console.log('✅ Found saved wallet address:', walletAddress);
                    updateWalletDisplay();
                    getUserBalance(); // Get balance when wallet is already connected
                } else {
                    console.log('ℹ️ No saved wallet address found in user profile');
                }
            } catch (error) {
                console.error('❌ Error checking user profile:', error);
            }
        } else {
            console.log('No authenticated user');
        }
    }

    // Connect wallet function
    async function connectWallet() {
        try {
            console.log('Attempting to connect wallet...');
            
            // Check if Phantom wallet is available
            if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
                const response = await window.solana.connect();
                walletAddress = response.publicKey.toString();
                walletConnected = true;
                
                console.log('Wallet connected successfully:', walletAddress);
                
                // Update wallet in Firebase if user is authenticated
                if (currentUser) {
                    try {
                        console.log('Saving wallet address to Firebase for user:', currentUser.uid);
                        const result = await window.firebaseAuth.updateSolanaWallet(currentUser.uid, walletAddress);
                        if (result.success) {
                            console.log('✅ Wallet address saved to Firebase successfully');
                        } else {
                            console.error('❌ Error saving wallet to Firebase:', result.error);
                            // Show error to user
                            alert('Error saving wallet to database: ' + result.error);
                        }
                    } catch (error) {
                        console.error('❌ Error updating wallet in Firebase:', error);
                        // Show error to user
                        alert('Error saving wallet to database: ' + error.message);
                    }
                } else {
                    console.log('⚠️ No authenticated user, wallet address not saved to Firebase');
                }
                
                updateWalletDisplay();
                getUserBalance(); // Get balance after connecting
            } else {
                console.log('Phantom wallet not found, redirecting to installation...');
                // Redirect to Phantom wallet installation
                window.open('https://phantom.app/', '_blank');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            // Reset wallet state on error
            walletConnected = false;
            walletAddress = '';
            updateWalletDisplay();
            // Show error to user
            alert('Error connecting wallet: ' + error.message);
        }
    }

    // Update wallet display
    function updateWalletDisplay() {
        const walletText = document.getElementById('walletSolanaText');
        const copyWalletIcon = document.getElementById('copyWalletIcon');
        const disconnectBtn = document.getElementById('disconnectWalletBtn');
        
        if (walletConnected && walletAddress) {
            // Show shortened wallet address
            const shortAddress = walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4);
            if (walletText) {
                walletText.textContent = shortAddress;
                walletText.className = 'ml-2.5 text-sm text-blue';
            }
            if (copyWalletIcon) {
                copyWalletIcon.style.display = 'block';
            }
            if (disconnectBtn) {
                disconnectBtn.style.display = 'block';
            }
        } else {
            if (walletText) {
                walletText.textContent = 'Connect Wallet';
                walletText.className = 'ml-2.5 text-sm text-secondary';
            }
            if (copyWalletIcon) {
                copyWalletIcon.style.display = 'none';
            }
            if (disconnectBtn) {
                disconnectBtn.style.display = 'none';
            }
        }
    }

    // Disconnect wallet
    async function disconnectWallet() {
        try {
            console.log('Disconnecting wallet...');
            walletConnected = false;
            walletAddress = '';
            userBalance = 0;
            
            // Clear wallet from Firebase if user is authenticated
            if (currentUser) {
                try {
                    console.log('Clearing wallet address from Firebase for user:', currentUser.uid);
                    const result = await window.firebaseAuth.updateSolanaWallet(currentUser.uid, '');
                    if (result.success) {
                        console.log('✅ Wallet address cleared from Firebase successfully');
                    } else {
                        console.error('❌ Error clearing wallet from Firebase:', result.error);
                        // Show error to user
                        alert('Error clearing wallet from database: ' + result.error);
                    }
                } catch (error) {
                    console.error('❌ Error disconnecting wallet from Firebase:', error);
                    // Show error to user
                    alert('Error clearing wallet from database: ' + error.message);
                }
            } else {
                console.log('⚠️ No authenticated user, wallet address not cleared from Firebase');
            }
            
            updateWalletDisplay();
            updateBalanceDisplay();
            console.log('✅ Wallet disconnected successfully');
        } catch (error) {
            console.error('❌ Error disconnecting wallet:', error);
            // Show error to user
            alert('Error disconnecting wallet: ' + error.message);
        }
    }

    // Copy wallet address
    function copyWalletAddress() {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress).then(() => {
                console.log('Wallet address copied to clipboard');
            }).catch(error => {
                console.error('Error copying wallet address:', error);
            });
        }
    }

    // Handle logout
    async function handleLogout(event) {
        event.preventDefault();
        
        try {
            // Sign out from Firebase
            if (window.firebaseAuth) {
                await window.firebaseAuth.signOut();
            }
            
            // Clear wallet connection
            walletConnected = false;
            walletAddress = '';
            userBalance = 0;
            currentUser = null;
            
            // Redirect to signin page
            window.location.href = 'signin.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if there's an error
            window.location.href = 'signin.html';
        }
    }

    // Initialize wallet system
    function initializeWalletSystem() {
        console.log('Initializing wallet system...');
        
        // Check authentication state
        window.firebaseAuth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                console.log('User authenticated:', user.uid);
                await checkUserAndWallet();
            } else {
                currentUser = null;
                console.log('No user authenticated');
            }
        });
        
        // Add event listeners
        const walletBtn = document.getElementById('walletSolanaBtn');
        const disconnectBtn = document.getElementById('disconnectWalletBtn');
        const copyIcon = document.getElementById('copyWalletIcon');
        
        if (walletBtn) {
            walletBtn.addEventListener('click', connectWallet);
            console.log('Wallet button event listener added');
        } else {
            console.error('Wallet button not found');
        }
        
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', disconnectWallet);
            console.log('Disconnect button event listener added');
        } else {
            console.error('Disconnect button not found');
        }
        
        if (copyIcon) {
            copyIcon.addEventListener('click', copyWalletAddress);
            console.log('Copy icon event listener added');
        } else {
            console.error('Copy icon not found');
        }

        // Update balance periodically if user is authenticated
        setInterval(() => {
            if (currentUser && walletConnected) {
                getUserBalance();
            }
        }, 30000); // Update every 30 seconds
        
        console.log('Wallet system initialization complete');
    }

    // Make functions globally available
    window.walletSystem = {
        connectWallet,
        disconnectWallet,
        getUserBalance,
        updateBalanceDisplay,
        updateWalletDisplay,
        copyWalletAddress,
        handleLogout,
        getState: () => ({
            walletConnected,
            walletAddress,
            userBalance,
            currentUser: currentUser ? currentUser.uid : null
        })
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWalletSystem);
    } else {
        initializeWalletSystem();
    }

    console.log('Wallet system script loaded');
})(); 