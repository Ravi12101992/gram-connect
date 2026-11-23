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
  CheckCircle2,
  Navigation,
  Check,
  Wrench,
  ShieldCheck,
  Building2,
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
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: 16.5065,
    lng: 80.6480,
  });
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

  // Visual Category Grid matching Screenshot 6
  const categoryCards: {
    id: ComplaintCategory;
    titleEn: string;
    titleTe: string;
    icon: React.ReactNode;
    iconBg: string;
  }[] = [
    {
      id: 'SANITATION',
      titleEn: 'Sanitation',
      titleTe: 'పారిశుధ్యం',
      icon: (
        <div className="text-emerald-700">
          <Trash2 className="w-10 h-10" />
        </div>
      ),
      iconBg: 'bg-emerald-50 text-emerald-800',
    },
    {
      id: 'DRAINAGE',
      titleEn: 'Drainage',
      titleTe: 'మురుగు కాలువలు',
      icon: (
        <div className="text-teal-700">
          <Waves className="w-10 h-10" />
        </div>
      ),
      iconBg: 'bg-teal-50 text-teal-800',
    },
    {
      id: 'DRINKING_WATER',
      titleEn: 'Drinking Water',
      titleTe: 'రక్షిత తాగునీరు',
      icon: (
        <div className="text-blue-600">
          <Droplets className="w-10 h-10" />
        </div>
      ),
      iconBg: 'bg-blue-50 text-blue-800',
    },
    {
      id: 'STREETLIGHTS',
      titleEn: 'Streetlights',
      titleTe: 'వీధి దీపాలు',
      icon: (
        <div className="text-orange-500">
          <Lightbulb className="w-10 h-10" />
        </div>
      ),
      iconBg: 'bg-orange-50 text-orange-600',
    },
  ];

  const handleSimulateGps = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsCoordinates({
        lat: 16.5065 + (Math.random() - 0.5) * 0.005,
        lng: 80.6480 + (Math.random() - 0.5) * 0.005,
      });
      setGpsLoading(false);
    }, 600);
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
        photoUrl:
          photoPreview ||
          'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60',
        latitude: gpsCoordinates?.lat,
        longitude: gpsCoordinates?.lng,
      });
      setSubmittedComplaint(newComp);
      setTitle('');
      setDescription('');
      setLandmark('');
      setPhotoPreview('');
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
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* SECTION 1: REPORT VILLAGE ISSUES (Matching Screenshot 6) */}
      {(activeTab === 'home' || activeTab === 'report') && (
        <div className="space-y-6">
          {/* Header Title (Green & Orange) */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">
              Report Village Issues
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mt-1">
              సమస్యలను నివేదించండి
            </h2>
          </div>

          {/* 4 Category 2x2 Grid (Matching Screenshot 6) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
            {categoryCards.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (activeTab === 'home') setActiveTab('report');
                  }}
                  className={`relative p-5 sm:p-6 bg-white rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg ${
                    active
                      ? 'border-emerald-600 ring-4 ring-emerald-500/20 scale-102'
                      : 'border-slate-200/90 hover:border-emerald-300'
                  }`}
                >
                  {/* Category Illustration Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-3">
                    {cat.icon}
                  </div>

                  <span className="text-base sm:text-lg font-black text-slate-800">
                    {cat.titleEn}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-orange-500 mt-0.5">
                    {cat.titleTe}
                  </span>

                  {/* Active Green Check */}
                  {active && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: SNAP PHOTO, GPS & SUBMIT (Matching Screenshots 4 & 7) */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-[36px] border border-slate-200 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6">
          {submittedComplaint ? (
            /* Instant ID Generated Screen (Screenshot 4) */
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              {/* Green Pill Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 text-white rounded-full font-bold text-sm shadow-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>✓ Complaint ID Generated</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {language === 'te' ? 'ఫిర్యాదు విజయవంతంగా నమోదైంది!' : 'Grievance Registered Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {language === 'te'
                    ? 'మీ ఫిర్యాదు పంచాయతీ కార్యదర్శికి చేరింది. పురోగతిని లైవ్‌గా ట్రాక్ చేయండి.'
                    : 'Your grievance has been dispatched to Panchayat Admin for review and worker assignment.'}
                </p>
              </div>

              <div className="bg-orange-50/60 border border-orange-200 p-5 rounded-3xl max-w-sm mx-auto">
                <span className="text-xs uppercase font-extrabold text-orange-800 tracking-wider">
                  Complaint ID
                </span>
                <p className="text-3xl font-black text-orange-600 tracking-wider my-1">
                  {submittedComplaint.id}
                </p>
                <div className="flex justify-center gap-3 text-xs text-slate-600 mt-2">
                  <span>📂 {t.categories[submittedComplaint.category]}</span>
                  <span>📍 {submittedComplaint.ward.split('(')[0]}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedComplaint(submittedComplaint);
                    setActiveTab('my-complaints');
                    setSubmittedComplaint(null);
                  }}
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-lg shadow-orange-500/25 transition-all"
                >
                  🔍 {language === 'te' ? 'స్టేటస్ ట్రాక్ చేయండి' : 'Track Status'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedComplaint(null)}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-full transition-all"
                >
                  + {language === 'te' ? 'మరొక సమస్య నివేదించండి' : 'Report Another Issue'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitComplaint} className="space-y-6">
              {/* Header: Snap & Upload Photo (Screenshot 7) */}
              <div className="text-center border-b border-slate-100 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-500">
                  Snap & Upload Photo
                </h2>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-0.5">
                  ఫోటో తీసి అప్‌లోడ్ చేయండి
                </h3>
              </div>

              {/* Camera Viewfinder Overlay (Screenshot 7) */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-300 aspect-video flex items-center justify-center group">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-slate-800/90 text-white">
                    {/* Corner viewfinder brackets */}
                    <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl pointer-events-none"></div>
                    <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-xl pointer-events-none"></div>

                    <label className="cursor-pointer flex flex-col items-center justify-center">
                      {/* Green Circular Camera Shutter Button (Screenshot 7) */}
                      <div className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-all mb-2">
                        <Camera className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        {language === 'te' ? 'ఫోటో తీయండి' : 'Tap to Capture Evidence'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setPhotoPreview('')}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs"
                  >
                    Change Photo
                  </button>
                )}
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                {/* Description Input (Screenshot 7 style) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === 'te' ? 'సమస్య వివరణ' : 'Describe the Issue'} *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      language === 'te'
                        ? 'సమస్య వివరాలు, ఎక్కడ ఉంది మరియు ఎంత తీవ్రంగా ఉందో రాయండి...'
                        : 'Describe the problem clearly for field workers to locate...'
                    }
                    className="w-full text-sm rounded-2xl border border-slate-300 p-3.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ward */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {language === 'te' ? 'వార్డు / వీధి' : 'Ward / Street'} *
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full text-xs font-semibold rounded-2xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {language === 'te' ? 'గుర్తు / ల్యాండ్‌మార్క్' : 'Landmark'}
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder={
                        language === 'te'
                          ? 'ఉదా: రామాలయం ఎదురుగా, పోల్ #12'
                          : 'e.g. Opposite temple, near pole #12'
                      }
                      className="w-full text-xs font-semibold rounded-2xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Auto GPS Location Capture (Screenshot 4) */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        Auto GPS: {gpsCoordinates?.lat.toFixed(4)}° N, {gpsCoordinates?.lng.toFixed(4)}° E
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Accuracy: ~5 meters (Ramachandrapuram)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateGps}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                  >
                    {gpsLoading ? 'Detecting...' : 'Refresh GPS'}
                  </button>
                </div>
              </div>

              {/* Big Vibrant Orange Pill Button: Submit Complaint / Next > */}
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-base rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                {isSubmitting ? (
                  <span>{language === 'te' ? 'నమోదవుతోంది...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <span>{language === 'te' ? 'సమస్యను సమర్పించండి (Submit Complaint)' : 'Submit Complaint'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* SECTION 3: FAST PANCHAYAT ACTION & TRACKING (Matching Screenshots 3 & 5) */}
      {(activeTab === 'home' || activeTab === 'my-complaints') && (
        <div className="space-y-6">
          {/* Header (Screenshot 3 style) */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-500">
              Fast Panchayat Action
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-0.5">
              పంచాయతీ తక్షణ చర్య
            </h3>
          </div>

          {/* Filters Bar */}
          <div className="flex justify-center">
            <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200">
              {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL'
                    ? language === 'te' ? 'అన్నీ (All)' : 'All'
                    : st === 'PENDING'
                    ? language === 'te' ? 'సమీక్ష' : 'Pending'
                    : st === 'IN_PROGRESS'
                    ? language === 'te' ? 'జరుగుతున్నవి' : 'In Progress'
                    : language === 'te' ? 'పరిష్కారం' : 'Completed'}
                </button>
              ))}
            </div>
          </div>

          {/* Grievances Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myComplaints.map((item) => {
              const isClosed = item.status === 'VERIFIED_CLOSED';
              const isCompleted = item.status === 'COMPLETED';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-md hover:shadow-lg transition-all space-y-4"
                >
                  {/* Top Line: ID & Category */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                      {item.id}
                    </span>

                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        isClosed
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : isCompleted
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-orange-500 text-white shadow-xs'
                      }`}
                    >
                      {item.status === 'VERIFIED_CLOSED'
                        ? '✓ Completed & Verified'
                        : item.status === 'COMPLETED'
                        ? 'Completed'
                        : item.status === 'IN_PROGRESS'
                        ? 'Work In Progress'
                        : 'Reviewed'}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      {language === 'te' && item.titleTe ? item.titleTe : item.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{item.ward} • {item.landmark}</span>
                    </p>
                  </div>

                  {/* Step Action Cards (Matching Screenshot 3) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {/* Reviewed */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Reviewed</span>
                      </span>
                      <div className="w-24 h-2 bg-emerald-600 rounded-full"></div>
                    </div>

                    {/* Worker Assigned */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                        <span>Worker Assigned ({item.assignedWorkerName ? item.assignedWorkerName.split('(')[0] : 'Pending'})</span>
                      </span>
                      <div
                        className={`w-24 h-2 rounded-full ${
                          item.assignedWorkerName ? 'bg-orange-500' : 'bg-slate-200'
                        }`}
                      ></div>
                    </div>

                    {/* Work in Progress */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-emerald-600" />
                        <span>Work In Progress</span>
                      </span>
                      <div
                        className={`w-24 h-2 rounded-full ${
                          item.status === 'IN_PROGRESS' || item.status === 'COMPLETED' || isClosed
                            ? 'bg-emerald-600'
                            : 'bg-slate-200'
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Before / After Preview if Completed (Screenshot 5) */}
                  {isCompleted && (
                    <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-900">
                          ✓ Completed & Verified
                        </span>
                        <div className="flex text-orange-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative rounded-xl overflow-hidden h-20 border">
                          <img
                            src={item.photoUrl || ''}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 bg-white/90 text-[10px] font-bold px-1.5 rounded">
                            Before
                          </span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden h-20 border border-emerald-400">
                          <img
                            src={item.completionPhotoUrl || ''}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 bg-white/90 text-emerald-800 text-[10px] font-bold px-1.5 rounded">
                            After
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View Details Action Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(item)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-800 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'te' ? 'వివరాలు & ఫోటోలు చూడండి' : 'View Full Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
