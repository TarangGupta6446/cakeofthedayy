import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE } from "@/lib/site";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/order-status";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Orders Dashboard — ${SITE.name}` },
      { name: "description", content: "Bakery owner dashboard to confirm and track cake orders." },
      { property: "og:title", content: `Orders Dashboard — ${SITE.name}` },
      { property: "og:description", content: "Confirm and track cake orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user!.id,
        _role: "admin",
      });
      if (error) throw error;
      return !!data;
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, status, payment_status, total, created_at, order_items(product_name, qty, variant_label)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function update(id: string, patch: { status?: any; payment_status?: any }) {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  if (loading || roleLoading || !user) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl text-cocoa">Owners only</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            This dashboard is only available to the bakery owner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-cream min-h-[80vh]">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl md:text-4xl text-cocoa">Orders Dashboard</h1>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        ) : !orders?.length ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o: any) => (
              <div key={o.id} className="bg-card border border-border/60 rounded-2xl p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">#{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    {o.order_items?.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {o.order_items
                          .map(
                            (i: any) =>
                              `${i.qty}× ${i.product_name}${i.variant_label ? ` (${i.variant_label})` : ""}`,
                          )
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-foreground">{formatINR(Number(o.total))}</span>
                </div>

                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  <Select value={o.status} onValueChange={(v) => update(o.id, { status: v })}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {orderStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={o.payment_status}
                    onValueChange={(v) => update(o.id, { payment_status: v })}
                  >
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {paymentStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-2 flex gap-1.5">
                  <Badge variant="secondary">{orderStatusLabel(o.status)}</Badge>
                  <Badge variant="outline">{paymentStatusLabel(o.payment_status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
