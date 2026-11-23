'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  Shield,
  Star,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function ComplaintDetailModal() {
  const {
    t,
    language,
    selectedComplaint,
    setSelectedComplaint,
    role,
    verifyComplaint,
  } = useApp();

  if (!selectedComplaint) return null;

  const c = selectedComplaint;

  // Lifecycle steps for the flowchart tracker
  const steps = [
    {
      id: 'REPORTED',
      label: language === 'te' ? 'ఫిర్యాదు' : 'Reported',
      done: true,
      date: new Date(c.createdAt).toLocaleDateString(),
    },
    {
      id: 'ASSIGNED',
      label: language === 'te' ? 'కేటాయింపు' : 'Assigned',
      done: c.status !== 'PENDING',
      date: c.assignedAt ? new Date(c.assignedAt).toLocaleDateString() : undefined,
    },
    {
      id: 'IN_PROGRESS',
      label: language === 'te' ? 'పని ప్రారంభం' : 'In Progress',
      done:
        c.status === 'IN_PROGRESS' ||
        c.status === 'COMPLETED' ||
        c.status === 'VERIFIED_CLOSED',
    },
    {
      id: 'COMPLETED',
      label: language === 'te' ? 'పూర్తి' : 'Completed',
      done: c.status === 'COMPLETED' || c.status === 'VERIFIED_CLOSED',
      date: c.completedAt ? new Date(c.completedAt).toLocaleDateString() : undefined,
    },
    {
      id: 'CLOSED',
      label: language === 'te' ? 'పరిష్కారం' : 'Verified & Solved',
      done: c.status === 'VERIFIED_CLOSED',
      date: c.closedAt ? new Date(c.closedAt).toLocaleDateString() : undefined,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 border border-slate-200">
        {/* Header - White, Green, Orange Styling */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {c.id}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {t.categories[c.category]}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  c.status === 'VERIFIED_CLOSED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : c.status === 'COMPLETED'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-orange-500 text-white shadow-xs'
                }`}
              >
                {t.statuses[c.status]}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {language === 'te' && c.titleTe ? c.titleTe : c.title}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              {c.ward} • {c.landmark}
            </p>
          </div>

          <button
            onClick={() => setSelectedComplaint(null)}
            className="text-slate-400 hover:text-slate-700 font-bold text-xl p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Verified & Solved Badge (Matching Screenshot 5) */}
        {c.status === 'VERIFIED_CLOSED' && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 text-white text-xs font-extrabold rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>✓ Completed & Verified</span>
            </div>
            <div className="flex justify-center gap-1 text-orange-500">
              {Array.from({ length: c.feedbackRating || 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
              ))}
            </div>
            <p className="text-xs font-bold text-emerald-900">
              {language === 'te'
                ? 'సమస్య పంచాయతీ ద్వారా విజయవంతంగా పరిష్కరించబడింది!'
                : 'Issue has been successfully resolved & verified by the Panchayat!'}
            </p>
          </div>
        )}

        {/* Lifecycle Flowchart Progress Bar */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            {language === 'te'
              ? 'సమస్య పరిష్కార ప్రవాహం (Complaint Lifecycle)'
              : 'Complaint Resolution Lifecycle'}
          </p>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-200 z-0"></div>
            {steps.map((st, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    st.done
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-200'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {st.done ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1.5 text-center whitespace-nowrap">
                  {st.label}
                </span>
                {st.date && (
                  <span className="text-[9px] text-slate-400" suppressHydrationWarning>
                    {st.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description & Metadata Grid */}
        <div className="space-y-3">
          <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <p className="font-bold text-slate-800 mb-1">
              {language === 'te' ? 'సమస్య వివరాలు:' : 'Description:'}
            </p>
            {c.description}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'te' ? 'ఫిర్యాదుదారు' : 'Citizen'}
              </span>
              <span className="font-bold text-slate-900 block truncate">{c.citizenName}</span>
              <span className="text-[11px] text-slate-500 font-mono block">+91 {c.citizenPhone}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'te' ? 'కేటాయించిన సిబ్బంది' : 'Assigned Staff'}
              </span>
              <span className="font-bold text-slate-900 block truncate">
                {c.assignedWorkerName || 'Pending'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">
                {c.assignedWorkerPhone ? `+91 ${c.assignedWorkerPhone}` : ''}
              </span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'te' ? 'గడువు తేదీ' : 'Target Due Date'}
              </span>
              <span className="font-bold text-orange-600 block">
                {c.targetDate || 'Not set'}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block">
                Priority: {c.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Photos: Before & After Comparison (Matching Screenshot 5) */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800">
            {language === 'te' ? 'పరిష్కార ఆధారాలు (Before & After)' : 'Evidence & Photographic Verification'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Before Photo */}
            <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
              <img
                src={c.photoUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60'}
                alt="Before issue"
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                Before
              </div>
            </div>

            {/* After Photo */}
            <div className="relative group overflow-hidden rounded-2xl border border-slate-200 shadow-xs">
              {c.completionPhotoUrl ? (
                <>
                  <img
                    src={c.completionPhotoUrl}
                    alt="After completion"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                    After
                  </div>
                </>
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-xs text-slate-400 p-3 text-center">
                  <Clock className="w-6 h-6 text-slate-400 mb-1" />
                  <span>
                    {language === 'te'
                      ? 'సిబ్బంది పని పూర్తి చేసి ఫోటో పెట్టాల్సి ఉంది'
                      : 'Awaiting worker completion photo'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-mono">
            GPS: {c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}
          </span>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
}
