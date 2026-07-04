export function labelize(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function normalizeValue(value) {
  if (value === true) return "Active";
  if (value === false) return "Inactive";
  if (value === null || value === undefined || value === "") return "--";
  if (typeof value === "number") return String(value);
  return String(value);
}

export function extractRows(body, preferredKey, fields) {
  const payload = body?.data ?? body;
  const candidates = [
    preferredKey && payload?.[preferredKey],
    payload?.data,
    payload?.content,
    payload?.items,
    Array.isArray(payload) ? payload : null,
  ].filter(Boolean);

  const list = candidates.find(Array.isArray) || [];
  return list.map((item) => fields.map((field) => normalizeValue(item?.[field])));
}

export function badgeTone(value) {
  const upper = String(value).toUpperCase();
  if (["ACTIVE", "APPROVED", "POSTED", "PAID", "YES"].includes(upper)) return "green";
  if (["DRAFT", "PARTIAL", "PENDING", "UNPAID", "NO"].includes(upper)) return "gold";
  if (["INACTIVE", "CANCELLED", "REJECTED"].includes(upper)) return "red";
  return "slate";
}
