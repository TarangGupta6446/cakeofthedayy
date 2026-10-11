import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { CakeImage } from "@/components/site/PlaceholderCake";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: `Your Cart — ${SITE.name}` }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);

  if (items.length === 0) {
    return (
      <div className="bg-gradient-cream min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <ShoppingBag className="h-9 w-9 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-cocoa">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Browse our cakes and add something sweet.</p>
          <Button asChild size="lg" className="mt-6 rounded-full shadow-warm">
            <Link to="/shop">Browse Cakes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = subtotal;


  return (
    <div className="bg-gradient-cream">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-4xl text-cocoa mb-8">Your Cart</h1>
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-3">
            {items.map((item, i) => {
              const lineUnit = item.unitPrice + (item.addons?.reduce((a, x) => a + x.price, 0) ?? 0);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-4 rounded-3xl bg-card border border-border/60 p-3 sm:p-4 shadow-soft"
                >
                  <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden">
                    <CakeImage src={item.image} alt={item.name} className="h-full w-full" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to="/shop/$slug" params={{ slug: item.slug }} className="font-display text-lg text-cocoa hover:text-primary line-clamp-1">
                          {item.name}
                        </Link>
                        {(item.variantLabel || item.occasion) && (
                          <p className="text-xs text-muted-foreground">
                            {item.variantLabel}
                            {item.variantLabel && item.occasion && " · "}
                            {item.occasion && <span className="text-primary">For: {item.occasion}</span>}
                          </p>
                        )}

                        {item.customMessage && (
                          <p className="text-xs text-muted-foreground italic mt-1">"{item.customMessage}"</p>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">+ {item.addons.map((a) => a.name).join(", ")}</p>
                        )}
                      </div>
                      <button onClick={() => remove(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(item.id, item.qty - 1)} className="p-1.5 hover:text-primary">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => setQty(item.id, item.qty + 1)} className="p-1.5 hover:text-primary">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-primary">{formatINR(lineUnit * item.qty)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive pt-2">
              Clear cart
            </button>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-card border border-border/60 p-6 shadow-soft space-y-4">
            <h2 className="font-display text-xl text-cocoa">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span><span className="text-primary">{formatINR(total)}</span>
            </div>
            <Button asChild size="lg" className="w-full rounded-full shadow-warm">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full rounded-full">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
