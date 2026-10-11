import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/site/AuthCard";
import { GoogleButton } from "@/components/site/GoogleButton";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: `Sign in — ${SITE.name}` }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error("Sign in failed", { description: error.message });
    toast.success("Welcome back!");
    navigate({ to: "/account" });
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to track orders and reorder favorites"
      footer={<>Don't have an account? <Link to="/signup" className="text-primary font-medium">Sign up</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <GoogleButton />
    </AuthCard>
  );
}
