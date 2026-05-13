// import { Link } from "@tanstack/react-router";
// import { Translator } from "./Translator"
// import { ShoppingCart, LogOut, User, BookOpen, Settings, Trash2, Briefcase, CheckSquare, Square } from "lucide-react";
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useCart, cart } from "@/lib/cart-store";
// import { useState } from "react";
// import { toast } from "sonner";
// import { NotificationPopover } from "@/components/NotificationPopover";

// export function Nav() {
//   const items = useCart();
//   const totalCount = cart.selectedCount();
//   const totalPrice = cart.selectedTotal();

//   const handleSelectAll = () => {
//     const allSelected = items.length > 0 && items.every(i => i.selected);
//     cart.selectAll(!allSelected);
//     if (!allSelected) {
//       toast.success("All items selected");
//     } else {
//       toast.success("All items deselected");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userInitials");
//     sessionStorage.clear();
//     window.location.href = "/";
//   };

//   const allSelected = items.length > 0 && items.every(i => i.selected);

//   return (
//     <div className="flex items-center gap-1 sm:gap-2">
//       {/* Translation */}
//       <Translator />

//       {/* Notifications - Using the shared component */}
//       <NotificationPopover seeAllLink="/learner/notifications" />

//       {/* Cart */}
//       <Sheet>
//         <SheetTrigger asChild>
//           <button aria-label="Cart" className="relative p-2 text-foreground/70 hover:text-foreground">
//             <ShoppingCart className="h-5 w-5" />
//             {totalCount > 0 && (
//               <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-gold text-[10px] font-bold text-gold-foreground flex items-center justify-center">
//                 {totalCount}
//               </span>
//             )}
//           </button>
//         </SheetTrigger>
//         <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
//           <SheetHeader>
//             <SheetTitle className="font-serif">Your Cart</SheetTitle>
//           </SheetHeader>

//           {items.length === 0 ? (
//             <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
//               <ShoppingCart className="h-10 w-10 text-muted-foreground" />
//               <p className="mt-3 font-medium">Your cart is empty</p>
//               <p className="text-sm text-muted-foreground mt-1">Browse courses to start learning.</p>
//               <Button asChild className="mt-5 bg-gold hover:bg-gold/90 text-white">
//                 <Link to="/learner/courses/courses">Browse courses</Link>
//               </Button>
//             </div>
//           ) : (
//             <>
//               {/* Select All Header */}
//               <div className="flex items-center justify-between pb-3 border-b border-border">
//                 <button
//                   onClick={handleSelectAll}
//                   className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {allSelected ? (
//                     <CheckSquare className="h-4 w-4 text-gold" />
//                   ) : (
//                     <Square className="h-4 w-4" />
//                   )}
//                   <span>{allSelected ? "Deselect all" : "Select all"}</span>
//                 </button>
//               </div>

//               <ul className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
//                 {items.map((i) => (
//                   <li key={i.id} className="py-4 flex gap-3">
//                     {/* Checkbox */}
//                     <div className="flex items-start pt-1">
//                       <Checkbox
//                         checked={i.selected}
//                         onCheckedChange={() => cart.toggleSelect(i.id)}
//                         className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
//                       />
//                     </div>
                    
//                     <img src={i.image} alt={i.title} className="h-16 w-16 rounded-md object-cover" />
                    
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium line-clamp-2">{i.title}</p>
//                       <p className="text-xs text-muted-foreground">by {i.mentor}</p>
//                       <p className="mt-1 text-sm font-semibold text-navy">₱{i.price.toLocaleString()}</p>
//                     </div>
                    
//                     <div className="flex flex-col items-end gap-2">
//                       <button
//                         onClick={() => {
//                           cart.remove(i.id);
//                           toast("Removed from cart");
//                         }}
//                         aria-label="Remove"
//                         className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                       <p className="text-sm font-semibold text-gold">
//                         ₱{i.price.toLocaleString()}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
              
//               <div className="border-t border-border pt-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     Selected ({totalCount} {totalCount === 1 ? 'item' : 'items'})
//                   </span>
//                   <span className="font-serif text-2xl font-bold text-navy">₱{totalPrice.toLocaleString()}</span>
//                 </div>
                
//                 <Button 
//                   className="w-full bg-gold hover:bg-gold/90 text-white" 
//                   size="lg" 
//                   asChild
//                   disabled={totalCount === 0}
//                 >
//                   {totalCount === 0 ? (
//                     <span>Select items to checkout</span>
//                   ) : (
//                     <Link to="/learner/checkout">Checkout ({totalCount})</Link>
//                   )}
//                 </Button>
                
//                 <button
//                   onClick={() => {
//                     cart.clear();
//                     toast("Cart cleared");
//                   }}
//                   className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   Clear cart
//                 </button>
//               </div>
//             </>
//           )}
//         </SheetContent>
//       </Sheet>

