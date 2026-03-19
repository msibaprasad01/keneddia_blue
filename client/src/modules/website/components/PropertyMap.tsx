import { useState, useMemo } from "react";
import { MapPin, ExternalLink } from "lucide-react";

interface PropertyMapProps {
  property?: {
    name: string;
    location: string;
    coordinates?: { lat: number; lng: number } | null;
  };
  nearbyPlaces?: {
    name: string;
    googleMapLink: string;
    type?: string;
    distance?: string;
  }[];
}

function isEmbedUrl(url: string): boolean {
  return url?.startsWith("https://www.google.com/maps/embed");
}

function buildPropertyEmbedUrl(property: {
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number } | null;
}): string {
  if (property.coordinates?.lat && property.coordinates?.lng) {
    return `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&output=embed&t=m&z=15`;
  }
  const query = encodeURIComponent(`${property.name} ${property.location}`.trim());
  return `https://www.google.com/maps?q=${query}&output=embed&t=m&z=15`;
}

export default function PropertyMap({ property, nearbyPlaces = [] }: PropertyMapProps) {
  // Default to first nearby place if exists, otherwise null (property)
  const [activeLocation, setActiveLocation] = useState<any>(
    nearbyPlaces.length > 0 ? nearbyPlaces[0] : null
  );

  if (!property) return null;

  const { mapUrl, sourceName, isValidEmbed, externalLink } = useMemo(() => {
    if (activeLocation !== null) {
      const valid = isEmbedUrl(activeLocation.googleMapLink);
      return {
        mapUrl: valid ? activeLocation.googleMapLink : null,
        sourceName: activeLocation.name,
        isValidEmbed: valid,
        externalLink: activeLocation.googleMapLink,
      };
    }

    return {
      mapUrl: buildPropertyEmbedUrl(property),
      sourceName: property.name,
      isValidEmbed: true,
      externalLink: null,
    };
  }, [activeLocation, property]);

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative bg-slate-50">

      {/* MAP IFRAME */}
      {isValidEmbed && mapUrl ? (
        <iframe
          key={mapUrl}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-100 text-slate-600 p-6 text-center">
          <MapPin size={40} className="text-red-400" />
          <div>
            <p className="font-bold text-slate-800 text-sm mb-1">{sourceName}</p>
            <p className="text-xs text-slate-500 mb-4">
              This location link cannot be embedded. Use Google Maps → Share → Embed a map to get a valid embed URL.
            </p>
            {externalLink && (
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full hover:bg-slate-700 transition-colors"
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      )}
      {/* NEARBY PLACES PANEL — only nearby places, no property button */}
      {nearbyPlaces.length > 0 && (
        <div className="absolute top-4 right-4 z-20 w-64 max-h-[90%] hidden md:flex flex-col gap-3">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">

            <div className="flex items-center mb-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <MapPin size={16} className="text-red-500" /> Nearby Places
              </h4>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {nearbyPlaces.map((place, idx) => {
                const valid = isEmbedUrl(place.googleMapLink);
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveLocation(place)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                      activeLocation?.name === place.name
                        ? "bg-slate-900 border-slate-900 shadow-lg translate-x-[-4px]"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold truncate max-w-[120px] ${
                        activeLocation?.name === place.name ? "text-white" : "text-slate-800"
                      }`}>
                        {place.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {!valid && (
                          <span title="Non-embeddable link" className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-semibold">
                            ext
                          </span>
                        )}
                        {place.distance && (
                          <span className={`text-[10px] font-mono ${
                            activeLocation?.name === place.name ? "text-slate-400" : "text-slate-500"
                          }`}>
                            {place.distance}
                          </span>
                        )}
                      </div>
                    </div>
                    {place.type && (
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                        activeLocation?.name === place.name ? "text-blue-400" : "text-blue-600"
                      }`}>
                        {place.type}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}