import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Cake, Leaf, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import logo from "@/assets/logo.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — 100% Eggless Cakes, Baked Fresh Daily` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — Premium Eggless Cakes` },
      { property: "og:description", content: SITE.description },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: featured = [] } = useQuery<ProductCardData[]>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,description,base_price,image_url,rating,is_bestseller,is_featured")
        .eq("is_active", true)
        .eq("is_featured", true)
        .limit(8);
      return (data ?? []).map((p) => ({ ...p, base_price: Number(p.base_price), rating: Number(p.rating) }));
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-cream">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-warm opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gradient-blush opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-cocoa">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> 100% Eggless · Daily Fresh
            </span>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-cocoa">
              Sweet moments,<br />
              <span className="text-primary italic">baked with love.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Premium handcrafted eggless cakes for birthdays, weddings, and every little
              celebration in between.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-warm">
                <Link to="/shop">
                  Browse Cakes <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/custom-order">Order Custom</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Loved by 500+ happy customers</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-warm rounded-full blur-3xl opacity-30" />
            <img
              src={logo}
              alt="Cake Of The Day signature cake"
              className="relative w-full max-w-md aspect-square object-cover rounded-full shadow-warm"
            />
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-cocoa">Why Cake Of The Day?</h2>
          <p className="mt-3 text-muted-foreground">Crafted daily, never compromised.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Leaf, title: "100% Eggless", desc: "Pure vegetarian recipes everyone can enjoy." },
            { icon: Cake, title: "Daily Fresh", desc: "Baked the same day your order arrives." },
            { icon: Sparkles, title: "Custom Designs", desc: "Tell us your idea — we'll bring it to life." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl bg-card p-8 shadow-soft border border-border/60 text-center"
            >
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-warm flex items-center justify-center text-primary-foreground">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED CAKES */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-cocoa">Today's Favorites</h2>
              <p className="mt-2 text-muted-foreground">Hand-picked bestsellers from our oven.</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-warm p-10 md:p-16 text-center text-primary-foreground shadow-warm">
          <h2 className="font-display text-3xl md:text-5xl">Ready to celebrate?</h2>
          <p className="mt-3 max-w-xl mx-auto opacity-90">
            Order now or message us on WhatsApp — we'll bake your perfect cake.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/shop">Shop Cakes</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href={whatsappLink("Hi! I'd like to order a cake.")} target="_blank" rel="noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
