import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const isDark = variant === 'dark'; // on light background (dark maroon & gold text)
  const isLight = variant === 'light'; // on dark background (ivory & gold text)

  const sizeClasses = {
    sm: {
      emblem: 'w-7 h-7 text-xs',
      title: 'text-lg tracking-widest',
      tagline: 'text-[9px] tracking-wider',
    },
    md: {
      emblem: 'w-9 h-9 text-sm',
      title: 'text-xl sm:text-2xl tracking-[0.18em]',
      tagline: 'text-[10px] tracking-[0.25em]',
    },
    lg: {
      emblem: 'w-12 h-12 text-base',
      title: 'text-2xl sm:text-3xl tracking-[0.2em]',
      tagline: 'text-xs tracking-[0.3em]',
    },
    xl: {
      emblem: 'w-16 h-16 text-xl',
      title: 'text-3xl sm:text-4xl tracking-[0.22em]',
      tagline: 'text-sm tracking-[0.35em]',
    },
  }[size];

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Handcrafted Royal Gold Medallion with Lotus Motif */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-full border transition-all duration-300 ${sizeClasses.emblem} ${
          isLight
            ? 'border-[#C5A059] bg-[#420A16] text-[#F3DEAB] shadow-[0_0_15px_rgba(197,160,89,0.25)]'
            : 'border-[#C5A059]/70 bg-gradient-to-br from-[#540D1E] via-[#7A142A] to-[#360611] text-[#F3DEAB] shadow-md shadow-[#7A142A]/20 group-hover:border-[#C5A059]'
        }`}
      >
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 fill-current overflow-visible" aria-hidden="true">
          {/* Subtle Outer Laurel / Floral Ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#C5A059" strokeWidth="1.2" />

          {/* Saree Drape Silhouette Curve */}
          <path
            d="M30 65 Q45 40 55 22 Q65 42 70 65 Q50 55 30 65 Z"
            fill="#D8B26E"
            opacity="0.25"
          />

          {/* Monogram KK */}
          <text
            x="50%"
            y="54%"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="44"
            fontWeight="bold"
            fill="#F3DEAB"
            letterSpacing="-1"
          >
            KK
          </text>

          {/* Tiny auspicious lotus icon at bottom */}
          <path
            d="M50 78 C46 72, 40 76, 44 82 C48 83, 50 85, 50 86 C50 85, 52 83, 56 82 C60 76, 54 72, 50 78 Z"
            fill="#C5A059"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div
          className={`font-serif font-bold uppercase transition-colors ${sizeClasses.title} ${
            isLight ? 'text-[#FAF8F5] group-hover:text-[#F3DEAB]' : 'text-[#540D1E] group-hover:text-[#7A142A]'
          }`}
        >
          KK COLLECTION
        </div>
        {showTagline && (
          <div
            className={`font-serif italic font-medium uppercase ${sizeClasses.tagline} ${
              isLight ? 'text-[#C5A059]' : 'text-[#8A6D3B]'
            }`}
          >
            Every Drape, A Story.
          </div>
        )}
      </div>
    </div>
  );
};
