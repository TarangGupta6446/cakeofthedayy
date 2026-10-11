import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/site/AuthCard";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: `Reset password — ${SITE.name}` }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="We'll email you a reset link"
      footer={<Link to="/login" className="text-primary font-medium">Back to sign in</Link>}
    >
      {sent ? (
        <div className="text-center text-sm text-muted-foreground bg-secondary rounded-2xl p-5">
          Reset link sent to <strong className="text-foreground">{email}</strong>. Check your inbox.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
