export interface PaymentHistory {
  id: string;
  date: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  status: "completed" | "pending" | "refunded" | "processing";
  transactionId?: string;
  paymentMethod?: "gcash" | "paymaya" | "credit_card" | "bank_transfer";
}

// Mock Payment History Data - 15 entries with different statuses
export const MOCK_PAYMENT_HISTORY: PaymentHistory[] = [
  {
    id: "pay_001",
    date: "2024-03-15",
    courseId: "filipino-beginners",
    courseTitle: "Complete Filipino Language for Beginners",
    studentName: "Maria Consuelo Santos",
    amount: 500,
    status: "completed",
    transactionId: "TXN-20240315-001",
    paymentMethod: "gcash",
  },
  {
    id: "pay_002",
    date: "2024-03-14",
    courseId: "philippine-history",
    courseTitle: "Philippine History and Heritage Masterclass",
    studentName: "Jose Miguel Dela Cruz",
    amount: 880,
    status: "pending",
    transactionId: "TXN-20240314-002",
    paymentMethod: "paymaya",
  },
  {
    id: "pay_003",
    date: "2024-03-12",
    courseId: "filipino-intermediate",
    courseTitle: "Intermediate Filipino: Conversations That Matter",
    studentName: "Ana Patricia Reyes",
    amount: 600,
    status: "pending",
    transactionId: "TXN-20240312-003",
    paymentMethod: "bank_transfer",
  },
  {
    id: "pay_004",
    date: "2024-03-10",
    courseId: "traditional-arts",
    courseTitle: "Traditional Filipino Arts and Crafts",
    studentName: "Carlos Alberto Mendoza",
    amount: 300,
    status: "pending",
    transactionId: "TXN-20240310-004",
    paymentMethod: "gcash",
  },
  {
    id: "pay_005",
    date: "2024-03-08",
    courseId: "filipino-beginners",
    courseTitle: "Complete Filipino Language for Beginners",
    studentName: "Maria Isabella Flores",
    amount: 500,
    status: "refunded",
    transactionId: "TXN-20240308-005",
    paymentMethod: "credit_card",
  },
  {
    id: "pay_006",
    date: "2024-03-05",
    courseId: "philippines-heroes",
    courseTitle: "Unsung Heroes of the Philippines",
    studentName: "David Emmanuel Garcia",
    amount: 650,
    status: "completed",
    transactionId: "TXN-20240305-006",
    paymentMethod: "gcash",
  },
  {
    id: "pay_007",
    date: "2024-03-03",
    courseId: "kulintang-basics",
    courseTitle: "Kulintang: Traditional Filipino Music",
    studentName: "Elena Marie Rivera",
    amount: 550,
    status: "processing",
    transactionId: "TXN-20240303-007",
    paymentMethod: "paymaya",
  },
  {
    id: "pay_008",
    date: "2024-02-28",
    courseId: "filipino-cuisine-basics",
    courseTitle: "Authentic Filipino Cuisine: From Adobo to Lechon",
    studentName: "Miguel Angelo Santos",
    amount: 600,
    status: "completed",
    transactionId: "TXN-20240228-008",
    paymentMethod: "bank_transfer",
  },
  {
    id: "pay_009",
    date: "2024-02-25",
    courseId: "philippine-history",
    courseTitle: "Philippine History and Heritage Masterclass",
    studentName: "Maria Patricia Cruz",
    amount: 880,
    status: "pending",
    transactionId: "TXN-20240225-009",
    paymentMethod: "gcash",
  },
  {
    id: "pay_010",
    date: "2024-02-20",
    courseId: "filipino-folk-dance",
    courseTitle: "Filipino Folk Dance: Tinikling & More",
    studentName: "Ramon Gregorio Lopez",
    amount: 450,
    status: "completed",
    transactionId: "TXN-20240220-010",
    paymentMethod: "credit_card",
  },
  {
    id: "pay_011",
    date: "2024-02-18",
    courseId: "weaving-masterclass",
    courseTitle: "Masterclass: Philippine Textile Weaving",
    studentName: "Sofia Nicole Mendoza",
    amount: 550,
    status: "refunded",
    transactionId: "TXN-20240218-011",
    paymentMethod: "paymaya",
  },
  {
    id: "pay_012",
    date: "2024-02-15",
    courseId: "filipino-beginners",
    courseTitle: "Complete Filipino Language for Beginners",
    studentName: "Thomas Christian Lee",
    amount: 500,
    status: "completed",
    transactionId: "TXN-20240215-012",
    paymentMethod: "gcash",
  },
  {
    id: "pay_013",
    date: "2024-02-10",
    courseId: "regional-filipino-cuisine",
    courseTitle: "Regional Filipino Cuisine: Luzon to Mindanao",
    studentName: "Maria Theresa Villanueva",
    amount: 680,
    status: "processing",
    transactionId: "TXN-20240210-013",
    paymentMethod: "bank_transfer",
  },
  {
    id: "pay_014",
    date: "2024-02-05",
    courseId: "philippine-history",
    courseTitle: "Philippine History and Heritage Masterclass",
    studentName: "Francisco Jose Ramirez",
    amount: 880,
    status: "completed",
    transactionId: "TXN-20240205-014",
    paymentMethod: "gcash",
  },
  {
    id: "pay_015",
    date: "2024-02-01",
    courseId: "filipino-business",
    courseTitle: "Business Filipino for Professionals",
    studentName: "Maria Elena Gonzales",
    amount: 750,
    status: "completed",
    transactionId: "TXN-20240201-015",
    paymentMethod: "paymaya",
  },
];

// Helper function to get payment history by mentor email
export const getPaymentHistoryByMentor = (mentorEmail: string): PaymentHistory[] => {
  // In a real app, this would filter by the mentor's courses
  // For demo, return all mock data
  return MOCK_PAYMENT_HISTORY;
};

// Helper function to get payment by ID
export const getPaymentById = (id: string): PaymentHistory | undefined => {
  return MOCK_PAYMENT_HISTORY.find(payment => payment.id === id);
};

// Helper function to get payments by status
export const getPaymentsByStatus = (status: PaymentHistory["status"]): PaymentHistory[] => {
  return MOCK_PAYMENT_HISTORY.filter(payment => payment.status === status);
};

// Summary statistics
export const getPaymentSummary = () => {
  const totalRevenue = MOCK_PAYMENT_HISTORY
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingRevenue = MOCK_PAYMENT_HISTORY
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const processingRevenue = MOCK_PAYMENT_HISTORY
    .filter(p => p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const refundedRevenue = MOCK_PAYMENT_HISTORY
    .filter(p => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalTransactions = MOCK_PAYMENT_HISTORY.length;
  const completedTransactions = MOCK_PAYMENT_HISTORY.filter(p => p.status === "completed").length;
  
  return {
    totalRevenue,
    pendingRevenue,
    processingRevenue,
    refundedRevenue,
    totalTransactions,
    completedTransactions,
    successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0,
  };
};





































