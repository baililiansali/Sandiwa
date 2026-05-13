export interface Withdrawal {
  id: string;
  amount: number;
  date: string;
  status: "pending" | "processing" | "completed" | "failed";
  method: string;
  accountNumber: string;
  referenceNumber?: string;
}

export interface PaymentMethod {
  id: string;
  type: "gcash" | "paymaya" | "bank_transfer";
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  // isVerified removed - no longer needed
}

export interface PaymentHistory {
  id: string;
  date: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
}

// Mock Payment Methods - all are immediately available (no verification needed)
export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm1",
    type: "gcash",
    accountName: "Maria Consuelo Santos",
    accountNumber: "09123456789",
    isDefault: true,
  },
];

// Mock Withdrawal History
export let MOCK_WITHDRAWAL_HISTORY: Withdrawal[] = [
  {
    id: "wd_1",
    amount: 2500,
    date: "2024-02-15T10:30:00Z",
    status: "completed",
    method: "gcash",
    accountNumber: "0912****89",
    referenceNumber: "REF-20240215-001",
  },
  {
    id: "wd_2",
    amount: 1800,
    date: "2024-01-28T14:20:00Z",
    status: "completed",
    method: "bank_transfer",
    accountNumber: "****1234",
    referenceNumber: "REF-20240128-002",
  },
  {
    id: "wd_3",
    amount: 3200,
    date: "2024-03-10T09:15:00Z",
    status: "processing",
    method: "gcash",
    accountNumber: "0912****89",
    referenceNumber: "REF-20240310-003",
  },
];

// Helper function to add a new withdrawal
export const addWithdrawal = (withdrawal: Omit<Withdrawal, "id" | "date">) => {
  const newWithdrawal: Withdrawal = {
    ...withdrawal,
    id: `wd_${Date.now()}`,
    date: new Date().toISOString(),
  };
  MOCK_WITHDRAWAL_HISTORY = [newWithdrawal, ...MOCK_WITHDRAWAL_HISTORY];
  return newWithdrawal;
};