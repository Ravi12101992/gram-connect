'use client';

import React from 'react';
import Image from 'next/image';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'col' | 'row';
  showSubtitle?: boolean;
}

export default function AppLogo({
  size = 'md',
  layout = 'col',
  showSubtitle = true,
}: AppLogoProps) {
  // Dimensions for the cropped emblem circle
  const emblemSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: { te: 'text-sm font-bold', en: 'text-xs font-semibold' },
    md: { te: 'text-base sm:text-lg font-black', en: 'text-xs sm:text-sm font-bold' },
    lg: { te: 'text-xl sm:text-2xl font-black', en: 'text-sm sm:text-base font-bold' },
    xl: { te: 'text-2xl sm:text-3xl font-black', en: 'text-base sm:text-lg font-extrabold' },
  };

  return (
    <div
      className={`flex items-center ${
        layout === 'col' ? 'flex-col text-center' : 'flex-row text-left gap-3'
      }`}
    >
      {/* Circular Emblem with Wheat & River Sunrise */}
      <div
        className={`relative ${emblemSizes[size]} rounded-full overflow-hidden shadow-md ring-2 ring-emerald-600/30 bg-white shrink-0 group`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="GramConnect Emblem"
            className="w-[140%] h-[140%] max-w-none object-cover -translate-y-[8%]"
          />
        </div>
      </div>

      {/* Brand Text: Telugu in Orange, English in Green */}
      <div className={layout === 'col' ? 'mt-2' : ''}>
        <div className="flex flex-col leading-tight">
          <span className={`${textSizes[size].te} text-orange-600 tracking-tight`}>
            గ్రామ్‌కనెక్ట్
          </span>
          <span className={`${textSizes[size].en} text-emerald-800 tracking-wide uppercase font-sans`}>
            GramConnect
          </span>
        </div>

        {showSubtitle && (
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            స్మార్ట్ గ్రామం · మెరుగైన జీవనం
          </p>
        )}
      </div>
    </div>
  );
}
