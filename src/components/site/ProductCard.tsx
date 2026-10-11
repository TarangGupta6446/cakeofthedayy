import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { CakeImage } from "./PlaceholderCake";
import { formatINR } from "@/lib/format";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  rating: number;
  is_bestseller?: boolean;
  is_featured?: boolean;
};

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
    >
      <Link
        to="/order/$slug"
        params={{ slug: product.slug }}
        className="group block rounded-3xl bg-card border border-border/60 overflow-hidden shadow-soft hover:shadow-warm transition-all hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden">
          <CakeImage
            src={product.image_url}
            alt={product.name}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          {product.is_bestseller && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-soft">
              Bestseller
            </span>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-tight text-cocoa group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {product.rating.toFixed(1)}
            </div>
          </div>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-primary">{formatINR(product.base_price)}</span>
            <span className="text-xs text-muted-foreground">starts</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
