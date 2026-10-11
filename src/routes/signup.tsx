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

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: `Create account — ${SITE.name}` }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: fullName, phone },
      },
    });
    setLoading(false);
    if (error) return toast.error("Sign up failed", { description: error.message });

    // Auto-confirm is enabled, so signUp returns an active session — go straight in.
    if (data.session) {
      toast.success("Account created!");
      navigate({ to: "/account" });
      return;
    }
    toast.success("Check your email", { description: "We sent a verification link." });
    navigate({ to: "/login" });
  }


  return (
    <AuthCard
      title="Create your account"
      subtitle="Order custom cakes & track every celebration"
      footer={<>Already a member? <Link to="/login" className="text-primary font-medium">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full mt-2">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <GoogleButton label="Sign up with Google" />
    </AuthCard>
  );
}
