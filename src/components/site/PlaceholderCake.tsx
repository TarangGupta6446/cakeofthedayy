import { Cake } from "lucide-react";

const PALETTES: Record<string, string> = {
  chocolate: "from-[#5b3a29] via-[#8a5a3b] to-[#caa07a]",
  redvelvet: "from-[#7a1f2b] via-[#b03a4a] to-[#f1c0c8]",
  strawberry: "from-[#b5364a] via-[#e87b8e] to-[#fcd9df]",
  butterscotch: "from-[#7a4a1d] via-[#cf8a3a] to-[#f3d39a]",
  blueberry: "from-[#2c2c66] via-[#5a5cb0] to-[#b9c1ec]",
  mango: "from-[#a14e0b] via-[#f0a23a] to-[#ffe1a8]",
  wedding: "from-[#7a5b78] via-[#c89bbf] to-[#f6dfe9]",
  cupcake: "from-[#a23b62] via-[#e08fae] to-[#fde0ec]",
  brownie: "from-[#3a2418] via-[#6f3f23] to-[#a87149]",
  coffee: "from-[#3a2516] via-[#7a4a2a] to-[#cba37a]",
  default: "from-primary to-primary-glow",
};

export function PlaceholderCake({ token, name }: { token: string; name?: string }) {
  const key = token.startsWith("placeholder:") ? token.slice("placeholder:".length) : "default";
  const palette = PALETTES[key] ?? PALETTES.default;
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${palette} flex items-center justify-center`}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:radial-gradient(circle_at_30%_20%,white,transparent_55%)]" />
      <Cake className="h-16 w-16 text-white/85 drop-shadow-md" strokeWidth={1.4} />
      {name && (
        <span className="absolute bottom-3 left-3 right-3 text-center text-[11px] font-medium uppercase tracking-widest text-white/85">
          {name}
        </span>
      )}
    </div>
  );
}

export function CakeImage({
  src,
  alt,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  if (!src || src.startsWith("placeholder:")) {
    return (
      <div className={className}>
        <PlaceholderCake token={src ?? "placeholder:default"} name={alt} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`${className} object-cover`} />;
}
