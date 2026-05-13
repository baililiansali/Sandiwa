// src/routes/admin/payments/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  Banknote,
  ArrowUpRight,
  Calendar,
  Users,
  CreditCard,
  Download,
  Filter,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  MOCK_PAYMENT_HISTORY, 
  getPaymentSummary,
  type PaymentHistory 
} from "@/data/mockPaymentHistory";

export const Route = createFileRoute("/admin/payments/")({
  component: PaymentManagement,
});

function PaymentManagement() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    pendingRevenue: 0,
    processingRevenue: 0,
    refundedRevenue: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    successRate: 0,
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    // Load mock data
    setPayments(MOCK_PAYMENT_HISTORY);
    setSummary(getPaymentSummary());
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'refunded': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch(method) {
      case 'gcash': return '📱';
      case 'paymaya': return '💳';
      case 'credit_card': return '💳';
      case 'bank_transfer': return '🏦';
      default: return '💰';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' ? true : payment.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === 'all' || 
      new Date(payment.date).getMonth() === parseInt(selectedMonth);
    return matchesStatus && matchesSearch && matchesMonth;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Mock payouts data (you can expand this later)
  const mockPayouts = [
    { id: 1, mentorName: "Maria Garcia", amount: 1250, status: "pending", date: "2026-05", courseCount: 3 },
    { id: 2, mentorName: "John Santos", amount: 890, status: "completed", date: "2026-04", courseCount: 2 },
    { id: 3, mentorName: "Ana Reyes", amount: 2100, status: "processing", date: "2026-05", courseCount: 4 },
    { id: 4, mentorName: "Roberto Tan", amount: 450, status: "pending", date: "2026-05", courseCount: 1 },
  ];

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy">Payment Management</h1>
            <p className="text-muted-foreground mt-1">Track payments, manage payouts, and monitor financial health</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/payments/failed">
              <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                <AlertCircle className="h-4 w-4 mr-2" />
                View Failed Payments
              </Button>
            </Link>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                selectedTab === 'overview' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                selectedTab === 'transactions' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setSelectedTab('payouts')}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                selectedTab === 'payouts' 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Payouts to Mentors
            </button>
          </nav>
        </div>

        {selectedTab === 'overview' && (
          <>
            {/* Financial Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600">+12%</span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-serif font-bold">{formatCurrency(summary.totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-serif font-bold">{formatCurrency(summary.pendingRevenue + summary.processingRevenue)}</p>
                  <p className="text-xs text-muted-foreground">Pending & Processing</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-serif font-bold">{summary.successRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-serif font-bold">{summary.totalTransactions}</p>
                  <p className="text-xs text-muted-foreground">Total Transactions</p>
                </div>
              </div>
            </div>

            {/* Payment Status Distribution */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-navy mb-4">Payment Status Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completed</span>
                      <span className="font-medium">{formatCurrency(summary.totalRevenue)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(summary.totalRevenue / (summary.totalRevenue + summary.pendingRevenue + summary.processingRevenue + summary.refundedRevenue)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pending & Processing</span>
                      <span className="font-medium">{formatCurrency(summary.pendingRevenue + summary.processingRevenue)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${((summary.pendingRevenue + summary.processingRevenue) / (summary.totalRevenue + summary.pendingRevenue + summary.processingRevenue + summary.refundedRevenue)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Refunded</span>
                      <span className="font-medium">{formatCurrency(summary.refundedRevenue)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500 rounded-full" style={{ width: `${(summary.refundedRevenue / (summary.totalRevenue + summary.pendingRevenue + summary.processingRevenue + summary.refundedRevenue)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-navy mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/admin/payments/failed">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Review Failed Payments
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-500" />
                      Process Pending Payouts
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-500" />
                      Generate Financial Report
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-navy">Recent Transactions</h2>
                <Button variant="ghost" onClick={() => setSelectedTab('transactions')}>
                  View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm">{formatDate(payment.date)}</td>
                        <td className="px-6 py-4 text-sm font-medium">{payment.studentName}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{payment.courseTitle.substring(0, 40)}...</td>
                        <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'transactions' && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Filters */}
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by student or course..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Months</option>
                  <option value="2">February 2024</option>
                  <option value="3">March 2024</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm">{formatDate(payment.date)}</td>
                      <td className="px-6 py-4 text-sm font-mono text-xs">{payment.transactionId || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-medium">{payment.studentName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{payment.courseTitle}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payment.amount)}</td>
                      <td className="px-6 py-4">
                        <span className="text-lg">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="capitalize">{payment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="ghost">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPayments.length} of {payments.length} transactions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'payouts' && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-serif text-xl font-bold text-navy">Mentor Payouts</h2>
              <p className="text-sm text-muted-foreground mt-1">Track and manage mentor earnings</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Mentor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Courses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPayouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{payout.mentorName}</td>
                      <td className="px-6 py-4 text-sm">{payout.courseCount} courses</td>
                      <td className="px-6 py-4 text-sm">{payout.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payout.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payout.status)}`}>
                          <span className="capitalize">{payout.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {payout.status === 'pending' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Process Payout
                            </Button>
                          )}
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}