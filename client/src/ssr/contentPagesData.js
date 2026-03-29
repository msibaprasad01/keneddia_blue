import {
  GetAllPropertyDetails,
  getAllNews,
  getDailyOffers,
  getEventDetailInfoById,
  getEventFilesByUploadedId,
  getEventInterestByEventId,
  getEventsUpdated,
} from "@/Api/Api";
import { getEventIdFromSlug } from "@/modules/website/utils/eventSlug";
import { getNewsIdFromSlug } from "@/modules/website/utils/newsSlug";

const getAmenityName = (amenity) => {
  if (typeof amenity === "string") return amenity;
  if (
    amenity &&
    typeof amenity === "object" &&
    "name" in amenity &&
    typeof amenity.name === "string"
  ) {
    return amenity.name;
  }

  return null;
};

const fetchSafe = async (fn, fallback, label = "SSR content data fetch error") => {
  try {
    return await fn();
  } catch (error) {
    console.error(label, error);
    return fallback;
  }
};

const normalizeOffers = (response) => {
  const rawData = response?.data?.data || response?.data || [];
  const list = Array.isArray(rawData) ? rawData : rawData.content || [];

  return list
    .filter((offer) => offer?.isActive)
    .map((offer) => ({
      id: offer.id,
      title: offer.title || "",
      description: offer.description || "",
      couponCode: offer.couponCode || null,
      ctaText: offer.ctaText || "",
      ctaLink: offer.ctaUrl || offer.ctaLink || null,
      expiresAt: offer.expiresAt,
      activeDays: Array.isArray(offer.activeDays) ? offer.activeDays : [],
      propertyType: offer.propertyTypeName || "",
      image: offer.image?.url
        ? {
            src: offer.image.url,
            type: offer.image.type,
            width: offer.image.width,
            height: offer.image.height,
            fileName: offer.image.fileName,
            alt: offer.title || "",
          }
        : null,
    }));
};

const normalizeEventsList = (response) => {
  const raw = response?.data || response || [];
  return (Array.isArray(raw) ? raw : []).filter((event) => event?.active);
};

const normalizeNewsList = (response) => {
  const raw = response?.data?.content || response?.content || response?.data || [];
  return (Array.isArray(raw) ? raw : []).filter((item) => item?.active);
};

const normalizeEventFiles = (response) => {
  const fileGroups = response?.data?.data || response?.data || response || [];
  const groups = Array.isArray(fileGroups) ? fileGroups : [];
  const heroSlides = [];
  const pastEventImages = [];

  groups.forEach((group) => {
    const medias = Array.isArray(group?.medias) ? group.medias : [];
    const category = String(group?.category || "").trim().toLowerCase();

    if (category === "hero_slider") {
      heroSlides.push(
        ...medias
          .filter((media) => media?.url)
          .map((media) => ({
            url: media.url,
            type: media.type,
            alt: media.alt || "event-media",
          })),
      );
    }

    if (category === "past_event") {
      pastEventImages.push(
        ...medias
          .filter((media) => media?.url)
          .map((media) => ({
            url: media.url,
            type: media.type,
            alt: media.alt || "past-event",
          })),
      );
    }
  });

  return { heroSlides, pastEventImages };
};

const normalizeProperties = (response) => {
  const rawData = response?.data || response || [];

  return (Array.isArray(rawData) ? rawData : []).flatMap((item) => {
    const parent = item?.propertyResponseDTO;
    const listings = Array.isArray(item?.propertyListingResponseDTOS)
      ? item.propertyListingResponseDTOS
      : [];

    if (!parent || !parent.isActive) return [];

    return listings
      .filter((listing) => listing?.isActive)
      .map((listing) => ({
        id: listing.id,
        propertyId: parent.id,
        name: parent.propertyName || "Premium Property",
        type:
          listing.propertyType ||
          (Array.isArray(parent.propertyTypes) ? parent.propertyTypes[0] : null) ||
          "Hotel",
        location: parent.locationName || "India",
        image: listing.media?.[0]?.url || "",
        rating: listing.rating || 5,
        highlights: (listing.amenities || [])
          .map((amenity) => getAmenityName(amenity))
          .filter(Boolean),
      }));
  });
};

