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
      label: language === 'te' ? 'ఫిర్యాదు నమోదు' : 'Reported',
      done: true,
      date: new Date(c.createdAt).toLocaleDateString(),
    },
    {
      id: 'ASSIGNED',
      label: language === 'te' ? 'సిబ్బంది కేటాయింపు' : 'Assigned',
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
      label: language === 'te' ? 'పని పూర్తి' : 'Completed',
      done: c.status === 'COMPLETED' || c.status === 'VERIFIED_CLOSED',
      date: c.completedAt ? new Date(c.completedAt).toLocaleDateString() : undefined,
    },
    {
      id: 'CLOSED',
      label: language === 'te' ? 'ధృవీకరించి ముగింపు' : 'Verified & Closed',
      done: c.status === 'VERIFIED_CLOSED',
      date: c.closedAt ? new Date(c.closedAt).toLocaleDateString() : undefined,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                {c.id}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {t.categories[c.category]}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.status === 'VERIFIED_CLOSED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : c.status === 'COMPLETED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {t.statuses[c.status]}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              {language === 'te' && c.titleTe ? c.titleTe : c.title}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {c.ward} • {c.landmark}
            </p>
          </div>

          <button
            onClick={() => setSelectedComplaint(null)}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Lifecycle Flowchart Progress Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            {language === 'te' ? 'సమస్య పరిష్కార ప్రవాహం (Complaint Lifecycle)' : 'Complaint Resolution Lifecycle'}
          </p>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-200 z-0"></div>
            {steps.map((st, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    st.done
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {st.done ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1.5 text-center whitespace-nowrap">
                  {st.label}
                </span>
                {st.date && (
                  <span className="text-[9px] text-slate-400">{st.date}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description & Metadata Grid */}
        <div className="space-y-3">
          <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border">
            <p className="font-semibold text-slate-800 mb-1">
              {language === 'te' ? 'సమస్య వివరాలు:' : 'Description:'}
            </p>
            {c.description}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'te' ? 'ఫిర్యాదుదారు' : 'Citizen'}
              </span>
              <span className="font-bold text-slate-800">{c.citizenName}</span>
              <span className="text-[11px] text-slate-500 block">{c.citizenPhone}</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'te' ? 'కేటాయించిన సిబ్బంది' : 'Assigned Staff'}
              </span>
              <span className="font-bold text-slate-800">
                {c.assignedWorkerName || 'Pending'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {c.assignedWorkerPhone || ''}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'te' ? 'గడువు తేదీ' : 'Target Due Date'}
              </span>
              <span className="font-bold text-amber-800">
                {c.targetDate || 'Not set'}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 block">
                Priority: {c.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Photos: Before & After Comparison */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800">
            {language === 'te' ? 'పరిష్కార ఆధారాలు (ఫోటోలు)' : 'Evidence & Verification'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-500">
                1. Citizen Original Photo
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.photoUrl || ''}
                alt="Citizen report"
                className="w-full h-36 object-cover rounded-xl border"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-emerald-700">
                2. Field Completion Photo
              </p>
              {c.completionPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.completionPhotoUrl}
                  alt="Worker completion"
                  className="w-full h-36 object-cover rounded-xl border border-emerald-300"
                />
              ) : (
                <div className="w-full h-36 bg-slate-100 rounded-xl border border-dashed flex items-center justify-center text-xs text-slate-400 p-3 text-center">
                  {language === 'te'
                    ? 'సిబ్బంది పని పూర్తి చేసి ఫోటో పెట్టాల్సి ఉంది'
                    : 'Awaiting worker completion photo'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Work Updates & Audit Trail */}
        {c.updates.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-800">
              {language === 'te' ? 'పురోగతి లాగ్‌లు (Audit Trail)' : 'Activity Logs'}
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {c.updates.map((u) => (
                <div
                  key={u.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start gap-2"
                >
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-700 shrink-0">
                    {new Date(u.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 mr-1">{u.workerName}:</span>
                    <span className="text-slate-600">{u.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section (if completed/verified) */}
        {c.feedbackRating && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Citizen Satisfaction Feedback
              </p>
              <p className="text-xs text-emerald-700 italic">
                &ldquo;{c.feedbackComment || 'Work resolved satisfactorily.'}&rdquo;
              </p>
            </div>
            <div className="flex gap-1 text-amber-500">
              {Array.from({ length: c.feedbackRating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-2 border-t flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-mono">
            GPS: {c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}
          </span>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs"
          >
            {t.back}
          </button>
        </div>
      </div>
    </div>
  );
}
