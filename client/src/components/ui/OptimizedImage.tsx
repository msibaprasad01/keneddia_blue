import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Assuming utils exists, otherwise I'll stick to class string management or standard template literals if cn not found. I'll check if lib/utils exists. Standard shadcn structure usually has it. 

// Fallback to simple class join if cn is not guaranteed, but I saw 'ui' folder so likely shadcn.
// I'll check existence of lib/utils in a moment. For now I will write without it to be safe or use a local helper.

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false, // Default to lazy
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [src, priority]);

  return (
    <div className={classNames("relative overflow-hidden bg-gray-200", className)}>
      {/* SKELETON / BLUR PLACEHOLDER */}
      <div
        className={classNames(
          "absolute inset-0 bg-gray-300 animate-pulse transition-opacity duration-700",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      />

      {/* ACTUAL IMAGE */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setIsLoaded(true)}
        className={classNames(
          "w-full h-full object-cover transition-opacity duration-700",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        {...props}
      />
    </div>
  );
};
