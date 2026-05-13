import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, TrendingUp, Calendar, Download, History, Wallet, 
  ArrowUpRight, ArrowDownRight, Shield, AlertCircle, Plus, 
  CheckCircle, Clock, XCircle, ChevronRight,
  Pencil, Trash2, CreditCard, Landmark, Smartphone
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { courses } from "@/data/mockCourses";
import { 
  MOCK_PAYMENT_METHODS, 
  MOCK_WITHDRAWAL_HISTORY, 
  type Withdrawal, 
  type PaymentMethod
} from "@/data/mockEarnings";
import { MOCK_PAYMENT_HISTORY, type PaymentHistory } from "@/data/mockPaymentHistory";
import { Pagination } from "@/components/Pagination";

export const Route = createFileRoute("/mentor/earnings/")({
  head: () => ({
    meta: [
      { title: "Earnings — Sandiwa Mentor" },
      { name: "description", content: "Track your revenue and manage payouts." },
    ],
  }),
  component: EarningsPage,
});

function EarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showEditPaymentMethod, setShowEditPaymentMethod] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>(MOCK_WITHDRAWAL_HISTORY);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [paymentHistory] = useState<PaymentHistory[]>(MOCK_PAYMENT_HISTORY);
  
  // Pagination state for Payment History
  const [paymentHistoryPage, setPaymentHistoryPage] = useState(1);
  const paymentHistoryItemsPerPage = 5;

  // New payment method form
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "gcash" as "gcash" | "paymaya" | "bank_transfer",
    accountName: "",
    accountNumber: "",
    confirmAccountNumber: "",
  });

  // Edit payment method form
  const [editPaymentMethodData, setEditPaymentMethodData] = useState({
    type: "gcash" as "gcash" | "paymaya" | "bank_transfer",
    accountName: "",
    accountNumber: "",
  });

  // Load initial data
  useEffect(() => {
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
    setMentorEmail(email);
    
    const mentorCourses = courses.filter(course => course.mentorEmail === email);
    const total = mentorCourses.reduce((sum, c) => sum + ((c.enrolled || 0) * c.price), 0);
    setTotalEarnings(total);
    
    const defaultMethod = paymentMethods.find(m => m.isDefault);
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod.id);
    }
  }, []);

  // Update available balance whenever totalEarnings or withdrawalHistory changes
  useEffect(() => {
    const totalWithdrawn = withdrawalHistory
      .filter(w => w.status === "completed")
      .reduce((sum, w) => sum + w.amount, 0);
    const pendingAmount = withdrawalHistory
      .filter(w => w.status === "pending" || w.status === "processing")
      .reduce((sum, w) => sum + w.amount, 0);
    const newAvailableBalance = Math.max(0, totalEarnings - totalWithdrawn - pendingAmount);
    setAvailableBalance(newAvailableBalance);
  }, [withdrawalHistory, totalEarnings]);

  const earnings = {
    total: totalEarnings,
    pending: withdrawalHistory
      .filter(w => w.status === "pending" || w.status === "processing")
      .reduce((sum, w) => sum + w.amount, 0),
    available: availableBalance,
    thisMonth: Math.floor(totalEarnings * 0.35),
    lastMonth: Math.floor(totalEarnings * 0.25),
    totalWithdrawn: withdrawalHistory
      .filter(w => w.status === "completed")
      .reduce((sum, w) => sum + w.amount, 0),
  };

  // Filter payment history based on status
  const filteredPayments = paymentHistory.filter(payment => 
    filterStatus === "all" || payment.status === filterStatus
  );

  // Pagination for Payment History
  const paymentStartIndex = (paymentHistoryPage - 1) * paymentHistoryItemsPerPage;
  const paginatedPayments = filteredPayments.slice(paymentStartIndex, paymentStartIndex + paymentHistoryItemsPerPage);

  // Reset payment history page when filter changes
  useEffect(() => {
    setPaymentHistoryPage(1);
  }, [filterStatus]);

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.accountName.trim()) {
      toast.error("Please enter account name");
      return;
    }
    if (!newPaymentMethod.accountNumber.trim()) {
      toast.error("Please enter account number");
      return;
    }
    if (newPaymentMethod.accountNumber !== newPaymentMethod.confirmAccountNumber) {
      toast.error("Account numbers do not match");
      return;
    }

    if (newPaymentMethod.type === "gcash" && !/^09\d{9}$/.test(newPaymentMethod.accountNumber)) {
      toast.error("Invalid GCash number. Must start with 09 and be 11 digits");
      return;
    }

    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: newPaymentMethod.type,
      accountName: newPaymentMethod.accountName,
      accountNumber: newPaymentMethod.accountNumber,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPaymentMethod(false);
    setNewPaymentMethod({
      type: "gcash",
      accountName: "",
      accountNumber: "",
      confirmAccountNumber: "",
    });
    toast.success("Payment method added successfully!");
  };

  const handleEditPaymentMethod = () => {
    if (!editingPaymentMethod) return;
    
    if (!editPaymentMethodData.accountName.trim()) {
      toast.error("Please enter account name");
      return;
    }
    if (!editPaymentMethodData.accountNumber.trim()) {
      toast.error("Please enter account number");
      return;
    }

    if (editPaymentMethodData.type === "gcash" && !/^09\d{9}$/.test(editPaymentMethodData.accountNumber)) {
      toast.error("Invalid GCash number. Must start with 09 and be 11 digits");
      return;
    }

    const updatedMethods = paymentMethods.map(m => 
      m.id === editingPaymentMethod.id 
        ? { 
            ...m, 
            type: editPaymentMethodData.type,
            accountName: editPaymentMethodData.accountName,
            accountNumber: editPaymentMethodData.accountNumber,
          }
        : m
    );
    
    setPaymentMethods(updatedMethods);
    setShowEditPaymentMethod(false);
    setEditingPaymentMethod(null);
    toast.success("Payment method updated successfully!");
  };

  const handleSetDefaultMethod = (methodId: string) => {
    setPaymentMethods(paymentMethods.map(m => ({
      ...m,
      isDefault: m.id === methodId
    })));
    setSelectedPaymentMethod(methodId);
    toast.success("Default payment method updated");
  };

  const handleRemoveMethod = (methodId: string) => {
    if (paymentMethods.length === 1) {
      toast.error("You need at least one payment method");
      return;
    }
    const methodToRemove = paymentMethods.find(m => m.id === methodId);
    setPaymentMethods(paymentMethods.filter(m => m.id !== methodId));
    if (selectedPaymentMethod === methodId) {
      const newDefault = paymentMethods.find(m => m.id !== methodId);
      if (newDefault) setSelectedPaymentMethod(newDefault.id);
    }
    toast.success(`${getMethodName(methodToRemove?.type || "gcash")} payment method removed`);
  };

  const handleWithdraw = () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 500) {
      toast.error("Minimum withdrawal amount is ₱500");
      return;
    }
    
    if (amount > availableBalance) {
      toast.error("Insufficient available balance");
      return;
    }

    if (amount > 50000) {
      toast.error("Maximum withdrawal amount is ₱50,000 per transaction");
      return;
    }

    setIsWithdrawing(true);
    
    // Create new withdrawal
    const newWithdrawal: Withdrawal = {
      id: `wd_${Date.now()}`,
      amount: amount,
      date: new Date().toISOString(),
      status: "pending",
      method: selectedMethod.type,
      accountNumber: selectedMethod.accountNumber.replace(/(\d{4})\d{5}(\d{4})/, '$1*****$2'),
      referenceNumber: `REF-${Date.now()}`,
    };
    
    // Update withdrawal history (add to beginning of array)
    setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
    
    toast.success(`Withdrawal request of ₱${amount.toLocaleString()} submitted to ${getMethodName(selectedMethod.type)}!`);
    setWithdrawAmount("");
    setIsWithdrawing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "refunded": return "bg-orange-100 text-orange-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      case "processing": return <Clock className="h-3 w-3" />;
      case "refunded": return <XCircle className="h-3 w-3" />;
      case "failed": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "gcash": return "GCash";
      case "paymaya": return "PayMaya";
      case "bank_transfer": return "Bank Transfer";
      case "credit_card": return "Credit Card";
      default: return method;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case "gcash":
        return <Smartphone className="h-3 w-3 text-blue-500" />;
      case "paymaya":
        return <Smartphone className="h-3 w-3 text-red-500" />;
      case "bank_transfer":
        return <Landmark className="h-3 w-3 text-purple-500" />;
      case "credit_card":
        return <CreditCard className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "gcash":
        return <span className="text-blue-600 font-semibold text-sm">GCash</span>;
      case "paymaya":
        return <span className="text-red-600 font-semibold text-sm">PayMaya</span>;
      default:
        return <span className="text-purple-600 font-semibold text-sm">Bank</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingPaymentMethod(method);
    setEditPaymentMethodData({
      type: method.type,
      accountName: method.accountName,
      accountNumber: method.accountNumber,
    });
    setShowEditPaymentMethod(true);
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Earnings</h1>
            <p className="text-muted-foreground mt-1">Track your revenue, manage payouts, and withdraw earnings</p>
          </div>
          <Button variant="outline" onClick={() => toast.info("Report is being generated")}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Revenue Overview */}
        <div>
          <h2 className="font-semibold text-navy text-lg mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gold" />
            Revenue Overview
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Total Earnings</span>
              </div>
              <p className="text-2xl font-serif font-bold text-gold">₱{earnings.total.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Lifetime revenue</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">Available Balance</span>
              </div>
              <p className="text-2xl font-serif font-bold text-green-600">₱{earnings.available.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Ready for withdrawal</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">This Month</span>
              </div>
              <p className="text-xl font-serif font-bold text-navy">₱{earnings.thisMonth.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+40% from last month</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <History className="h-4 w-4" />
                <span className="text-sm">Pending Clearance</span>
              </div>
              <p className="text-xl font-serif font-bold text-yellow-600">₱{earnings.pending.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Awaiting settlement</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">Total Withdrawn</span>
              </div>
              <p className="text-xl font-serif font-bold text-blue-600">₱{earnings.totalWithdrawn.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">All-time withdrawals</p>
            </div>
          </div>
        </div>

        {/* Withdrawals & Payment Methods */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Request Withdrawal */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-gold" />
              Request Withdrawal
            </h2>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-border rounded-lg">
                <p className="text-sm text-muted-foreground">No payment methods added yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowAddPaymentMethod(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Select Payment Method</label>
                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <div 
                        key={method.id} 
                        className={`p-4 rounded-lg border transition-all ${
                          selectedPaymentMethod === method.id 
                            ? "border-gold bg-gold/5 ring-1 ring-gold" 
                            : "border-border hover:border-gold/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={() => setSelectedPaymentMethod(method.id)}
                              className="mt-1 text-gold focus:ring-gold"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {getMethodIcon(method.type)}
                                {method.isDefault && (
                                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">Default</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-navy">{method.accountName}</p>
                              <p className="text-xs text-muted-foreground">
                                {getMethodName(method.type)}: {method.accountNumber}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              type="button"
                              onClick={() => openEditModal(method)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-gold hover:bg-gold/10 transition-all"
                              title="Edit payment method"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            
                            {paymentMethods.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMethod(method.id)}
                                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Remove payment method"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            
                            {!method.isDefault && paymentMethods.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultMethod(method.id)}
                                className="px-2 py-1 text-xs font-medium text-gold bg-gold/10 rounded-md hover:bg-gold/20 transition-all whitespace-nowrap"
                              >
                                Set Default
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-dashed"
                      onClick={() => setShowAddPaymentMethod(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Payment Method
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Amount (₱)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Available balance:</span>
                  <span className="font-semibold text-green-600">₱{earnings.available.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground mb-4 pb-2 border-b border-border">
                  <span>Minimum: ₱500</span>
                  <span>Maximum: ₱50,000 per transaction</span>
                </div>

                <Button 
                  onClick={handleWithdraw} 
                  className="w-full bg-gold hover:bg-gold/90 text-white py-2.5"
                  disabled={isWithdrawing || !selectedPaymentMethod}
                >
                  {isWithdrawing ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    "Withdraw Funds"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Funds will be sent within 3-5 business days
                </p>
              </>
            )}
          </div>

          {/* Recent Withdrawals */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-navy flex items-center gap-2">
                <ArrowDownRight className="h-5 w-5 text-gold" />
                Recent Withdrawals
              </h2>
              <Link to="/mentor/earnings/withdrawals">
                <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80">
                  View All ({withdrawalHistory.length})
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {withdrawalHistory.slice(0, 3).map((wd) => (
                <div key={wd.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-bold text-navy">₱{wd.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(wd.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{getMethodName(wd.method)}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getStatusColor(wd.status)}`}>
                      {getStatusIcon(wd.status)}
                      <span className="capitalize">{wd.status}</span>
                    </span>
                  </div>
                </div>
              ))}
              
              {withdrawalHistory.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No withdrawals yet. Make your first withdrawal!</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment History with Pagination */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-serif text-xl font-bold text-navy flex items-center gap-2">
                <History className="h-5 w-5 text-gold" />
                Payment History
              </h2>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="all">All Status ({paymentHistory.length})</option>
                  <option value="completed">Completed ({paymentHistory.filter(p => p.status === "completed").length})</option>
                  <option value="pending">Pending ({paymentHistory.filter(p => p.status === "pending").length})</option>
                  <option value="processing">Processing ({paymentHistory.filter(p => p.status === "processing").length})</option>
                  <option value="refunded">Refunded ({paymentHistory.filter(p => p.status === "refunded").length})</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => toast.info("Payment history exported")}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          {filteredPayments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">{payment.courseTitle.length > 35 ? payment.courseTitle.substring(0, 35) + "..." : payment.courseTitle}</td>
                        <td className="px-6 py-4 text-sm">{payment.studentName}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gold">₱{payment.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="text-xs text-muted-foreground">{getMethodName(payment.paymentMethod || "")}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Component */}
              <div className="px-6 py-4 border-t border-border">
                <Pagination
                  currentPage={paymentHistoryPage}
                  totalItems={filteredPayments.length}
                  itemsPerPage={paymentHistoryItemsPerPage}
                  onPageChange={setPaymentHistoryPage}
                  showEntries={true}
                />
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No payment history found</p>
            </div>
          )}
        </div>

        {/* Add Payment Method Modal */}
        {showAddPaymentMethod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-navy">Add Payment Method</h2>
                  <button 
                    onClick={() => setShowAddPaymentMethod(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Type</label>
                    <select
                      value={newPaymentMethod.type}
                      onChange={(e) => setNewPaymentMethod({ 
                        ...newPaymentMethod, 
                        type: e.target.value as "gcash" | "paymaya" | "bank_transfer" 
                      })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="gcash">GCash</option>
                      <option value="paymaya">PayMaya</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Account Name</label>
                    <input
                      type="text"
                      value={newPaymentMethod.accountName}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, accountName: e.target.value })}
                      placeholder="Full name as registered"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {newPaymentMethod.type === "bank_transfer" ? "Account Number" : "Mobile Number"}
                    </label>
                    <input
                      type="text"
                      value={newPaymentMethod.accountNumber}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, accountNumber: e.target.value })}
                      placeholder={newPaymentMethod.type === "gcash" ? "09XXXXXXXXX" : "Enter account number"}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm {newPaymentMethod.type === "bank_transfer" ? "Account Number" : "Mobile Number"}</label>
                    <input
                      type="text"
                      value={newPaymentMethod.confirmAccountNumber}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, confirmAccountNumber: e.target.value })}
                      placeholder="Re-enter number"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddPaymentMethod(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddPaymentMethod}
                      className="flex-1 bg-gold hover:bg-gold/90"
                    >
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Payment Method Modal */}
        {showEditPaymentMethod && editingPaymentMethod && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-navy">Edit Payment Method</h2>
                  <button 
                    onClick={() => setShowEditPaymentMethod(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Type</label>
                    <select
                      value={editPaymentMethodData.type}
                      onChange={(e) => setEditPaymentMethodData({ 
                        ...editPaymentMethodData, 
                        type: e.target.value as "gcash" | "paymaya" | "bank_transfer" 
                      })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="gcash">GCash</option>
                      <option value="paymaya">PayMaya</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Account Name</label>
                    <input
                      type="text"
                      value={editPaymentMethodData.accountName}
                      onChange={(e) => setEditPaymentMethodData({ ...editPaymentMethodData, accountName: e.target.value })}
                      placeholder="Full name as registered"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {editPaymentMethodData.type === "bank_transfer" ? "Account Number" : "Mobile Number"}
                    </label>
                    <input
                      type="text"
                      value={editPaymentMethodData.accountNumber}
                      onChange={(e) => setEditPaymentMethodData({ ...editPaymentMethodData, accountNumber: e.target.value })}
                      placeholder={editPaymentMethodData.type === "gcash" ? "09XXXXXXXXX" : "Enter account number"}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowEditPaymentMethod(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleEditPaymentMethod}
                      className="flex-1 bg-gold hover:bg-gold/90"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MentorDashboardLayout>
  );
}