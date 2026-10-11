import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/custom-order")({
  head: () => ({
    meta: [
      { title: `Custom Cake Orders — ${SITE.name}` },
      { name: "description", content: "Tell us about your dream cake. Upload an inspiration photo and we'll bake it eggless, fresh, just for you." },
    ],
  }),
  component: CustomOrderPage,
});

function CustomOrderPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    event_date: "",
    size: "1kg",
    flavor: "Chocolate",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.event_date) {
      toast.error("Please fill name, phone, and event date.");
      return;
    }
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB.");
        const ext = file.name.split(".").pop();
        const path = `anon/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("custom-order-uploads").upload(path, file);
        if (upErr) throw upErr;
        imageUrl = path;
      }
      const { error } = await supabase.from("custom_orders").insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        event_date: form.event_date,
        size: form.size,
        flavor: form.flavor,
        notes: form.notes || null,
        inspiration_image_url: imageUrl,
      });
      if (error) throw error;
      toast.success("Request received! We'll WhatsApp you shortly.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-cream">
      <section className="mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="mt-4 font-display text-4xl md:text-5xl text-cocoa">Design your dream cake</h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Send us your idea, an inspiration photo, and event date. {SITE.owner} will craft a one-of-a-kind eggless cake just for you.
          </p>
        </motion.div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-soft space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name *">
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Riya Sharma" required />
            </Field>
            <Field label="WhatsApp number *">
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 …" required />
            </Field>

            <Field label="Event date *">
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="date"
                  className="pl-9"
                  value={form.event_date}
                  onChange={(e) => update("event_date", e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
            </Field>
            <Field label="Approx size">
              <select
                value={form.size}
                onChange={(e) => update("size", e.target.value)}
                className="w-full rounded-md border border-input bg-background h-10 px-3 text-sm"
              >
                {["500g", "1kg", "1.5kg", "2kg", "3kg", "Tiered"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Preferred flavor">
              <select
                value={form.flavor}
                onChange={(e) => update("flavor", e.target.value)}
                className="w-full rounded-md border border-input bg-background h-10 px-3 text-sm"
              >
                {["Chocolate", "Vanilla", "Red Velvet", "Butterscotch", "Strawberry", "Pineapple", "Coffee", "Surprise me"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Tell us your idea">
            <Textarea
              rows={4}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Theme, colors, message on cake, dietary needs…"
            />
          </Field>

          <Field label="Inspiration photo (optional)">
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/50 hover:border-primary/40 cursor-pointer p-6 transition-colors">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Click to upload (max 5MB)"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={submitting} size="lg" className="rounded-full flex-1 shadow-warm">
              {submitting ? "Sending…" : "Send Request"}
            </Button>
            <Button asChild type="button" variant="outline" size="lg" className="rounded-full flex-1">
              <a href={whatsappLink("Hi! I'd like to discuss a custom cake.")} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium text-cocoa mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
