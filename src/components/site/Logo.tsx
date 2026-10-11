import logo from "@/assets/logo.jpeg";
import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label={SITE.name}>
      <img
        src={logo}
        alt={`${SITE.name} logo`}
        className={`${className} rounded-full object-cover shadow-soft transition-transform group-hover:scale-105`}
        loading="eager"
      />
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="font-display text-lg text-cocoa font-bold">{SITE.name}</span>
        <span className="text-[11px] text-muted-foreground tracking-wide">100% Eggless · Daily Fresh</span>
      </div>
    </Link>
  );
}
