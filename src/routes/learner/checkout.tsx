// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { SiteLayout } from "@/components/SiteLayout";
// import { AuthGuard } from "@/components/AuthGuard";
// import { useCart, cart } from "@/lib/cart-store";
// import { courses } from "@/data/mockCourses";
// import { addNotification } from "@/lib/notification-store";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, CreditCard, Wallet, Banknote, Shield } from "lucide-react";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";

// export const Route = createFileRoute("/learner/checkout")({
//     head: () => ({
//         meta: [
//         { title: "Checkout — Sandiwa" },
//         { name: "description", content: "Complete your purchase and start learning Filipino culture." },
//         ],
//     }),
//     component: CheckoutPage,
// });

// function CheckoutPage() {
//     const cartItems = useCart();
//     const navigate = useNavigate();
    
//     // Check for direct enrollment (single course)
//     const searchParams = new URLSearchParams(window.location.search);
//     const directCourseId = searchParams.get("course");
    
//     const [items, setItems] = useState(cartItems);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [paymentMethod, setPaymentMethod] = useState("card");
//     const [formData, setFormData] = useState({
//         fullName: "",
//         email: "",
//         cardNumber: "",
//         expiry: "",
//         cvv: "",
//         address: "",
//         city: "",
//         zipCode: "",
//     });

//     // Load direct enrollment course if present
//     useEffect(() => {
//         if (directCourseId && cartItems.length === 0) {
//             const course = courses.find(c => c.id === directCourseId);
//             if (course) {
//                 setItems([{
//                     id: course.id,
//                     title: course.title,
//                     mentor: course.mentor,
//                     image: course.image,
//                     price: course.price,
//                     qty: 1,
//                 }]);
//             }
//         } else {
//             setItems(cartItems);
//         }
//     }, [directCourseId, cartItems]);

//     const subtotal = items.reduce((s, i) => s + i.price, 0); 
//     const tax = Math.round(subtotal * 0.12);
//     const total = subtotal + tax;
    
//     // Get user info from localStorage
//     const userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "";
//     const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "";

//     useEffect(() => {
//         if (directCourseId && cartItems.length === 0) {
//             const course = courses.find(c => c.id === directCourseId);
//             if (course) {
//                 setItems([{
//                     id: course.id,
//                     title: course.title,
//                     mentor: course.mentor,
//                     image: course.image,
//                     price: course.price,
//                     qty: 1,
//                 }]);
//             }
//         } else {
//             setItems(cartItems);
//         }
//     }, [directCourseId, cartItems]);

//     if (items.length === 0) {
//         navigate({ to: "/learner/courses/courses" });
//         return null;
//     }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handlePayment = async (e: React.FormEvent) => {
//         e.preventDefault();
    
//         // Validate required fields
//         if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
//             toast.error("Please fill in all required fields");
//             return;
//         }

//         if (paymentMethod === "card" && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
//             toast.error("Please enter your card details");
//             return;
//         }

//         setIsProcessing(true);

//         setTimeout(() => {
//             // Get existing enrolled courses
//             const enrolledCourses: {
//                 id: string;
//                 title: string;
//                 mentor: string;
//                 image: string;
//                 price: number;
//                 enrolledAt: string;
//                 progress: number;
//             }[] = JSON.parse(localStorage.getItem("sandiwa.enrolled") || "[]");
            
//             // Add each item from checkout
//             items.forEach(item => {
//                 // Check if already enrolled
//                 const alreadyEnrolled = enrolledCourses.find(c => c.id === item.id);
//                 if (!alreadyEnrolled) {
//                     enrolledCourses.push({
//                         id: item.id,
//                         title: item.title,
//                         mentor: item.mentor,
//                         image: item.image,
//                         price: item.price,
//                         enrolledAt: new Date().toISOString(),
//                         progress: 0,
//                     });
                    
//                     // Add notification for each enrolled course
//                     addNotification({
//                         title: "Course Enrolled! 🎉",
//                         body: `You have successfully enrolled in "${item.title}". Start learning now!`,
//                         time: "Just now",
//                         icon: "course",
//                     });
//                 }
//             });
          
//             // Save to localStorage
//             localStorage.setItem("sandiwa.enrolled", JSON.stringify(enrolledCourses));
            
