export const SITE = {
  name: "Cake Of The Day",
  tagline: "100% Eggless · Daily Fresh & Tasty",
  owner: "Neetu Gupta",
  phone: "+91 96726 91999",
  whatsappNumber: "919672691999",
  email: "neetuguptasbi@gmail.com",
  description:
    "Premium 100% eggless cakes baked fresh daily by Neetu Gupta. Custom cakes for birthdays, weddings, and every celebration.",
  url: "https://cakeoftheday.in",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
