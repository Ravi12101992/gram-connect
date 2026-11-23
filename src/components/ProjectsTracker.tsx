'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { initialProjects } from '@/lib/store';
import {
  CheckCircle2,
  Calendar,
  IndianRupee,
  MapPin,
  TrendingUp,
  Tag,
  Building2,
} from 'lucide-react';

export default function ProjectsTracker() {
  const { t, language } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-teal-500/30">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'te' ? 'గ్రామాభివృద్ధి పారదర్శకత' : 'Transparent Village Development'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black mt-1.5">{t.navProjects}</h1>
          <p className="text-xs md:text-sm text-teal-100 mt-0.5">
            {language === 'te'
              ? 'గ్రామ పంచాయతీ మంజూరు చేసిన సీసీ రోడ్లు, డ్రైనేజీలు, సోలార్ లైట్లు, వాటర్ ప్లాంట్ బడ్జెట్ మరియు పురోగతి'
              : 'Public ledger of civil infrastructure projects, fund sources, budgets, and live progress'}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialProjects.map((p) => {
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="h-44 w-full relative bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photoUrl || ''}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                      p.status === 'COMPLETED'
                        ? 'bg-emerald-600 text-white'
                        : p.status === 'IN_PROGRESS'
                        ? 'bg-blue-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {t.projectStatuses[p.status]}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {p.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {language === 'te' ? p.titleTe : p.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {language === 'te' ? p.descriptionTe : p.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">
                      {language === 'te' ? 'పని పురోగతి:' : 'Progress:'}
                    </span>
                    <span className="text-emerald-700">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {language === 'te' ? 'బడ్జెట్' : 'Budget'}
                    </span>
                    <span className="font-black text-slate-900">
                      ₹{p.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {language === 'te' ? 'నిధుల వనరు' : 'Funding'}
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {p.fundingSource}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {p.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {p.timeline}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
