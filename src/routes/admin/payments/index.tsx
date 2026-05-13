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
  Search,
  Flag,
  Eye,
  Ban,
  Trash2,
  MessageSquare,
  BookOpen,
  User,
  LayoutDashboard,
  Receipt,
  Send
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

interface ReportedContentItem {
  id: number;
  type: "course" | "review" | "comment";
  title: string;
  content?: string;
  reporter: string;
  reporterId: string;
  reportedUser: string;
  reportedUserId: string;
  reason: string;
  description: string;
  date: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  priority: "high" | "medium" | "low";
}

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
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
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

  // Mock payouts data
  const mockPayouts = [
    { id: 1, mentorName: "Maria Garcia", amount: 1250, status: "pending", date: "2026-05", courseCount: 3 },
    { id: 2, mentorName: "John Santos", amount: 890, status: "completed", date: "2026-04", courseCount: 2 },
    { id: 3, mentorName: "Ana Reyes", amount: 2100, status: "processing", date: "2026-05", courseCount: 4 },
    { id: 4, mentorName: "Roberto Tan", amount: 450, status: "pending", date: "2026-05", courseCount: 1 },
  ];

  // Mock failed payments data
  const failedPayments = MOCK_PAYMENT_HISTORY.filter(p => p.status === 'refunded');

  const getBreadcrumbTitle = () => {
    switch(selectedQuickAction) {
      case 'transactions':
        return 'Transaction History';
      case 'failed-payments':
        return 'Failed Payments';
      case 'payouts':
        return 'Mentor Payouts';
      default:
        return 'Payment Management';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/admin/dashboard" className="hover:text-red-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            {selectedQuickAction ? (
              <>
                <Link to="/admin/payments" className="hover:text-red-600 transition-colors">
                  Payment Management
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{getBreadcrumbTitle()}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">Payment Management</span>
            )}
          </div>
          
          {!selectedQuickAction && (
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-3xl font-bold text-navy">Payment Management</h1>
                <p className="text-muted-foreground mt-1">Track payments, manage payouts, and monitor financial health</p>
              </div>
            </div>
          )}

          {selectedQuickAction && (
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-serif text-3xl font-bold text-navy">{getBreadcrumbTitle()}</h1>
                <p className="text-muted-foreground mt-1">
                  {selectedQuickAction === 'transactions' && 'View all payment transactions and history'}
                  {selectedQuickAction === 'failed-payments' && 'Review and manage failed payment transactions'}
                  {selectedQuickAction === 'payouts' && 'Track and manage mentor earnings and payouts'}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedQuickAction(null)}>
                Back to Overview
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions Bar - Only show when not in a quick action view */}
        {!selectedQuickAction && (
          <div className="mb-6 flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => setSelectedQuickAction('transactions')}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Transaction History
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
              onClick={() => setSelectedQuickAction('payouts')}
            >
              <Send className="h-4 w-4 mr-2" />
              Mentor Payouts
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        )}

        {/* Overview Content - Only show when no quick action is selected */}
        {!selectedQuickAction && (
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
                <h3 className="font-semibold text-navy mb-4">Revenue Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Platform Commission (30%)</span>
                    <span className="font-semibold">{formatCurrency(summary.totalRevenue * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mentor Payouts (70%)</span>
                    <span className="font-semibold">{formatCurrency(summary.totalRevenue * 0.7)}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Platform Revenue</span>
                      <span className="text-xl font-bold text-red-600">{formatCurrency(summary.totalRevenue * 0.3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="font-serif text-xl font-bold text-navy">Recent Transactions</h2>
                <p className="text-sm text-muted-foreground mt-1">Latest 5 transactions</p>
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

        {/* Transaction History View */}
        {selectedQuickAction === 'transactions' && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
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
                <Button variant="outline" onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                  setSelectedMonth('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>

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
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPayments.length} of {payments.length} transactions
              </p>
              <p className="text-sm font-semibold">
                Total: {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
          </div>
        )}

        {/* Mentor Payouts View */}
        {selectedQuickAction === 'payouts' && (
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