//             // Store purchase in localStorage for order history
//             const purchases = JSON.parse(localStorage.getItem("sandiwa.purchases") || "[]");
//             const newPurchase = {
//                 id: Date.now(),
//                 date: new Date().toISOString(),
//                 items: items,
//                 subtotal: subtotal,
//                 tax: tax,
//                 total: total,
//                 paymentMethod: paymentMethod,
//                 status: "completed",
//             };
//             purchases.push(newPurchase);
//             localStorage.setItem("sandiwa.purchases", JSON.stringify(purchases));
          
//             // Clear the cart if coming from cart
//             if (cartItems.length > 0) {
//                 cart.clear();
//             }
            
//             // Add welcome notification for new users
//             const courseCount = enrolledCourses.length;
//             if (courseCount === items.length) {
//                 addNotification({
//                     title: "Welcome to Sandiwa! 🎊",
//                     body: "Your learning journey begins now. Check your enrolled courses to get started.",
//                     time: "Just now",
//                     icon: "mentor",
//                 });
//             }
            
//             toast.success("Payment successful! Your courses are now available.");
//             setIsProcessing(false);
//             navigate({ to: "/learner/payment-success" });
//         }, 2000);
//     };

//     return (
//         <AuthGuard>
//             <SiteLayout>
//                 <div className="bg-cream min-h-screen py-10">
//                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                         <Link to="/learner/courses/courses" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6">
//                             <ArrowLeft className="h-4 w-4" /> Back to courses
//                         </Link>

//                         <div className="grid gap-8 lg:grid-cols-3">
                        
//                             {/* Order Summary */}
//                             <div className="lg:col-span-1">
//                                 <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
//                                     <h2 className="font-serif text-xl font-bold text-navy">Order Summary</h2>
//                                     <div className="mt-4 divide-y divide-border max-h-96 overflow-y-auto">
//                                         {items.map((item) => (
//                                             <div key={item.id} className="py-3 flex gap-3">
//                                                 <img src={item.image} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
//                                                 <div className="flex-1">
//                                                     <p className="text-sm font-medium line-clamp-2">{item.title}</p>
//                                                     <p className="text-xs text-muted-foreground">by {item.mentor}</p>
//                                                     <div className="mt-1 flex items-center justify-between">
//                                                         <span className="text-sm font-semibold text-gold">₱{item.price}</span>
//                                                         <span className="text-xs text-muted-foreground">Qty: {item.qty}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div className="mt-4 space-y-2 border-t border-border pt-4">
//                                         <div className="flex justify-between text-sm">
//                                             <span>Subtotal</span>
//                                             <span>₱{subtotal.toLocaleString()}</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                             <span>Tax (12% VAT)</span>
//                                             <span>₱{tax.toLocaleString()}</span>
//                                         </div>
//                                         <div className="flex justify-between text-lg font-bold text-navy pt-2 border-t border-border">
//                                             <span>Total</span>
//                                             <span className="font-serif text-gold">₱{total.toLocaleString()}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Payment Form */}
//                             <div className="lg:col-span-2">
//                                 <div className="rounded-xl border border-border bg-card p-6">
//                                     <h2 className="font-serif text-xl font-bold text-navy">Payment Details</h2>
                                    
//                                     {/* Payment Methods */}
//                                     <div className="mt-4 grid grid-cols-3 gap-3">
//                                         <button
//                                             type="button"
//                                             onClick={() => setPaymentMethod("card")}
//                                             className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition ${
//                                                 paymentMethod === "card" ? "border-gold bg-gold/10" : "border-border"
//                                             }`}
//                                         >
//                                             <CreditCard className={`h-5 w-5 ${paymentMethod === "card" ? "text-gold" : ""}`} />
//                                             <span className="text-sm">Credit Card</span>
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => setPaymentMethod("gcash")}
//                                             className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition ${
//                                                 paymentMethod === "gcash" ? "border-gold bg-gold/10" : "border-border"
//                                             }`}
//                                         >
//                                             <Wallet className={`h-5 w-5 ${paymentMethod === "gcash" ? "text-gold" : ""}`} />
//                                             <span className="text-sm">GCash</span>
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => setPaymentMethod("bank")}
//                                             className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition ${
//                                                 paymentMethod === "bank" ? "border-gold bg-gold/10" : "border-border"
//                                             }`}
//                                         >
//                                             <Banknote className={`h-5 w-5 ${paymentMethod === "bank" ? "text-gold" : ""}`} />
//                                             <span className="text-sm">Bank Transfer</span>
//                                         </button>
//                                     </div>

