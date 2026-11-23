'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { initialAnnouncements } from '@/lib/store';
import { Megaphone, AlertCircle, Calendar, MapPin, Bell } from 'lucide-react';

export default function AnnouncementsView() {
  const { t, language } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-amber-900 via-yellow-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-500/30">
            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'te' ? 'అధికారిక గ్రామ పంచాయతీ నోటీసులు' : 'Official Grama Panchayat Notices'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black mt-1.5">{t.navAnnouncements}</h1>
          <p className="text-xs md:text-sm text-amber-100 mt-0.5">
            {language === 'te'
              ? 'తాగునీటి సరఫరా వేళలు, గ్రామ సభ సమావేశాలు, పారిశుధ్య కార్యక్రమాల తాజా సమాచారం'
              : 'Direct circulars and urgent alerts regarding civic amenities, water schedules, and health drives'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {initialAnnouncements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    a.priority === 'URGENT'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {a.priority === 'URGENT' ? '🚨 URGENT NOTICE' : '📢 NOTICE'}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {a.category}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {a.ward}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900">
                {language === 'te' ? a.titleTe : a.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'te' ? a.contentTe : a.content}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {a.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
