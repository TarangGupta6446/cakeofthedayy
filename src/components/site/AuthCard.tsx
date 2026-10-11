import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Link } from "@tanstack/react-router";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-cream flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-soft p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="mb-4"><Logo /></Link>
          <h1 className="font-display text-2xl text-cocoa text-center">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1 text-center">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </motion.div>
    </div>
  );
}
