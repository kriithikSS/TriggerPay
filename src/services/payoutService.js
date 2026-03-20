// ============= MOCK PAYOUT SERVICE =============

export function processPayoutUPI(claim, workerProfile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `UPI-TRG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        method: 'UPI',
        amount: claim.amount,
        recipientName: workerProfile.name,
        recipientUPI: `${workerProfile.phone?.replace(/\s/g, '').slice(-10)}@ybl`,
        timestamp: new Date().toISOString(),
        estimatedArrival: 'Instant',
      });
    }, 1500);
  });
}

export function processPayoutBank(claim, workerProfile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `NEFT-TRG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        method: 'Bank Transfer (NEFT)',
        amount: claim.amount,
        recipientName: workerProfile.name,
        bankAccount: '****' + Math.floor(1000 + Math.random() * 9000),
        ifsc: 'SBIN0001234',
        timestamp: new Date().toISOString(),
        estimatedArrival: '30 minutes',
      });
    }, 2000);
  });
}

export function generatePayoutReceipt(payout) {
  return {
    receiptId: `RCP-${Date.now()}`,
    ...payout,
    status: 'completed',
    note: 'Parametric insurance payout for income loss due to external disruption.',
    taxDeducted: 0,
    netAmount: payout.amount,
  };
}
