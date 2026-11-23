import { Scissors } from 'lucide-react';
import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  title,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#141418] via-[#101013] to-[#09090B] text-center p-6 border border-[#F4F1EA]/10 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Scissors className="w-7 h-7 text-[#C8A464]/70 mb-3" strokeWidth={1.25} />
        {title && (
          <p className="font-serif text-lg text-[#F4F1EA]/90 tracking-wide">{title}</p>
        )}
        <p className="text-xs text-[#A19E95] mt-1">Marlowe Bespoke Archive</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
