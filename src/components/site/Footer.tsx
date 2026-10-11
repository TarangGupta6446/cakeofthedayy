import { Link } from "@tanstack/react-router";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">{SITE.description}</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3 text-cocoa">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">All Cakes</Link></li>
            <li><Link to="/custom-order" className="hover:text-primary">Custom Order</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3 text-cocoa">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3 text-cocoa">Get in touch</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{SITE.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{SITE.email}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />India</li>
            <li>
              <a
                href={whatsappLink("Hi! I'd like to order a cake.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-glow font-medium"
              >
                <Instagram className="h-4 w-4" /> WhatsApp us
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name} · Baked with love by {SITE.owner}
      </div>
    </footer>
  );
}
