import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CakeImage } from "@/components/site/PlaceholderCake";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${prettify(params.slug)} — ${SITE.name}` },
      { name: "description", content: `Order ${prettify(params.slug)} online. 100% eggless, baked fresh by ${SITE.owner}.` },
    ],
  }),
  component: ProductPage,
});

function prettify(slug: string) {
  return slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}

function ProductPage() {
  const { slug } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select("id,slug,name,description,base_price,image_url,rating,is_bestseller,is_featured,category_id")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      if (!product) return null;
      const { data: variants } = await supabase
        .from("product_variants")
        .select("size,price_delta")
        .eq("product_id", product.id);
      return {
        product: { ...product, base_price: Number(product.base_price), rating: Number(product.rating) },
        variants: (variants ?? []).map((v) => ({ ...v, price_delta: Number(v.price_delta) })),
      };
    },
  });

  const { data: related = [] } = useQuery<ProductCardData[]>({
    queryKey: ["related", data?.product.category_id],
    enabled: !!data?.product.category_id,
    queryFn: async () => {
      const { data: rows } = await supabase
        .from("products")
        .select("id,slug,name,description,base_price,image_url,rating,is_bestseller,is_featured")
        .eq("is_active", true)
        .eq("category_id", data!.product.category_id!)
        .neq("slug", slug)
        .limit(4);
      return (rows ?? []).map((p) => ({ ...p, base_price: Number(p.base_price), rating: Number(p.rating) }));
    },
  });

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

  const { product, variants } = data;
  const minPrice = product.base_price + Math.min(0, ...variants.map((v) => v.price_delta));
  const maxPrice = product.base_price + Math.max(0, ...variants.map((v) => v.price_delta));

  return (
    <div className="bg-gradient-cream">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All cakes
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden shadow-warm bg-card">
            <CakeImage src={product.image_url} alt={product.name} className="h-full w-full" />
          </div>
          {product.is_bestseller && (
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-soft">
              Bestseller
            </span>
          )}
        </motion.div>

        <div className="space-y-6 flex flex-col">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <span className="text-muted-foreground">{product.rating.toFixed(1)} · 100% Eggless</span>
            </div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-cocoa">{product.name}</h1>
            <p className="mt-3 text-muted-foreground">{product.description}</p>
            <p className="mt-5 text-3xl font-semibold text-primary">
              {minPrice === maxPrice ? formatINR(minPrice) : `${formatINR(minPrice)} – ${formatINR(maxPrice)}`}
            </p>
            {variants.length > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Available in {variants.map((v) => v.size).join(", ")}
              </p>
            )}
          </div>

          <ul className="space-y-2 text-sm text-cocoa/90">
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Freshly baked to order</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> 100% eggless recipe</li>
            <li className="flex items-center gap-2"><span className="text-primary">✓</span> Personalize with size, occasion & message</li>
          </ul>

          <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild size="lg" className="rounded-full flex-1 shadow-warm">
              <Link to="/order/$slug" params={{ slug }}>
                Order this cake <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a
                href={whatsappLink(`Hi! I'd like to know more about: ${product.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <h2 className="font-display text-3xl text-cocoa mb-6">You may also love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