//                                     <form onSubmit={handlePayment} className="mt-6 space-y-4">
//                                         <div className="grid gap-4 sm:grid-cols-2">
//                                             <div>
//                                                 <label className="text-sm font-medium">Full Name *</label>
//                                                 <input
//                                                     type="text"
//                                                     name="fullName"
//                                                     required
//                                                     value={formData.fullName}
//                                                     onChange={handleInputChange}
//                                                     className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                     placeholder="Juan Dela Cruz"
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="text-sm font-medium">Email *</label>
//                                                 <input
//                                                     type="email"
//                                                     name="email"
//                                                     required
//                                                     value={formData.email}
//                                                     onChange={handleInputChange}
//                                                     className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                     placeholder="juan@example.com"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {paymentMethod === "card" && (
//                                             <>
//                                                 <div>
//                                                     <label className="text-sm font-medium">Card Number *</label>
//                                                     <input
//                                                         type="text"
//                                                         name="cardNumber"
//                                                         required
//                                                         value={formData.cardNumber}
//                                                         onChange={handleInputChange}
//                                                         placeholder="1234 5678 9012 3456"
//                                                         maxLength={19}
//                                                         className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                     />
//                                                 </div>
//                                                 <div className="grid gap-4 sm:grid-cols-2">
//                                                     <div>
//                                                         <label className="text-sm font-medium">Expiry Date *</label>
//                                                         <input
//                                                             type="text"
//                                                             name="expiry"
//                                                             required
//                                                             value={formData.expiry}
//                                                             onChange={handleInputChange}
//                                                             placeholder="MM/YY"
//                                                             maxLength={5}
//                                                             className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <label className="text-sm font-medium">CVV *</label>
//                                                         <input
//                                                             type="text"
//                                                             name="cvv"
//                                                             required
//                                                             value={formData.cvv}
//                                                             onChange={handleInputChange}
//                                                             placeholder="123"
//                                                             maxLength={4}
//                                                             className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </>
//                                         )}

//                                         {paymentMethod === "gcash" && (
//                                             <div className="rounded-lg bg-gold/5 border border-gold/20 p-4 text-center">
//                                                 <p className="text-sm font-medium text-muted-foreground">Scan QR code or use GCash number:</p>
//                                                 <p className="mt-2 font-mono text-lg font-bold text-gold">0999 123 4567</p>
//                                                 <p className="mt-1 text-xs text-muted-foreground">Reference: SANDIWA-{Date.now()}</p>
//                                                 <p className="mt-2 text-sm text-green-600">After payment, click "Complete Payment" below</p>
//                                             </div>
//                                         )}

//                                         {paymentMethod === "bank" && (
//                                             <div className="rounded-lg bg-gold/5 border border-gold/20 p-4">
//                                                 <p className="text-sm font-medium">Bank Transfer Details:</p>
//                                                 <div className="mt-2 space-y-1 text-sm">
//                                                     <p><span className="text-muted-foreground">Bank:</span> BDO Unibank</p>
//                                                     <p><span className="text-muted-foreground">Account Name:</span> Sandiwa Learning Inc.</p>
//                                                     <p><span className="text-muted-foreground">Account Number:</span> 1234-5678-90</p>
//                                                     <p className="mt-2 text-xs text-muted-foreground">Please use your email as reference</p>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <div>
//                                             <label className="text-sm font-medium">Billing Address *</label>
//                                             <input
//                                                 type="text"
//                                                 name="address"
//                                                 required
//                                                 value={formData.address}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Street Address"
//                                                 className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                             />
//                                         </div>

//                                         <div className="grid gap-4 sm:grid-cols-2">
//                                             <div>
//                                                 <label className="text-sm font-medium">City *</label>
//                                                 <input
//                                                     type="text"
//                                                     name="city"
//                                                     required
//                                                     value={formData.city}
//                                                     onChange={handleInputChange}
//                                                     className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <label className="text-sm font-medium">ZIP Code *</label>
//                                                 <input
//                                                     type="text"
//                                                     name="zipCode"
//                                                     required
//                                                     value={formData.zipCode}
//                                                     onChange={handleInputChange}
//                                                     className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                             <Shield className="h-4 w-4 text-gold" />
//                                             <span>Your payment is secure and encrypted</span>
//                                         </div>

