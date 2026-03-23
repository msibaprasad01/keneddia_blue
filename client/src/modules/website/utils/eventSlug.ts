export function slugifyEventName(value: string | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildEventDetailPath(event: {
  id: number | string;
  title?: string | null;
}) {
  const id = String(event.id ?? "").trim();
  const slug = slugifyEventName(event.title);
  return `/events/${slug ? `${slug}-${id}` : id}`;
}

export function getEventIdFromSlug(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const parts = raw.split("-");
  return parts[parts.length - 1] || raw;
}