export const fetchOfferListingData = async () => {
  const offersRes = await fetchSafe(
    () => getDailyOffers({ targetType: "GLOBAL", page: 0, size: 100 }),
    null,
  );

  return {
    items: offersRes ? normalizeOffers(offersRes) : [],
  };
};

export const fetchEventsListingData = async () => {
  const eventsRes = await fetchSafe(() => getEventsUpdated(), null);

  return {
    items: eventsRes ? normalizeEventsList(eventsRes) : [],
  };
};

export const fetchEventDetailPageData = async (eventSlug) => {
  const eventId = getEventIdFromSlug(eventSlug);
  if (!eventId) {
    return {
      eventId: "",
      event: null,
      detailInfoList: [],
      heroSlides: [],
      pastEventImages: [],
      interestList: [],
      notFound: true,
    };
  }

  const eventsRes = await fetchSafe(() => getEventsUpdated({}), null);
  const events = eventsRes ? normalizeEventsList(eventsRes) : [];
  const event = events.find((item) => String(item?.id) === String(eventId)) || null;

  if (!event) {
    return {
      eventId,
      event: null,
      detailInfoList: [],
      heroSlides: [],
      pastEventImages: [],
      interestList: [],
      notFound: true,
    };
  }

  const [detailRes, filesRes, interestRes] = await Promise.all([
    fetchSafe(() => getEventDetailInfoById(eventId), null),
    fetchSafe(() => getEventFilesByUploadedId(eventId), null),
    fetchSafe(() => getEventInterestByEventId(eventId), null),
  ]);

  const rawDetailList = detailRes?.data?.data ?? detailRes?.data ?? detailRes ?? [];
  const detailInfoList = (Array.isArray(rawDetailList) ? rawDetailList : rawDetailList ? [rawDetailList] : [])
    .sort((a, b) => b.id - a.id);
  const media = filesRes ? normalizeEventFiles(filesRes) : { heroSlides: [], pastEventImages: [] };
  const rawInterest = interestRes?.data?.data ?? interestRes?.data ?? interestRes ?? [];

  return {
    eventId,
    event,
    detailInfoList,
    heroSlides: media.heroSlides,
    pastEventImages: media.pastEventImages,
    interestList: Array.isArray(rawInterest) ? rawInterest : [],
    notFound: false,
  };
};

export const fetchNewsListingData = async () => {
  const newsRes = await fetchSafe(
    () => getAllNews({ category: "", page: 0, size: 100 }),
    null,
  );

  return {
    items: newsRes ? normalizeNewsList(newsRes) : [],
  };
};

export const fetchNewsDetailPageData = async (newsSlug) => {
  const newsId = getNewsIdFromSlug(newsSlug);
  if (!newsId) {
    return {
      newsId: "",
      newsItem: null,
      allNews: [],
      dynamicProperties: [],
      notFound: true,
    };
  }

  const newsRes = await fetchSafe(
    () => getAllNews({ category: "", page: 0, size: 100 }),
    null,
  );
  const allNews = newsRes ? normalizeNewsList(newsRes) : [];
  const newsItem = allNews.find((item) => String(item?.id) === String(newsId)) || null;

  if (!newsItem) {
    return {
      newsId,
      newsItem: null,
      allNews,
      dynamicProperties: [],
      notFound: true,
    };
  }

  const propertiesRes = await fetchSafe(() => GetAllPropertyDetails(), null);
  const allProperties = propertiesRes ? normalizeProperties(propertiesRes) : [];
  const targetCategory = String(newsItem.badgeType || "").toLowerCase();

  const dynamicProperties = allProperties.filter((property) => {
    const propertyType = String(property.type || "").toLowerCase();

    if (targetCategory === "hotel") {
      return ["hotel", "resort", "villa"].includes(propertyType);
    }

    if (targetCategory === "restaurant") {
      return ["restaurant", "cafe", "wine & dine"].includes(propertyType);
    }

    return true;
  });

  return {
    newsId,
    newsItem,
    allNews,
    dynamicProperties,
    notFound: false,
  };
};
