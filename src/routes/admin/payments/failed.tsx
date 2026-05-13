// src/routes/admin/payments/failed.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Ban,
  ArrowLeft,
  Send,
  Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { MOCK_PAYMENT_HISTORY, type PaymentHistory } from "@/data/mockPaymentHistory";

export const Route = createFileRoute("/admin/payments/failed")({
  component: FailedPaymentsPage,
});

function FailedPaymentsPage() {
  const [failedPayments, setFailedPayments] = useState<PaymentHistory[]>([]);

  useEffect(() => {
    // In a real app, you'd have a 'failed' status
    // For demo, we'll show 'refunded' as failed payments
    const failed = MOCK_PAYMENT_HISTORY.filter(p => p.status === 'refunded');
    setFailedPayments(failed);
  }, []);

  const handleRetryPayment = (paymentId: string) => {
    console.log(`Retrying payment ${paymentId}`);
    // In real app: call API to retry payment
    alert(`Retrying payment for ${failedPayments.find(p => p.id === paymentId)?.studentName}`);
  };

  const handleRefundPayment = (paymentId: string) => {
    console.log(`Refunding payment ${paymentId}`);
    // In real app: call API to process refund
    alert(`Processing refund for ${failedPayments.find(p => p.id === paymentId)?.studentName}`);
  };

  const handleNotifyStudent = (paymentId: string) => {
    console.log(`Notifying student about payment ${paymentId}`);
    alert(`Notification sent to student`);
  };

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

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/admin/payments">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payment Management
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Failed Payments</h1>
              <p className="text-muted-foreground mt-1">Review and manage failed payment transactions</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">{failedPayments.length} Failed Payments</h3>
              <p className="text-sm text-red-700">
                Total amount at risk: {formatCurrency(failedPayments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Failed Payments Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {failedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm">{formatDate(payment.date)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-xs">{payment.transactionId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium">{payment.studentName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{payment.courseTitle}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4 text-sm capitalize">{payment.paymentMethod || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                        <XCircle className="h-3 w-3" />
                        Failed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleRetryPayment(payment.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500 text-red-600"
                          onClick={() => handleRefundPayment(payment.id)}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Refund
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleNotifyStudent(payment.id)}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Notify
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {failedPayments.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-navy mb-1">No Failed Payments</h3>
              <p className="text-sm text-muted-foreground">All payment transactions are processing normally</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {failedPayments.length > 0 && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Try retrying failed payments within 24 hours</li>
              <li>• Contact students for alternative payment methods</li>
              <li>• Review payment gateway logs for error patterns</li>
              <li>• Consider implementing automatic retry logic</li>
            </ul>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

// Import CheckCircle for empty state
import { CheckCircle } from "lucide-react";