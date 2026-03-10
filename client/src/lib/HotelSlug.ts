export const createHotelSlug = (name: string, id: number | string) => {
  const safeId = String(id).trim();
  if (!name) return safeId;

  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${safeId}`;
};
export const createCitySlug = (city?: string) =>
  city
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "hotel";
