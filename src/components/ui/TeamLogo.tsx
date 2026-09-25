import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TeamLogoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function TeamLogo({ src, alt, size = 24, className }: TeamLogoProps) {
  return (
    <div
      className={cn('shrink-0 relative', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
        unoptimized
      />
    </div>
  );
}
