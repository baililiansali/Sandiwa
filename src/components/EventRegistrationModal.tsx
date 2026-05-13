import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Video, CreditCard, Wallet, Banknote, Shield, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Event, formatEventDate } from "@/data/mockEvents";

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EventRegistrationModal({ event, isOpen, onClose, onSuccess }: EventRegistrationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // Get user info from localStorage
  const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

  // Auto-fill user info on mount
  useEffect(() => {
    if (userName) {
      setFormData(prev => ({ ...prev, fullName: userName, email: userEmail }));
    }
  }, [userName, userEmail]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields (matching checkout page)
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    // For paid events, validate payment details
    if (event.price !== 0) {
      if (paymentMethod === "card" && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
        toast.error("Please enter your card details");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing (matching checkout page)
    setTimeout(() => {
      // Get existing registered events
      const registeredEvents: {
        id: string;
        title: string;
        date: string;
        location: string;
        price: number;
        registeredAt: string;
        status: string;
      }[] = JSON.parse(localStorage.getItem("sandiwa.registeredEvents") || "[]");

      // Check if already registered
      const alreadyRegistered = registeredEvents.find(e => e.id === event.id);
      if (alreadyRegistered) {
        toast.error("You have already registered for this event!");
        setIsProcessing(false);
        onClose();
        return;
      }

      // Add new registration
      registeredEvents.push({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        location: event.location,
        price: event.price || 0,
        registeredAt: new Date().toISOString(),
        status: "confirmed",
      });

      localStorage.setItem("sandiwa.registeredEvents", JSON.stringify(registeredEvents));

      // Store payment transaction for paid events (matching checkout)
      if (event.price !== 0) {
        const transactions = JSON.parse(localStorage.getItem("sandiwa.eventPayments") || "[]");
        transactions.push({
          id: Date.now(),
          eventId: event.id,
          eventTitle: event.title,
          amount: event.price,
          paymentMethod: paymentMethod,
          date: new Date().toISOString(),
          attendee: {
            name: formData.fullName,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          },
        });
        localStorage.setItem("sandiwa.eventPayments", JSON.stringify(transactions));
      }

      toast.success(`Successfully registered for ${event.title}!`);
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  const isFreeEvent = event.price === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy">
              {isFreeEvent ? "Register for Event" : "Complete Registration"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isFreeEvent 
                ? "Confirm your spot at this free event" 
                : "Complete your registration to secure your spot"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Event Summary */}
        <div className="border-b border-border bg-cream/30 p-6">
          <div className="flex gap-4">
            {event.image && (
              <img 
                src={event.image} 
                alt={event.title}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-navy">{event.title}</h3>
              <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {event.isVirtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.registered} / {event.capacity} spots filled</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {isFreeEvent ? (
                <div className="rounded-full bg-green-100 px-3 py-1 text-center">
                  <p className="text-sm font-bold text-green-700">FREE EVENT</p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gold">₱{event.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* Registration Form - Matching checkout page layout */}
        <form onSubmit={handleRegistration} className="p-6 space-y-6">
          {/* Payment Methods - Only for paid events */}
          {!isFreeEvent && (
            <div>
              <h3 className="font-semibold text-navy mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition ${
                    paymentMethod === "card" ? "border-gold bg-gold/10" : "border-border"
                  }`}
                >
                  <CreditCard className={`h-5 w-5 ${paymentMethod === "card" ? "text-gold" : ""}`} />
                  <span className="text-sm">Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gcash")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition ${
                    paymentMethod === "gcash" ? "border-gold bg-gold/10" : "border-border"
                  }`}
                >
                  <Wallet className={`h-5 w-5 ${paymentMethod === "gcash" ? "text-gold" : ""}`} />
                  <span className="text-sm">GCash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition ${
                    paymentMethod === "bank" ? "border-gold bg-gold/10" : "border-border"
                  }`}
                >
                  <Banknote className={`h-5 w-5 ${paymentMethod === "bank" ? "text-gold" : ""}`} />
                  <span className="text-sm">Bank Transfer</span>
                </button>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-navy mb-4">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="juan@example.com"
                />
              </div>
            </div>
          </div>

          {/* Card Details - Only for credit card payment */}
          {!isFreeEvent && paymentMethod === "card" && (
            <div>
              <h3 className="font-semibold text-navy mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GCash Instructions */}
          {!isFreeEvent && paymentMethod === "gcash" && (
            <div className="rounded-lg bg-gold/5 border border-gold/20 p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">Scan QR code or use GCash number:</p>
              <p className="mt-2 font-mono text-lg font-bold text-gold">0999 123 4567</p>
              <p className="mt-1 text-xs text-muted-foreground">Reference: EVENT-{event.id.toUpperCase()}-{Date.now()}</p>
              <p className="mt-2 text-sm text-green-600">After payment, click "Complete Registration" below</p>
            </div>
          )}

          {/* Bank Transfer Instructions */}
          {!isFreeEvent && paymentMethod === "bank" && (
            <div className="rounded-lg bg-gold/5 border border-gold/20 p-4">
              <p className="text-sm font-medium">Bank Transfer Details:</p>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Bank:</span> BDO Unibank</p>
                <p><span className="text-muted-foreground">Account Name:</span> Sandiwa Learning Inc.</p>
                <p><span className="text-muted-foreground">Account Number:</span> 1234-5678-90</p>
                <p className="mt-2 text-xs text-muted-foreground">Please use your email as reference</p>
              </div>
            </div>
          )}

          {/* Billing Address - Same as checkout */}
          <div>
            <h3 className="font-semibold text-navy mb-4">Billing Address</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Free Event Notice */}
          {isFreeEvent && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">This is a free event!</p>
                  <p className="text-sm text-green-700">
                    No payment required. Just confirm your registration to reserve your spot.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-gold" />
            <span>Your payment is secure and encrypted</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              isFreeEvent ? "Complete Registration" : `Complete Payment - ₱${event.price}`
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}