import { Link } from "@tanstack/react-router";
import { Bell, ShoppingCart, Menu, LogOut, User, BookOpen, Settings, Trash2, BookMarked, MessageCircle, CalendarDays, GraduationCap } from "lucide-react";
import { Logo } from "./Logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useCart, cart } from "@/lib/cart-store";
import { notifications as initialNotifications, type Notification } from "@/data/notifications";
import { useState } from "react";
import { toast } from "sonner";

const navLinks = [
  { to: "/courses" as const, label: "Courses" },
  { to: "/mentors" as const, label: "Mentors" },
  { to: "/community" as const, label: "Community" },
];

const notifIcon = {
  course: BookMarked,
  mentor: GraduationCap,
  community: MessageCircle,
  event: CalendarDays,
};

export function Header() {
  const items = useCart();
  const totalCount = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);

  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifs.filter((n) => n.unread).length;
  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, unread: false })));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 -ml-2" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-8 flex flex-col gap-4">
                <Logo />
                <nav className="mt-4 flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-base hover:bg-accent">
                      {l.label}
                    </Link>
                  ))}
                  <Link to="/login" className="rounded-md px-3 py-2 text-base hover:bg-accent">Log in</Link>
                  <Link to="/register" className="rounded-md px-3 py-2 text-base hover:bg-accent">Sign up</Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
                activeProps={{ className: "text-gold font-semibold" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button aria-label="Notifications" className="relative p-2 text-foreground/70 hover:text-foreground">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-gold text-[10px] font-bold text-gold-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="font-semibold text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-gold hover:underline">Mark all read</button>
                )}
              </div>
              <ul className="max-h-96 overflow-y-auto divide-y divide-border">
                {notifs.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</li>
                )}
                {notifs.map((n) => {
                  const Icon = notifIcon[n.icon];
                  return (
                    <li key={n.id} className={`flex gap-3 px-4 py-3 ${n.unread ? "bg-gold/5" : ""}`}>
                      <div className="h-8 w-8 shrink-0 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0" />}
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>

          {/* Cart */}
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
                  <Button asChild className="mt-5 bg-gold hover:bg-gold/90 text-gold-foreground">
                    <Link to="/courses">Browse courses</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
                    {items.map((i) => (
                      <li key={i.id} className="py-4 flex gap-3">
                        <img src={i.image} alt={i.title} className="h-16 w-16 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{i.title}</p>
                          <p className="text-xs text-muted-foreground">by {i.mentor}</p>
                          <p className="mt-1 text-sm font-semibold text-navy">₱{i.price}</p>
                        </div>
                        <button
                          onClick={() => {
                            cart.remove(i.id);
                            toast("Removed from cart");
                          }}
                          aria-label="Remove"
                          className="self-start p-1.5 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-serif text-2xl font-bold text-navy">₱{totalPrice}</span>
                    </div>
                    <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground" size="lg" onClick={() => toast.success("Checkout coming soon!")}>
                      Checkout
                    </Button>
                    <button
                      onClick={() => {
                        cart.clear();
                        toast("Cart cleared");
                      }}
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear cart
                    </button>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Account" className="ml-1 hidden sm:flex h-9 w-9 rounded-full bg-gradient-to-br from-gold to-forest items-center justify-center text-white text-sm font-semibold">
                JR
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-semibold">Juan Reyes</p>
                  <p className="text-xs text-muted-foreground font-normal">juan@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer"><User className="h-4 w-4" /> My profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/courses" className="cursor-pointer"><BookOpen className="h-4 w-4" /> My courses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer"><Settings className="h-4 w-4" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" onClick={() => toast("Signed out")} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/login" className="hidden md:inline-flex text-sm font-medium text-foreground/80 hover:text-gold ml-2">
            Log in
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
