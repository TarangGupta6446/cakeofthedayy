import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `Our Story — ${SITE.name}` },
      { name: "description", content: `Meet ${SITE.owner}, the baker behind ${SITE.name}. Handcrafted eggless cakes made with love.` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-gradient-cream">
      <section className="mx-auto max-w-5xl px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-5xl text-cocoa">Made with <span className="text-primary italic">love</span>, baked daily.</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Cake Of The Day began in {SITE.owner}'s kitchen with a simple promise — every cake should taste as
            beautiful as it looks. Today, we hand-bake premium 100% eggless cakes for birthdays, weddings, and
            every little moment worth celebrating.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Pure ingredients, no shortcuts, and a generous dose of love in every layer. That's our recipe.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full shadow-warm">
            <Link to="/shop">Explore Cakes</Link>
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-warm rounded-full blur-3xl opacity-25" />
            <img src={logo} alt={SITE.owner} className="relative w-full max-w-sm mx-auto aspect-square object-cover rounded-full shadow-warm" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 grid sm:grid-cols-3 gap-6">
        {[
          { icon: Leaf, title: "100% Eggless", desc: "Pure vegetarian recipes everyone can enjoy." },
          { icon: Heart, title: "Made with Love", desc: "Every cake is hand-crafted with attention to detail." },
          { icon: Sparkles, title: "Daily Fresh", desc: "Baked the same day to reach you fresh." },
        ].map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-3xl bg-card border border-border/60 p-6 text-center shadow-soft"
          >
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-warm flex items-center justify-center text-primary-foreground mb-3">
              <v.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl text-cocoa">{v.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
