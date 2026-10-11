import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/site/AuthCard";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: `Set new password — ${SITE.name}` }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  // "checking" while we exchange the link's token for a session
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");

  useEffect(() => {
    let cancelled = false;

    async function establishSession() {
      const url = new URL(window.location.href);
      // PKCE style: ?code=...
      const code = url.searchParams.get("code");
      // Implicit style: #access_token=...&refresh_token=...&type=recovery
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const errorDescription =
        url.searchParams.get("error_description") || hash.get("error_description");

      try {
        if (errorDescription) {
          if (!cancelled) setReady("invalid");
          return;
        }
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        // Clean the token out of the address bar
        window.history.replaceState({}, "", "/reset-password");

        const { data } = await supabase.auth.getSession();
        if (!cancelled) setReady(data.session ? "ok" : "invalid");
      } catch {
        if (!cancelled) setReady("invalid");
      }
    }

    establishSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/account" });
  }

  if (ready === "checking") {
    return (
      <AuthCard title="Set a new password" subtitle="Verifying your reset link…">
        <div className="h-24 rounded-2xl bg-secondary animate-pulse" />
      </AuthCard>
    );
  }

  if (ready === "invalid") {
    return (
      <AuthCard
        title="Reset link expired"
        subtitle="This password reset link is invalid or has already been used"
        footer={<Link to="/login" className="text-primary font-medium">Back to sign in</Link>}
      >
        <Button asChild className="w-full rounded-full">
          <Link to="/forgot-password">Send a new reset link</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose something memorable">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input id="confirm" type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}
