import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Copy, CheckCircle, Clock, XCircle, 
  ChevronDown, ChevronUp, Search, Filter, Calendar,
  Download, Wallet, TrendingUp, DollarSign
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MOCK_WITHDRAWAL_HISTORY, type Withdrawal } from "@/data/mockEarnings";
import { Pagination } from "@/components/Pagination";

export const Route = createFileRoute("/mentor/earnings/withdrawals")({
  head: () => ({
    meta: [
      { title: "Withdrawal History — Sandiwa Mentor" },
      { name: "description", content: "View all your withdrawal requests." },
    ],
  }),
  component: WithdrawalsPage,
});

function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Get withdrawal history
  const withdrawals: Withdrawal[] = MOCK_WITHDRAWAL_HISTORY;

  // Calculate stats
  const totalWithdrawn = withdrawals
    .filter(w => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);
  
  const pendingAmount = withdrawals
    .filter(w => w.status === "pending" || w.status === "processing")
    .reduce((sum, w) => sum + w.amount, 0);
  
  const totalWithdrawals = withdrawals.length;

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = !searchTerm || 
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.accountNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    const matchesMethod = methodFilter === "all" || w.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + itemsPerPage);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMethodFilter("all");
    setCurrentPage(1);
  };

  const copyReferenceNumber = (refNumber: string) => {
    navigator.clipboard.writeText(refNumber);
    toast.success("Reference number copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "processing": return <Clock className="h-4 w-4" />;
      case "failed": return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "gcash": return "GCash";
      case "paymaya": return "PayMaya";
      case "bank_transfer": return "Bank Transfer";
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your withdrawal request has been received and is waiting for processing.";
      case "processing":
        return "Your withdrawal is being processed. Funds will be sent within 3-5 business days.";
      case "completed":
        return "Funds have been successfully sent to your account.";
      case "failed":
        return "Withdrawal failed. Please contact support or try again.";
      default:
        return "";
    }
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/mentor/earnings">
              <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Earnings
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Withdrawal History</h1>
              <p className="text-muted-foreground mt-1">View and track all your withdrawal requests</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => toast.info("Exporting withdrawal history")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Total Withdrawn</span>
            </div>
            <p className="text-2xl font-serif font-bold text-gold">₱{totalWithdrawn.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">All-time withdrawals</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Pending Amount</span>
            </div>
            <p className="text-2xl font-serif font-bold text-yellow-600">₱{pendingAmount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Total Withdrawals</span>
            </div>
            <p className="text-2xl font-serif font-bold text-navy">{totalWithdrawals}</p>
            <p className="text-xs text-muted-foreground mt-1">Successful requests</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Success Rate</span>
            </div>
            <p className="text-2xl font-serif font-bold text-green-600">
              {Math.round((totalWithdrawn / (totalWithdrawn + pendingAmount)) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Completed withdrawals</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by ID, reference #, or account..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold min-w-[130px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Payment Method</label>
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold min-w-[150px]"
              >
                <option value="all">All Methods</option>
                <option value="gcash">GCash</option>
                <option value="paymaya">PayMaya</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {(searchTerm || statusFilter !== "all" || methodFilter !== "all") && (
              <Button variant="ghost" onClick={handleResetFilters} size="sm">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">ID / Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedWithdrawals.map((wd) => (
                  <>
                    <tr key={wd.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-mono">{wd.id}</p>
                          {wd.referenceNumber && (
                            <div className="flex items-center gap-1 mt-1">
                              <p className="text-xs font-mono text-muted-foreground">{wd.referenceNumber}</p>
                              <button onClick={() => copyReferenceNumber(wd.referenceNumber!)}>
                                <Copy className="h-3 w-3 text-muted-foreground hover:text-gold" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatDate(wd.date)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gold">₱{wd.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{getMethodName(wd.method)}</td>
                      <td className="px-6 py-4 text-sm font-mono">{wd.accountNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(wd.status)}`}>
                          {getStatusIcon(wd.status)}
                          <span className="capitalize">{wd.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedId(expandedId === wd.id ? null : wd.id)}
                          className="text-muted-foreground hover:text-gold"
                        >
                          {expandedId === wd.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === wd.id && (
                      <tr className="bg-muted/20">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold text-navy mb-2">Withdrawal Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Withdrawal ID:</span>
                                  <span className="font-mono">{wd.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Reference Number:</span>
                                  <span className="font-mono">{wd.referenceNumber || "Pending"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Request Date:</span>
                                  <span>{formatDate(wd.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Amount:</span>
                                  <span className="font-bold text-gold">₱{wd.amount.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-navy mb-2">Payment Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment Method:</span>
                                  <span>{getMethodName(wd.method)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Account Number:</span>
                                  <span className="font-mono">{wd.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(wd.status)}`}>
                                    {getStatusIcon(wd.status)}
                                    <span className="capitalize">{wd.status}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <div className={`rounded-lg p-3 ${
                                wd.status === "completed" ? "bg-green-50" :
                                wd.status === "pending" || wd.status === "processing" ? "bg-blue-50" :
                                "bg-red-50"
                              }`}>
                                <p className="text-sm">{getStatusMessage(wd.status)}</p>
                                {wd.status === "pending" && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Estimated processing time: 3-5 business days
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWithdrawals.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No withdrawals found matching your filters.</p>
            </div>
          )}

          {/* Pagination */}
          {filteredWithdrawals.length > 0 && (
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredWithdrawals.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEntries={true}
              />
            </div>
          )}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}