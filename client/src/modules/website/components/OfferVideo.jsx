import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

function OfferVideo({ src }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;

    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
      <video
        ref={videoRef}
        src={src}
        className="max-w-full max-h-full object-contain"
        autoPlay
        loop
        playsInline
        muted
      />

      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="absolute bottom-3 right-3 z-50 bg-black/70 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/90 transition shadow-lg"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}

export default OfferVideo;