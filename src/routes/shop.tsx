import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: `Shop Cakes — ${SITE.name}` },
      { name: "description", content: "Browse our full menu of 100% eggless cakes, cheesecakes, cupcakes, and brownies. Order online or via WhatsApp." },
    ],
  }),
  component: ShopPage,
});

type Category = { id: string; name: string; slug: string };

function ShopPage() {
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: products = [], isLoading } = useQuery<(ProductCardData & { category_id: string | null })[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,slug,name,description,base_price,image_url,rating,is_bestseller,is_featured,category_id")
        .eq("is_active", true);
      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, base_price: Number(p.base_price), rating: Number(p.rating) }));
    },
  });

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat) list = list.filter((p) => p.category_id === activeCat);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || (p.description ?? "").toLowerCase().includes(t));
    }
    const catOrder = new Map(categories.map((c, i) => [c.id, i]));
    const catRank = (p: (typeof list)[number]) => catOrder.get(p.category_id ?? "") ?? 999;
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => catRank(a) - catRank(b) || a.base_price - b.base_price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => catRank(a) - catRank(b) || b.base_price - a.base_price);
    } else {
      list = [...list].sort((a, b) => catRank(a) - catRank(b) || Number(b.is_featured) - Number(a.is_featured));
    }
    return list;
  }, [products, activeCat, q, sort, categories]);

  return (
    <div className="bg-gradient-cream">
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl md:text-5xl text-cocoa">Our Cake Menu</h1>
          <p className="mt-2 text-muted-foreground">Freshly baked, 100% eggless. Pick your celebration.</p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sticky top-16 sm:top-20 z-30 bg-gradient-cream/80 backdrop-blur">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cakes…"
              className="pl-9 rounded-full bg-card"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full bg-card border border-input px-4 py-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <CatPill active={activeCat === null} onClick={() => setActiveCat(null)}>All</CatPill>
          {categories.map((c) => (
            <CatPill key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
              {c.name}
            </CatPill>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center border border-border/60">
            <p className="text-muted-foreground">No cakes match your search.</p>
            <Button variant="link" onClick={() => { setQ(""); setActiveCat(null); }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function CatPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-soft"
          : "bg-card text-foreground/80 border-border hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}
