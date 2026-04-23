import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt = "",
  className,
  wrapperClassName,
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasSrc = typeof src === "string" && src.trim().length > 0;

  useEffect(() => {
    if (priority && hasSrc) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [src, priority, hasSrc]);

  return (
    <div className={`absolute inset-0 bg-gray-200 ${wrapperClassName || ""}`}>
      {/* Skeleton */}
      <div
        className={`absolute inset-0 bg-gray-300 animate-pulse transition-opacity duration-700 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {!hasSrc ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-xs font-medium uppercase tracking-wide text-gray-500">
          No image
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-700",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          {...props}
        />
      )}
    </div>
  );
};
