import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

/**
 * Google sign-in is served by the Lovable OAuth broker, which only exists on
 * Lovable-hosted domains. On other hosts (Vercel, Netlify, …) the backend has
 * no Google client secret and returns "Unsupported provider: missing OAuth
 * secret" — so we hide the button entirely there instead of showing a dead end.
 */
function isGoogleHost() {
  const host = window.location.hostname;
  return host.endsWith("lovable.app") || host === "localhost" || host === "127.0.0.1";
}

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);

  // Host is only known in the browser; keep SSR output stable.
  useEffect(() => setAvailable(isGoogleHost()), []);

  if (!available) return null;

  return (
    <>
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px bg-border flex-1" /> OR <div className="h-px bg-border flex-1" />
    </div>
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const host = window.location.hostname;
        // The Lovable OAuth broker (/~oauth/*) only exists on Lovable-hosted
        // domains. On other hosts (Vercel, Netlify, …) it 404s, so go straight
        // to the backend's own Google OAuth endpoint there.
        const onLovableHost = host.endsWith("lovable.app") || host === "localhost" || host === "127.0.0.1";

        if (onLovableHost) {
          const result = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin + "/account",
          });
          if (result.error) {
            toast.error("Google sign-in failed", { description: String(result.error.message ?? result.error) });
            setLoading(false);
          }
          return;
        }

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin + "/account" },
        });
        if (error) {
          toast.error("Google sign-in failed", { description: error.message });
          setLoading(false);
        }
      }}
    >
      <svg className="h-4 w-4 mr-2" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29.1 4.5 24 4.5 16.3 4.5 9.7 8.7 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13-4.6l-6-5c-2 1.5-4.5 2.4-7 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.2 16.2 43.5 24 43.5z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6 5C40.8 35.4 43.5 30.1 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
      </svg>
      {loading ? "Redirecting…" : label}
    </Button>
    </>
  );
}
