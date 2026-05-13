import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { 
  CheckCircle, 
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  MOCK_PAYMENT_HISTORY, 
  type PaymentHistory 
} from "@/data/mockPaymentHistory";

export const Route = createFileRoute("/admin/payments/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setPayments(MOCK_PAYMENT_HISTORY);
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
      case 'gcash': return 'Gcash';
      case 'paymaya': return 'Paymaya';
      case 'credit_card': return 'Credit_card';
      case 'bank_transfer': return 'Bank_transfer';
      default: return 'Cash';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' ? true : payment.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filtering
    let matchesDateRange = true;
    if (startDate || endDate) {
      const paymentDate = new Date(payment.date);
      paymentDate.setHours(0, 0, 0, 0);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (paymentDate < start) matchesDateRange = false;
      }
      
      if (endDate && matchesDateRange) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (paymentDate > end) matchesDateRange = false;
      }
    }
    
    return matchesStatus && matchesSearch && matchesDateRange;
  });

  // Pagination logic
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm, startDate, endDate]);

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

  const clearAllFilters = () => {
    setFilterStatus('all');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
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
            <Link to="/admin/payments" className="hover:text-red-600 transition-colors">
              Payment Management
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Transactions</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Transaction History</h1>
              <p className="text-muted-foreground mt-1">View and manage all payment transactions</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Search</label>
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
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
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
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="pl-9 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <Button variant="outline" onClick={clearAllFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            {/* Active date range display */}
            {(startDate || endDate) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Active Date Range:</span>
                {startDate && <span>From: {new Date(startDate).toLocaleDateString()}</span>}
                {startDate && endDate && <span>to</span>}
                {endDate && <span>To: {new Date(endDate).toLocaleDateString()}</span>}
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-red-500 hover:text-red-600 text-xs underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
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
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm">{formatDate(payment.date)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-xs">{payment.transactionId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium">{payment.studentName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{payment.courseTitle}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{getPaymentMethodIcon(payment.paymentMethod)}</span>
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

          {/* Empty state */}
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found for the selected criteria.</p>
            </div>
          )}

          {/* Summary and Pagination */}
          {filteredPayments.length > 0 && (
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredPayments.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}