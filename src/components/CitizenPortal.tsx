'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ComplaintCategory, Complaint } from '@/types';
import {
  Trash2,
  Waves,
  Droplets,
  Lightbulb,
  Camera,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  FileCheck2,
  AlertCircle,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function CitizenPortal() {
  const {
    t,
    language,
    complaints,
    addComplaint,
    verifyComplaint,
    activeTab,
    setActiveTab,
    currentUser,
    setSelectedComplaint,
  } = useApp();

  // Reporting Form State
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>('DRINKING_WATER');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState('Ward 3 (రామాలయం వీధి)');
  const [landmark, setLandmark] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Verification & Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);

  // Filter for My Complaints
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const wards = [
    'Ward 1 (గాంధీ నగర్ / Gandhi Nagar)',
    'Ward 2 (పాఠశాల రోడ్ / School Road)',
    'Ward 3 (రామాలయం వీధి / Ramalayam Street)',
    'Ward 4 (రైతు బజార్ వీధి / Rythu Bazaar)',
    'Ward 5 (కొత్త పేట / Kotha Peta)',
    'Ward 6 (హరిజన వాడ / Ambedkar Colony)',
    'Ward 7 (కాలువ గట్టు / Canal Bund)',
  ];

  const categoryIcons: Record<ComplaintCategory, { icon: React.ReactNode; color: string; bg: string }> = {
    SANITATION: {
      icon: <Trash2 className="w-6 h-6" />,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    },
    DRAINAGE: {
      icon: <Waves className="w-6 h-6" />,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
    },
    DRINKING_WATER: {
      icon: <Droplets className="w-6 h-6" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    },
    STREETLIGHTS: {
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
    },
  };

  const handleSimulateGps = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsCoordinates({
        lat: 16.5065 + (Math.random() - 0.5) * 0.005,
        lng: 80.6480 + (Math.random() - 0.5) * 0.005,
      });
      setGpsLoading(false);
    }, 800);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const newComp = await addComplaint({
        category: selectedCategory,
        title: title || `${t.categories[selectedCategory]} Issue`,
        description,
        ward,
        landmark: landmark || 'Near Main Road',
        photoUrl: photoPreview || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60',
        latitude: gpsCoordinates?.lat,
        longitude: gpsCoordinates?.lng,
      });
      setSubmittedComplaint(newComp);
      // reset form
      setTitle('');
      setDescription('');
      setLandmark('');
      setPhotoPreview('');
      setGpsCoordinates(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const myComplaints = complaints.filter(
    (c) =>
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && (c.status === 'PENDING' || c.status === 'REVIEWED')) ||
      (statusFilter === 'IN_PROGRESS' && (c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS')) ||
      (statusFilter === 'COMPLETED' && (c.status === 'COMPLETED' || c.status === 'VERIFIED_CLOSED'))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      {activeTab === 'home' && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 p-6 md:p-8 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-sm border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'te' ? 'పౌరుల సేవా కేంద్రం' : 'GramConnect Citizen Services'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {language === 'te'
                ? `నమస్కారం, ${currentUser.name} గారూ!`
                : `Welcome, ${currentUser.name}!`}
            </h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
              {language === 'te'
                ? 'మీ వార్డు లేదా గ్రామంలో పారిశుధ్యం, తాగునీరు, డ్రైనేజ్ లేదా వీధి దీపాల సమస్య ఉందా? ఫోటో తీసి నివేదించండి. పంచాయతీ సిబ్బంది తక్షణమే పరిష్కరిస్తారు.'
                : 'Report village issues directly to the Panchayat Secretary. Track real-time progress from assignment to photographic verification.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('report')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                <span>✍️ {t.navReport}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('my-complaints')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all text-sm"
              >
                📋 {t.navMyComplaints} ({complaints.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Category Quick Launch Cards */}
      {(activeTab === 'home' || activeTab === 'report') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'te' ? 'సమస్య కేటగిరీని ఎంచుకోండి' : 'Choose Complaint Category'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'te'
                  ? 'సమస్యకు సరిపోయే విభాగాన్ని ఎంచుకుని ఫిర్యాదు నమోదు చేయండి'
                  : 'Select the area of concern to initiate an on-ground work order'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['DRINKING_WATER', 'STREETLIGHTS', 'SANITATION', 'DRAINAGE'] as ComplaintCategory[]).map((cat) => {
              const active = selectedCategory === cat;
              const meta = categoryIcons[cat];
              return (
                <div
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (activeTab === 'home') setActiveTab('report');
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    active
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm scale-101'
                      : `${meta.bg} border-slate-200`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg bg-white shadow-xs ${meta.color}`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{t.categories[cat]}</h3>
                      <span className="text-[11px] font-medium text-slate-500">
                        {language === 'te' ? 'ఫిర్యాదు చేయండి' : 'Click to Report'}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-slate-600 leading-snug">
                    {t.categoryDesc[cat]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Report Form Wizard */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-7 shadow-xs">
          {submittedComplaint ? (
            /* Success confirmation screen */
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t.complaintSuccess}</h3>
                <p className="text-sm text-slate-600 mt-1">{t.keepForTracking}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                  {t.complaintIdNotice}
                </p>
                <p className="text-2xl font-black text-emerald-700 tracking-wider my-1">
                  {submittedComplaint.id}
                </p>
                <div className="text-xs text-slate-600 flex justify-center gap-4 mt-2">
                  <span>📂 {t.categories[submittedComplaint.category]}</span>
                  <span>📍 {submittedComplaint.ward}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setSelectedComplaint(submittedComplaint);
                    setActiveTab('my-complaints');
                    setSubmittedComplaint(null);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm"
                >
                  🔍 {t.trackStatusBtn}
                </button>
                <button
                  onClick={() => setSubmittedComplaint(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm"
                >
                  + {language === 'te' ? 'మరొక సమస్య నివేదించండి' : 'Report Another Issue'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitComplaint} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>✍️ {t.reportTitle}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    {t.categories[selectedCategory]}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t.reportSubtitle}</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Ward Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.wardNumber} *
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  >
                    {wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.landmark} *
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'ఉదా: రామాలయం ఎదురుగా, పోల్ #14 వద్ద'
                        : 'e.g. Opposite Ramalayam Gate, Near Pole #14'
                    }
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Issue Summary */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.issueTitle}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'ఉదా: తాగునీటి పైప్‌లైన్ లీకేజీ / లైట్ వెలగడం లేదు'
                        : 'e.g. Water pipeline leaking / Streetlight bulb dead'
                    }
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Detailed Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.issueDesc} *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'సమస్య ఎప్పటి నుండి ఉంది? ఎంత తీవ్రంగా ఉంది? వివరాలు రాయండి...'
                        : 'How long has this issue existed? Any safety hazard? Please explain...'
                    }
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Photo Upload & Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    📷 {t.uploadPhoto}
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                    {photoPreview ? (
                      <div className="space-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreview}
                          alt="Evidence preview"
                          className="h-36 w-full object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview('')}
                          className="text-xs text-red-600 font-semibold hover:underline"
                        >
                          {language === 'te' ? 'ఫోటో తొలగించండి' : 'Remove Photo'}
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs text-slate-600 font-medium block">
                          {language === 'te'
                            ? 'కెమెరాతో ఫోటో తీయండి లేదా గ్యాలరీ నుండి ఎంచుకోండి'
                            : 'Click to capture or upload photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* GPS Location Capture */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    📍 {t.useMyLocation}
                  </label>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between h-[120px]">
                    <div>
                      {gpsCoordinates ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>
                            {gpsCoordinates.lat.toFixed(5)}° N, {gpsCoordinates.lng.toFixed(5)}° E
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          {language === 'te'
                            ? 'ఫీల్డ్ వర్కర్ ఖచ్చితమైన స్థలానికి చేరుకోవడానికి GPS ఉపయోగపడుతుంది'
                            : 'Enables field worker to accurately locate the exact spot on village map'}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateGps}
                      disabled={gpsLoading}
                      className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>
                        {gpsLoading
                          ? language === 'te'
                            ? 'లొకేషన్ శోధిస్తోంది...'
                            : 'Detecting GPS...'
                          : gpsCoordinates
                          ? language === 'te'
                            ? 'లొకేషన్ రిఫ్రెష్ చేయండి'
                            : 'Refresh GPS'
                          : t.useMyLocation}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{t.submitting}</span>
                  ) : (
                    <>
                      <span>{t.submitComplaint}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* My Complaints & Status Tracking View */}
      {(activeTab === 'home' || activeTab === 'my-complaints') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                📋 {t.navMyComplaints}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'te'
                  ? 'మీరు నమోదు చేసిన సమస్యల పురోగతి మరియు పరిష్కార నివేదికలు'
                  : 'Track lifecycle progress from Panchayat assignment to photographic verification'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
              {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL'
                    ? language === 'te' ? 'అన్నీ' : 'All'
                    : st === 'PENDING'
                    ? language === 'te' ? 'సమీక్షలో' : 'Pending'
                    : st === 'IN_PROGRESS'
                    ? language === 'te' ? 'జరుగుతున్నవి' : 'In Progress'
                    : language === 'te' ? 'పూర్తయినవి' : 'Resolved'}
                </button>
              ))}
            </div>
          </div>

          {/* Grievances List */}
          <div className="space-y-3">
            {myComplaints.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">{t.noComplaintsFound}</p>
                <button
                  onClick={() => setActiveTab('report')}
                  className="mt-3 text-xs bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg"
                >
                  + {t.navReport}
                </button>
              </div>
            ) : (
              myComplaints.map((item) => {
                const isCompletedAwaitingVerification =
                  item.status === 'COMPLETED' && !item.closedAt;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Left: Category Badge & Details */}
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                          {categoryIcons[item.category].icon}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {item.id}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {t.categories[item.category]}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === 'VERIFIED_CLOSED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'COMPLETED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.status === 'IN_PROGRESS' || item.status === 'ASSIGNED'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {t.statuses[item.status]}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 mt-1">
                            {language === 'te' && item.titleTe ? item.titleTe : item.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500" />
                              {item.ward} • {item.landmark}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            {item.assignedWorkerName && (
                              <span className="text-amber-800 font-medium">
                                👷 {item.assignedWorkerName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => setSelectedComplaint(item)}
                          className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                        >
                          <span>{t.trackStatusBtn}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {isCompletedAwaitingVerification && (
                          <button
                            onClick={() => setActiveFeedbackId(activeFeedbackId === item.id ? null : item.id)}
                            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{language === 'te' ? 'ధృవీకరించండి' : 'Verify & Rate'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Citizen Verification & Feedback Accordion */}
                    {activeFeedbackId === item.id && (
                      <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-800">
                            ⭐ {t.satisfactionFeedback}
                          </h5>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {language === 'te' ? 'సిబ్బంది పని పూర్తయింది' : 'Worker marked task complete'}
                          </span>
                        </div>

                        {/* Star Rating */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            {t.rateResolution}
                          </label>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setFeedbackRating(s)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    s <= feedbackRating
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comments */}
                        <div>
                          <input
                            type="text"
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            placeholder={
                              language === 'te'
                                ? 'పని సంతృప్తికరంగా ఉందా? లేదా ఇంకా ఏమైనా సమస్య మిగిలి ఉందా?'
                                : 'Was the work satisfactory? Any remaining remarks?'
                            }
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => {
                              verifyComplaint(item.id, false, feedbackRating, feedbackComment);
                              setActiveFeedbackId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                          >
                            ❌ {t.reopenRequest}
                          </button>
                          <button
                            onClick={() => {
                              verifyComplaint(item.id, true, feedbackRating, feedbackComment);
                              setActiveFeedbackId(null);
                            }}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs"
                          >
                            ✓ {t.verifyAndClose}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
