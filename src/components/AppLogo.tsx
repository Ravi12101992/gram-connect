'use client';

import React from 'react';

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
  const emblemSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
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
        className={`relative ${emblemSizes[size]} rounded-full overflow-hidden shadow-md ring-2 ring-emerald-600/30 bg-white shrink-0 flex items-center justify-center p-0.5`}
      >
        <img
          src="/emblem.png"
          alt="GramConnect Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text: Telugu in Orange, English in Green */}
      <div className={layout === 'col' ? 'mt-2.5' : ''}>
        <div className="flex flex-col leading-tight">
          <span className={`${textSizes[size].te} text-orange-600 tracking-tight font-extrabold`}>
            గ్రామ్‌కనెక్ట్
          </span>
          <span className={`${textSizes[size].en} text-emerald-800 tracking-wide uppercase font-sans font-bold`}>
            GramConnect
          </span>
        </div>

        {showSubtitle && (
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            స్మార్ట్ గ్రామం · మన బాధ్యత
          </p>
        )}
      </div>
    </div>
  );
}