//                                         <Button
//                                             type="submit"
//                                             size="lg"
//                                             className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
//                                             disabled={isProcessing}
//                                         >
//                                             {isProcessing ? (
//                                                 <div className="flex items-center gap-2">
//                                                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                                                     Processing...
//                                                 </div>
//                                             ) : (
//                                                 `Complete Payment - ₱${total.toLocaleString()}`
//                                             )}
//                                         </Button>

//                                         <p className="text-center text-xs text-muted-foreground">
//                                             By completing this purchase, you agree to our Terms of Service and Privacy Policy.
//                                         </p>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </SiteLayout>
//         </AuthGuard>
//     );
// }


















































import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { useCart, cart } from "@/lib/cart-store";
import { courses } from "@/data/mockCourses";
import { addNotification } from "@/lib/notification-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Wallet, Banknote, Shield, Trash2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/learner/checkout")({
    head: () => ({
        meta: [
        { title: "Checkout — Sandiwa" },
        { name: "description", content: "Complete your purchase and start learning Filipino culture." },
        ],
    }),
    component: CheckoutPage,
});

function CheckoutPage() {
    const cartItems = useCart();
    const navigate = useNavigate();
    
    // Get selected items only
    const selectedItems = cartItems.filter(item => item.selected !== false);
    const [items, setItems] = useState(selectedItems);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    
    // Check for direct enrollment (single course)
    const searchParams = new URLSearchParams(window.location.search);
    const directCourseId = searchParams.get("course");
    
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

    // Load items based on what's selected or direct enrollment
    useEffect(() => {
        if (directCourseId) {
            // Direct enrollment from course page
            const course = courses.find(c => c.id === directCourseId);
            if (course) {
                setItems([{
                    id: course.id,
                    title: course.title,
                    mentor: course.mentor,
                    image: course.image,
                    price: course.price,
                    selected: true,
                }]);
            }
        } else {
            // Only show selected items from cart
            const selected = cartItems.filter(item => item.selected !== false);
            setItems(selected);
        }
    }, [directCourseId, cartItems]);

    // If no items selected, redirect back to cart
    useEffect(() => {
        if (!directCourseId && items.length === 0 && cartItems.length > 0) {
            toast.error("Please select at least one course to checkout");
            navigate({ to: "/learner/checkout" });
        } else if (!directCourseId && items.length === 0 && cartItems.length === 0) {
            navigate({ to: "/learner/courses/courses" });
        }
    }, [items, directCourseId, cartItems, navigate]);

    const subtotal = items.reduce((s, i) => s + i.price, 0); 
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRemoveItem = (id: string) => {
        cart.remove(id);
        toast.success("Item removed from cart");
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (paymentMethod === "card" && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
            toast.error("Please enter your card details");
            return;
        }

        setIsProcessing(true);

        setTimeout(() => {
            // Get existing enrolled courses
            const enrolledCourses: {
                id: string;
                title: string;
                mentor: string;
                image: string;
                price: number;
                enrolledAt: string;
                progress: number;
            }[] = JSON.parse(localStorage.getItem("sandiwa.enrolled") || "[]");
            
            // Add each SELECTED item from checkout
            items.forEach(item => {
                // Check if already enrolled
                const alreadyEnrolled = enrolledCourses.find(c => c.id === item.id);
                if (!alreadyEnrolled) {
                    enrolledCourses.push({
                        id: item.id,
                        title: item.title,
                        mentor: item.mentor,
                        image: item.image,
                        price: item.price,
                        enrolledAt: new Date().toISOString(),
                        progress: 0,
                    });
                    
                    // Add notification for each enrolled course
                    addNotification({
                        title: "Course Enrolled! 🎉",
                        body: `You have successfully enrolled in "${item.title}". Start learning now!`,
                        time: "Just now",
                        icon: "course",
                    });
                }
            });
          
            // Save to localStorage
            localStorage.setItem("sandiwa.enrolled", JSON.stringify(enrolledCourses));
            
            // Store purchase in localStorage for order history
            const purchases = JSON.parse(localStorage.getItem("sandiwa.purchases") || "[]");
            const newPurchase = {
                id: Date.now(),
                date: new Date().toISOString(),
                items: items,
                subtotal: subtotal,
                tax: tax,
                total: total,
                paymentMethod: paymentMethod,
                status: "completed",
            };
            purchases.push(newPurchase);
            localStorage.setItem("sandiwa.purchases", JSON.stringify(purchases));
          
            // Remove ONLY the purchased items from cart (not all items)
            items.forEach(item => {
                cart.remove(item.id);
            });
            
            // Add welcome notification for new users
            const courseCount = enrolledCourses.length;
            if (courseCount === items.length) {
                addNotification({
                    title: "Welcome to Sandiwa! 🎊",
                    body: "Your learning journey begins now. Check your enrolled courses to get started.",
                    time: "Just now",
                    icon: "mentor",
                });
            }
            
            toast.success(`Successfully enrolled in ${items.length} course${items.length > 1 ? 's' : ''}!`);
            setIsProcessing(false);
            navigate({ to: "/learner/payment-success" });
        }, 2000);
    };

    if (items.length === 0 && !directCourseId) {
        return null; // Will redirect via useEffect
    }

    return (
        <AuthGuard>
            <SiteLayout>
                <div className="bg-cream min-h-screen py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Link to="/learner/checkout" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-6">
                            <ArrowLeft className="h-4 w-4" /> Back to Cart
                        </Link>

                        <div className="grid gap-8 lg:grid-cols-3">
                        
                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                                    <h2 className="font-serif text-xl font-bold text-navy">Order Summary</h2>
                                    
                                    {items.length === 0 && !directCourseId ? (
                                        <div className="py-8 text-center">
                                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                                            <p className="text-muted-foreground">No items selected</p>
                                            <Link to="/learner/checkout" className="mt-4 inline-block text-gold hover:underline">
                                                Go to cart to select items
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mt-4 divide-y divide-border max-h-96 overflow-y-auto">
                                                {items.map((item) => (
                                                    <div key={item.id} className="py-3 flex gap-3 group">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.title} 
                                                            className="h-16 w-16 rounded-md object-cover" 
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground">by {item.mentor}</p>
                                                            <div className="mt-1 flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-gold">₱{item.price.toLocaleString()}</span>
                                                                {!directCourseId && (
                                                                    <button
                                                                        onClick={() => handleRemoveItem(item.id)}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 space-y-2 border-t border-border pt-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                                                    <span>₱{subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Tax (12% VAT)</span>
                                                    <span>₱{tax.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold text-navy pt-2 border-t border-border">
                                                    <span>Total</span>
                                                    <span className="font-serif text-gold">₱{total.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Payment Form - Only show if items are selected */}
                            {items.length > 0 && (
                                <div className="lg:col-span-2">
                                    <div className="rounded-xl border border-border bg-card p-6">
                                        <h2 className="font-serif text-xl font-bold text-navy">Payment Details</h2>
                                        
                                        {/* Payment Methods */}
                                        <div className="mt-4 grid grid-cols-3 gap-3">
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

                                        <form onSubmit={handlePayment} className="mt-6 space-y-4">
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

                                            {paymentMethod === "card" && (
                                                <>
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
                                                </>
                                            )}

                                            {paymentMethod === "gcash" && (
                                                <div className="rounded-lg bg-gold/5 border border-gold/20 p-4 text-center">
                                                    <p className="text-sm font-medium text-muted-foreground">Scan QR code or use GCash number:</p>
                                                    <p className="mt-2 font-mono text-lg font-bold text-gold">0999 123 4567</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">Reference: SANDIWA-{Date.now()}</p>
                                                    <p className="mt-2 text-sm text-green-600">After payment, click "Complete Payment" below</p>
                                                </div>
                                            )}

                                            {paymentMethod === "bank" && (
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

                                            <div>
                                                <label className="text-sm font-medium">Billing Address *</label>
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

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Shield className="h-4 w-4 text-gold" />
                                                <span>Your payment is secure and encrypted</span>
                                            </div>

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
                                                    `Complete Payment - ₱${total.toLocaleString()}`
                                                )}
                                            </Button>

                                            <p className="text-center text-xs text-muted-foreground">
                                                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </AuthGuard>
    );
}