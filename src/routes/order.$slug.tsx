import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CakeImage } from "@/components/site/PlaceholderCake";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/order/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${prettify(params.slug)} — ${SITE.name}` },
      { name: "description", content: `Customize your ${prettify(params.slug)} — choose size, occasion, message and add-ons.` },
    ],
  }),
  component: OrderPage,
});

function prettify(slug: string) {
  return slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}

const OCCASIONS = [
  "🎂 Birthday",
  "💍 Anniversary",
  "💒 Wedding",
  "👶 Baby Shower",
  "🎓 Graduation",
  "💖 Engagement",
  "🎉 Celebration",
  "✨ Other",
];

function OrderPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const add = useCart((s) => s.add);

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select("id,slug,name,description,base_price,image_url,is_bestseller,category_id")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      if (!product) return null;
      const [{ data: variants }, { data: addons }, { data: category }] = await Promise.all([
        supabase.from("product_variants").select("id,size,flavor,price_delta").eq("product_id", product.id),
        supabase.from("addons").select("id,name,price").eq("is_active", true),
        product.category_id
          ? supabase.from("categories").select("slug").eq("id", product.category_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      return {
        product: { ...product, base_price: Number(product.base_price) },
        variants: (variants ?? []).map((v) => ({ ...v, price_delta: Number(v.price_delta) })),
        addons: (addons ?? []).map((a) => ({ ...a, price: Number(a.price) })),
        categorySlug: category?.slug ?? null,
      };
    },
  });

  const isCupcake = data?.categorySlug === "cupcakes";
  const isBrownie = data?.categorySlug === "brownies";
  const isCookies = data?.categorySlug === "cookies";
  const isPerPiece = isCupcake || isBrownie || isCookies;
  const minQty = isCupcake ? 3 : isBrownie ? 2 : 1;
  const pieceLabel = isCupcake ? "cupcakes" : isBrownie ? "brownies" : "packs (500 g each)";
  const hideMessageStep = isPerPiece;

  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [chosenAddons, setChosenAddons] = useState<Record<string, boolean>>({});
  const [occasion, setOccasion] = useState("Birthday");
  const [otherOccasion, setOtherOccasion] = useState("");


  const variant = useMemo(
    () => data?.variants.find((v) => v.id === variantId) ?? data?.variants[0] ?? null,
    [data, variantId],
  );

  const unitPrice = (data?.product.base_price ?? 0) + (variant?.price_delta ?? 0);
  const addonsTotal = (data?.addons ?? []).filter((a) => chosenAddons[a.id]).reduce((s, a) => s + a.price, 0);
  const total = (unitPrice + addonsTotal) * qty;

  useEffect(() => {
    if (isPerPiece) setQty((q) => (q < minQty ? minQty : q));
  }, [isPerPiece, minQty]);


  if (isLoading) {
    return <div className="mx-auto max-w-6xl px-4 py-20 animate-pulse"><div className="h-96 rounded-3xl bg-card" /></div>;
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Cake not found</h1>
        <Button asChild className="mt-6 rounded-full"><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const { product, variants, addons } = data;

  const handleAdd = (goToCheckout = false) => {
    const chosen = addons.filter((a) => chosenAddons[a.id]);
    const finalOccasion = occasion === "Other" ? (otherOccasion.trim() || "Other") : occasion;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image_url ?? "",
      variantId: variant?.id ?? null,
      variantLabel: variant ? `${variant.size} · ${variant.flavor}` : null,
      unitPrice,
      qty,
      customMessage: message.trim() || undefined,
      occasion: finalOccasion,
      addons: chosen.map((a) => ({ id: a.id, name: a.name, price: a.price })),
    });
    toast.success(`${product.name} added to cart`);
    navigate({ to: goToCheckout ? "/checkout" : "/cart" });
  };

  return (
    <div className="bg-gradient-cream pb-32 lg:pb-12">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/shop/$slug" params={{ slug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to cake
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-[1fr_1.1fr] gap-10">
        {/* Left: photo + name */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-24 h-fit space-y-4"
        >
          <div className="aspect-square rounded-3xl overflow-hidden shadow-warm bg-card">
            <CakeImage src={product.image_url} alt={product.name} className="h-full w-full" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-cocoa">{product.name}</h1>
            {product.description && (
              <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            )}
          </div>
        </motion.aside>

        {/* Right: configurator steps */}
        <div className="space-y-7">
          <h2 className="font-display text-2xl text-cocoa">Customize your order</h2>

          {variants.length > 0 && (
            <Step number={1} title="Choose size">
              <div className="grid sm:grid-cols-2 gap-3">
                {variants.map((v) => {
                  const active = (variantId ?? variants[0].id) === v.id;
                  const price = product.base_price + v.price_delta;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="font-display text-xl text-cocoa">{v.size}</div>
                      <div className="text-sm text-muted-foreground">{v.flavor}</div>
                      <div className="mt-2 text-lg font-semibold text-primary">{formatINR(price)}</div>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          <Step number={variants.length > 0 ? 2 : 1} title="What's the occasion?">
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((opt) => {
                const value = opt.split(" ").slice(1).join(" ");
                const active = occasion === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOccasion(value)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {occasion === "Other" && (
              <input
                type="text"
                value={otherOccasion}
                onChange={(e) => setOtherOccasion(e.target.value.slice(0, 40))}
                placeholder="Tell us the occasion (e.g., Farewell party)"
                className="mt-3 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            )}
          </Step>

          {!isPerPiece && (
            <Step number={variants.length > 0 ? 3 : 2} title="Message on cake" optional>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 80))}
                placeholder="e.g., Happy Birthday Riya!"
                className="rounded-2xl bg-card"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">{message.length}/80</p>
            </Step>
          )}

          <Step number={variants.length > 0 ? 4 : 3} title={isPerPiece && minQty > 1 ? `Quantity (min ${minQty})` : "Quantity"}>
            <div className="flex items-center rounded-full border border-border bg-card w-fit">
              <button onClick={() => setQty((q) => Math.max(minQty, q - 1))} className="p-3 hover:text-primary">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:text-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {isPerPiece && (
              <p className="text-xs text-muted-foreground mt-2">
                {isCookies
                  ? `Sold in ${pieceLabel}. 1 pack = 500 g (${formatINR(unitPrice)}). Add more packs for any size you want.`
                  : `${pieceLabel.charAt(0).toUpperCase() + pieceLabel.slice(1)} are sold in a minimum of ${minQty} pieces — order as many as you'd like.`}
              </p>
            )}
          </Step>


        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur border-t border-border shadow-warm lg:bg-transparent lg:backdrop-blur-0 lg:border-0 lg:shadow-none lg:static lg:mt-10">
        <div className="mx-auto max-w-6xl px-4 py-3 lg:py-0 flex items-center justify-between gap-3 lg:bg-card lg:rounded-3xl lg:border lg:border-border/60 lg:p-5 lg:shadow-soft">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold text-primary">{formatINR(total)}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleAdd(false)} size="lg" variant="outline" className="rounded-full">
              <ShoppingBag className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Add to Cart</span>
            </Button>
            <Button onClick={() => handleAdd(true)} size="lg" className="rounded-full shadow-warm">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, optional, children }: { number: number; title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {number}
        </span>
        <h3 className="font-display text-lg text-cocoa">
          {title}
          {optional && <span className="ml-2 text-xs text-muted-foreground font-sans">(optional)</span>}
        </h3>
      </div>
      <div className="pl-10">{children}</div>
    </section>
  );
}
