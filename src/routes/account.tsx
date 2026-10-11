import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/site";
import { formatINR } from "@/lib/format";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/order-status";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { toast } from "sonner";
import { ClipboardList, LogOut, Package, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

/** Owner-only shortcut to the orders dashboard. */
function AdminLink() {
  const { isAdmin } = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <Button asChild className="rounded-full">
      <Link to="/admin">
        <ClipboardList className="h-4 w-4 mr-2" /> Orders Dashboard
      </Link>
    </Button>
  );
}


export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: `Account — ${SITE.name}` }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="bg-gradient-cream min-h-[80vh]">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-cocoa">My Account</h1>
              <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminLink />
              <Button
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  await supabase.auth.signOut();
                  toast.success("Signed out");
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>

          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
            <ProfileCard userId={user.id} />
            <OrdersCard userId={user.id} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileCard({ userId }: { userId: string }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setFullName(data.full_name ?? "");
      setPhone(data.phone ?? "");
    }
  }, [data]);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: userId, full_name: fullName, phone });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft h-fit">
      <div className="flex items-center gap-2 mb-4">
        <UserIcon className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl text-cocoa">Profile</h2>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="fn">Full name</Label>
            <Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ph">Phone</Label>
            <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={save} disabled={saving} className="rounded-full w-full">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}
    </div>
  );
}

function OrdersCard({ userId }: { userId: string }) {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, payment_status, payment_method, total, created_at, order_items(product_name, qty, variant_label)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl text-cocoa">My Orders</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !orders?.length ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Button asChild className="rounded-full"><Link to="/shop">Browse cakes</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <div key={o.id} className="border border-border/60 rounded-2xl p-4 hover:border-primary/40 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">#{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold text-foreground">{formatINR(Number(o.total))}</span>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary">{orderStatusLabel(o.status)}</Badge>
                    <Badge variant="outline">{paymentStatusLabel(o.payment_status)}</Badge>
                  </div>
                </div>
              </div>
              {o.order_items?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                  {o.order_items.map((i: any) => `${i.qty}× ${i.product_name}${i.variant_label ? ` (${i.variant_label})` : ""}`).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
