export function slugifyNewsTitle(value: string | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildNewsDetailPath(news: {
  id: number | string;
  title?: string | null;
}) {
  const id = String(news.id ?? "").trim();
  const slug = slugifyNewsTitle(news.title);
  return `/news/${slug ? `${slug}-${id}` : id}`;
}

export function getNewsIdFromSlug(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const parts = raw.split("-");
  return parts[parts.length - 1] || raw;
}
