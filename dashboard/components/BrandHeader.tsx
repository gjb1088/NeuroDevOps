// dashboard/components/BrandHeader.tsx
import Image from 'next/image';
import branding from '../config/branding';

export default function BrandHeader() {
  return (
    <header className="flex items-center space-x-4 p-6">
      <Image
        src={branding.logoPath}
        alt="Burn.IT logo"
        width={48}
        height={48}
      />
      <h1
        className="
          text-5xl lg:text-6xl
          font-bold
          text-brand
          drop-shadow-neon
          flicker
        "
      >
        {branding.name} NeuroDevOps
      </h1>
    </header>
  );
}
