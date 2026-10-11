import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      { name: "description", content: `Reach ${SITE.name} on WhatsApp at ${SITE.phone} or email ${SITE.email}.` },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const items = [
    { icon: MessageCircle, title: "WhatsApp", value: SITE.phone, href: whatsappLink("Hi!"), cta: "Open Chat" },
    { icon: Phone, title: "Call", value: SITE.phone, href: `tel:${SITE.whatsappNumber}`, cta: "Call Now" },
    { icon: Mail, title: "Email", value: SITE.email, href: `mailto:${SITE.email}`, cta: "Send Email" },
  ];
  return (
    <div className="bg-gradient-cream">
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-5xl text-cocoa"
        >
          Let's bake something <span className="text-primary italic">special</span>
        </motion.h1>
        <p className="mt-3 text-muted-foreground">We respond fastest on WhatsApp — usually within minutes.</p>
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.a
              key={it.title}
              href={it.href}
              target={it.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-warm hover:-translate-y-1 transition-all"
            >
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-warm flex items-center justify-center text-primary-foreground mb-3">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg text-cocoa">{it.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 break-all">{it.value}</p>
              <Button variant="link" className="text-primary mt-2">{it.cta} →</Button>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
