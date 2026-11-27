// Small money and percent helpers for DealSleuth. One job: turn raw
// numbers into the strings the cards show, so the math stays in one place.

export function money(amount) {
  const value = Number(amount);
  const text = value.toFixed(2);
  return "$" + (text.endsWith(".00") ? text.slice(0, -3) : text);
}

export function discountPercent(sale, usual) {
  if (!usual || usual <= sale) return 0;
  return Math.round(((usual - sale) / usual) * 100);
}

export function saving(sale, usual) {
  return Math.max(0, usual - sale);
}

export function signalLabel(signal) {
  if (signal === "new-low") return "NEW LOW";
  if (signal === "strong") return "STRONG PRICE";
  return "ROUTINE SALE";
}

export function signalNote(signal) {
  if (signal === "new-low") return "Lowest price we have seen for this item.";
  if (signal === "strong") return "A genuinely good price, well under its usual price.";
  return "On sale, but not special: a small saving, or a padded list price.";
}
