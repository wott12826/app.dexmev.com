// solana-demo-stats.js
window.solanaDemoStats = window.solanaDemoStats || {
  currentSlot: 348639437,
  currentSupply: 531.2,
  currentEpoch: 807,
  epochProgress: 4,
  updateDemoData: function() {
    this.currentSlot += Math.floor(Math.random() * 10);
    this.currentSupply += Math.random() * 0.01;
    this.epochProgress += Math.random() * 0.2;
    if (this.epochProgress >= 100) {
      this.epochProgress = 0;
      this.currentEpoch += 1;
    }
  }
}; 