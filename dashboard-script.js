document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Assuming signOut is a global function defined in firebase-config.js
            if (typeof window.signOut === 'function') {
                window.signOut();
            } else {
                console.error('signOut function not found.');
            }
        });
    }
});

(async () => {
    const RPC_URL = 'https://api.mainnet-beta.solana.com';

    const slotHeightEl = document.getElementById('slot-height');
    const supplyEl = document.getElementById('supply');
    const epochCurrentEl = document.getElementById('epoch-current');
    const epochNextEl = document.getElementById('epoch-next');
    const etaEl = document.getElementById('eta');
    const epochProgressBarEl = document.getElementById('epoch-progress-bar');
    const epochPercentageTextEl = document.getElementById('epoch-percentage-text');

    // Make sure all elements exist before proceeding
    if (!slotHeightEl || !supplyEl || !epochCurrentEl || !epochNextEl || !etaEl || !epochProgressBarEl || !epochPercentageTextEl) {
        console.error('One or more network stat elements are missing from the DOM.');
        return;
    }

    async function fetchRpc(body) {
        const response = await fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(`RPC Error: ${data.error.message}`);
        }
        return data.result;
    }

    async function updateNetworkStats() {
        try {
            const [epochInfo, slot, supply] = await Promise.all([
                fetchRpc({ jsonrpc: '2.0', id: 1, method: 'getEpochInfo' }),
                fetchRpc({ jsonrpc: '2.0', id: 1, method: 'getSlot' }),
                fetchRpc({ jsonrpc: '2.0', id: 1, method: 'getSupply' }),
            ]);

            // Slot Height
            if (slot) slotHeightEl.innerText = slot.toLocaleString('en-US');

            // Supply
            if (supply && supply.value && supply.value.circulating) {
                const circulatingSupply = supply.value.circulating / 1_000_000_000;
                supplyEl.innerText = `${(circulatingSupply / 1_000_000).toFixed(1)}M`;
            }

            // Epoch
            if (epochInfo) {
                const { epoch, slotIndex, slotsInEpoch } = epochInfo;
                const progressPercent = (slotIndex / slotsInEpoch) * 100;
                
                epochCurrentEl.innerText = epoch;
                epochNextEl.innerText = epoch + 1;
                epochProgressBarEl.style.width = `${progressPercent}%`;
                epochPercentageTextEl.style.left = `calc(${progressPercent}% - ${progressPercent > 5 ? '18' : '0'}px)`;
                epochPercentageTextEl.innerText = `${progressPercent.toFixed(0)}%`;

                // ETA
                const remainingSlots = slotsInEpoch - slotIndex;
                const averageSlotTime = 0.45; // seconds
                const etaSeconds = remainingSlots * averageSlotTime;
                
                const days = Math.floor(etaSeconds / (3600 * 24));
                const hours = Math.floor((etaSeconds % (3600 * 24)) / 3600);
                etaEl.innerText = `${days}d ${hours}h`;
            }

        } catch (error) {
            console.error('Failed to fetch network stats:', error);
            slotHeightEl.innerText = 'Error';
            supplyEl.innerText = 'Error';
            epochCurrentEl.innerText = 'Error';
        }
    }

    updateNetworkStats();
    setInterval(updateNetworkStats, 30000); // Update every 30 seconds
})(); 