//       {/* Profile Dropdown */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <button aria-label="Account" className="ml-1 flex h-9 w-9 rounded-full bg-gradient-to-br from-gold to-forest items-center justify-center text-white text-sm font-semibold">
//             LM
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-56">
//           <DropdownMenuLabel>
//             <div>
//               <p className="text-sm font-semibold">Leah Mae</p>
//               <p className="text-xs text-muted-foreground font-normal">learner@example.com</p>
//             </div>
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
          
//           <DropdownMenuItem asChild>
//             <Link to="/learner/profile" className="cursor-pointer"><User className="h-4 w-4" /> My Profile</Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link to="/learner/settings" className="cursor-pointer"><Settings className="h-4 w-4" /> Settings</Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild>
//             <Link to="/apply-mentor" className="cursor-pointer">
//               <Briefcase className="h-4 w-4" /> Become a Mentor
//             </Link>
//           </DropdownMenuItem>
          
//           <DropdownMenuSeparator />
//           <DropdownMenuItem asChild>
//             <Link 
//               to="/" 
//               onClick={handleLogout} 
//               className="cursor-pointer text-destructive focus:text-destructive"
//             >
//               <LogOut className="h-4 w-4" /> Log out
//             </Link>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }






















import { Link, useLocation } from "@tanstack/react-router";
import { Translator } from "./Translator"
import { ShoppingCart, LogOut, User, Settings, Trash2, Briefcase, CheckSquare, Square } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart, cart } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NotificationPopover } from "@/components/NotificationPopover";

export function Nav() {
  const location = useLocation();
  const items = useCart();
  const totalCount = cart.selectedCount();
  const totalPrice = cart.selectedTotal();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Leah Mae";
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || "learner@gmail.com";
    const initials = localStorage.getItem("userInitials") || sessionStorage.getItem("userInitials") || "LM";
    
    setUserName(name);
    setUserEmail(email);
    setUserInitials(initials);
  }, [location.pathname]);

  const handleSelectAll = () => {
    const allSelected = items.length > 0 && items.every(i => i.selected);
    cart.selectAll(!allSelected);
    if (!allSelected) {
      toast.success("All items selected");
    } else {
      toast.success("All items deselected");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const getRoute = (path: string) => {
    return `/learner${path}`;
  };

  const allSelected = items.length > 0 && items.every(i => i.selected);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Translator />

      <NotificationPopover seeAllLink={getRoute("/notifications")} />

      <Sheet>
        <SheetTrigger asChild>
          <button aria-label="Cart" className="relative p-2 text-foreground/70 hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {totalCount > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-gold text-[10px] font-bold text-gold-foreground flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-serif">Your Cart</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Browse courses to start learning.</p>
              <Button asChild className="mt-5 bg-gold hover:bg-gold/90 text-white">
                <Link to="/learner/courses/courses">Browse courses</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {allSelected ? (
                    <CheckSquare className="h-4 w-4 text-gold" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  <span>{allSelected ? "Deselect all" : "Select all"}</span>
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
                {items.map((i) => (
                  <li key={i.id} className="py-4 flex gap-3">
                    <div className="flex items-start pt-1">
                      <Checkbox
                        checked={i.selected}
                        onCheckedChange={() => cart.toggleSelect(i.id)}
                        className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                      />
                    </div>
                    
                    <img src={i.image} alt={i.title} className="h-16 w-16 rounded-md object-cover" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{i.title}</p>
                      <p className="text-xs text-muted-foreground">by {i.mentor}</p>
                      <p className="mt-1 text-sm font-semibold text-navy">₱{i.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => {
                          cart.remove(i.id);
                          toast("Removed from cart");
                        }}
                        aria-label="Remove"
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <p className="text-sm font-semibold text-gold">
                        ₱{i.price.toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Selected ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-serif text-2xl font-bold text-navy">₱{totalPrice.toLocaleString()}</span>
                </div>
                
                <Button 
                  className="w-full bg-gold hover:bg-gold/90 text-white" 
                  size="lg" 
                  asChild
                  disabled={totalCount === 0}
                >
                  {totalCount === 0 ? (
                    <span>Select items to checkout</span>
                  ) : (
                    <Link to="/learner/checkout">Checkout ({totalCount})</Link>
                  )}
                </Button>
                
                <button
                  onClick={() => {
                    cart.clear();
                    toast("Cart cleared");
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Account" className="ml-1 flex h-9 w-9 rounded-full bg-gradient-to-br from-gold to-forest items-center justify-center text-white text-sm font-semibold">
            {userInitials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground font-normal">{userEmail}</p>
              <p className="text-xs text-gold mt-1">Learner</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to={getRoute("/profile")} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" /> My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={getRoute("/settings")} className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/apply-mentor" className="cursor-pointer">
              <Briefcase className="h-4 w-4 mr-2" /> Become a Mentor
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link 
              to="/" 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" /> Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}