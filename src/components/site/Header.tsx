import { Link } from "@tanstack/react-router";
import { ClipboardList, Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom-order", label: "Custom Cake" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();


  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-full text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary transition-colors"
              activeProps={{ className: "text-primary bg-secondary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" aria-label="Orders dashboard" className="hidden sm:block">
              <Button variant="outline" size="sm" className="rounded-full">
                <ClipboardList className="h-4 w-4 mr-1.5" /> Orders
              </Button>
            </Link>
          )}
          <Link to={user ? "/account" : "/login"} aria-label="Account">

            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-semibold shadow-soft">
                {count}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/60 bg-background"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
                  activeProps={{ className: "text-primary bg-secondary" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
                  activeProps={{ className: "text-primary bg-secondary" }}
                >
                  Orders Dashboard
                </Link>
              )}
            </div>

          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
