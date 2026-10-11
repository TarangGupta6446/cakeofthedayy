// Customer-facing labels for raw DB enum values, so nobody sees "pending_confirmation".
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  baking: "Baking",
  out_for_delivery: "Out for delivery",
  delivered: "Completed",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Payment pending",
  pending_confirmation: "Confirming on WhatsApp",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
};

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "baking",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "pending_confirmation",
  "paid",
  "failed",
  "refunded",
] as const;

export function orderStatusLabel(v?: string | null) {
  return (v && ORDER_STATUS_LABELS[v]) || v || "";
}

export function paymentStatusLabel(v?: string | null) {
  return (v && PAYMENT_STATUS_LABELS[v]) || v || "";
}
