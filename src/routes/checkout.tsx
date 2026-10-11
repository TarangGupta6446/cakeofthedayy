import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { whatsappLink, SITE } from "@/lib/site";
import { formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: `Checkout — ${SITE.name}` },
      { name: "description", content: "Complete your cake order with quick WhatsApp checkout." },
      { property: "og:title", content: `Checkout — ${SITE.name}` },
      { property: "og:description", content: "Send your cake order straight to our WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);

  const total = subtotal;
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="bg-gradient-cream min-h-[60vh]">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl text-cocoa">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add a cake before checking out.</p>
          <Button asChild size="lg" className="rounded-full mt-6">
            <Link to="/shop">Browse Cakes</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    try {
      // Guests and signed-in users both go through a secure DB routine that
      // creates the order + line items in one transaction.
      const { data, error } = await supabase.rpc("place_order", {
        p_subtotal: subtotal,
        p_total: total,
        p_items: items.map((i) => ({
          product_id: i.productId ?? null,
          variant_id: i.variantId ?? null,
          variant_label: i.variantLabel ?? null,
          product_name: i.name,
          unit_price: i.unitPrice,
          qty: i.qty,
          custom_message: i.customMessage ?? null,
          addons: [
            ...(i.addons ?? []),
            ...(i.occasion ? [{ id: "occasion", name: `Occasion: ${i.occasion}`, price: 0 }] : []),
          ],
        })),
      });

      if (error) throw error;
      const order = Array.isArray(data) ? data[0] : data;
      if (!order) throw new Error("Failed to create order");


      const lines = items
        .map(
          (i) =>
            `• ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} × ${i.qty} — ${formatINR(
              (i.unitPrice + (i.addons?.reduce((a, x) => a + x.price, 0) ?? 0)) * i.qty,
            )}${i.occasion ? `\n   🎀 For: ${i.occasion}` : ""}${i.customMessage ? `\n   ✏️ "${i.customMessage}"` : ""}`,
        )
        .join("\n");

      const message =
        `Hi ${SITE.owner.split(" ")[0]}! I just placed order *${order.order_number}* on your website.\n\n` +
        `*Items:*\n${lines}\n\n` +
        `*Total: ${formatINR(total)}*\n\n` +
        `I'll share my name, address and delivery details here.`;

      clear();
      toast.success(`Order ${order.order_number} placed!`, {
        description: "Opening WhatsApp to confirm with the bakery…",
      });
      window.open(whatsappLink(message), "_blank");
      navigate({ to: "/account" });
    } catch (err: any) {
      toast.error("Could not place order", { description: err?.message ?? String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-cream min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-4xl text-cocoa">Checkout</h1>
          <p className="text-muted-foreground mt-1">
            Send your order to WhatsApp — we'll take your details and confirm there.
          </p>
        </motion.div>

        <div className="mt-8 bg-card border border-border/60 rounded-3xl p-6 shadow-soft">
          <h2 className="font-display text-xl text-cocoa mb-4">Order summary</h2>
          <ul className="divide-y divide-border/60">
            {items.map((i) => (
              <li key={i.id} className="py-3 flex justify-between text-sm gap-3">
                <span className="text-cocoa">
                  {i.name}
                  {i.variantLabel && <span className="text-muted-foreground"> · {i.variantLabel}</span>}
                  <span className="text-muted-foreground"> × {i.qty}</span>
                  {i.occasion && <span className="block text-xs text-primary">🎀 For: {i.occasion}</span>}
                  {i.customMessage && (
                    <span className="block text-xs text-muted-foreground italic">"{i.customMessage}"</span>
                  )}
                </span>
                <span className="font-medium tabular-nums">
                  {formatINR((i.unitPrice + (i.addons?.reduce((a, x) => a + x.price, 0) ?? 0)) * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border/60 pt-3 flex justify-between font-display text-lg text-cocoa">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              size="lg"
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="rounded-full shadow-warm flex-1"
            >
              {submitting ? "Placing order…" : `Place Order on WhatsApp · ${formatINR(total)}`}
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/cart">Back to Cart</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            You'll be redirected to WhatsApp with your order details. Share your name, address and delivery time there —
            payment is confirmed directly with the bakery.
          </p>
        </div>
      </div>
    </div>
  );
}
