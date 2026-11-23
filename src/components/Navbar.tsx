'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import AppLogo from '@/components/AppLogo';
import {
  Globe,
  ShieldCheck,
  User,
  Wrench,
  Building2,
  FileText,
  MapPin,
  Megaphone,
  PhoneCall,
  LayoutDashboard,
  CheckCircle2,
  Menu,
  X,
  LogOut,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const {
    language,
    setLanguage,
    t,
    role,
    setRole,
    currentUser,
    activeTab,
    setActiveTab,
    logout,
    setShowAuthModal,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const roles: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'CITIZEN',
      label: language === 'te' ? 'పౌరుడు (Citizen)' : 'Citizen',
      icon: <User className="w-4 h-4" />,
      color: 'bg-emerald-700 text-white shadow-xs',
    },
    {
      id: 'ADMIN',
      label: language === 'te' ? 'పంచాయతీ (Admin)' : 'Panchayat Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-orange-600 text-white shadow-xs',
    },
    {
      id: 'FIELD_WORKER',
      label: language === 'te' ? 'ఫీల్డ్ వర్కర్ (Worker)' : 'Field Worker',
      icon: <Wrench className="w-4 h-4" />,
      color: 'bg-teal-700 text-white shadow-xs',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-sm">
      {/* Top Banner Bar - Tricolor Theme (Deep Green with Saffron / White Accents) */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
            <span className="font-bold text-white">{t.villageName}</span>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <span className="hidden sm:inline font-semibold text-orange-300">
              {t.motto}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher Capsule */}
            <div className="flex items-center bg-black/25 rounded-full p-0.5 border border-white/20">
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                  language === 'te'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-white hover:text-orange-200'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-white hover:text-orange-200'
                }`}
              >
                English
              </button>
            </div>

            {/* OTP Switcher */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-white hover:text-orange-300 bg-white/10 hover:bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 transition-colors"
            >
              <KeyRound className="w-3 h-3 text-orange-400" />
              <span>{language === 'te' ? 'OTP లాగిన్' : 'OTP Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo with New Emblem */}
        <div
          onClick={() =>
            setActiveTab(
              role === 'ADMIN'
                ? 'admin-dashboard'
                : role === 'FIELD_WORKER'
                ? 'worker-tasks'
                : 'home'
            )
          }
          className="cursor-pointer group flex items-center"
        >
          <AppLogo size="sm" layout="row" showSubtitle={false} />
        </div>

        {/* Role Switcher (Desktop) */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200 gap-1">
          <span className="text-[11px] font-bold text-slate-500 px-2.5 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {language === 'te' ? 'పాత్ర:' : 'Role:'}
          </span>
          {roles.map((r) => {
            const active = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  if (r.id === 'ADMIN') setActiveTab('admin-dashboard');
                  else if (r.id === 'FIELD_WORKER') setActiveTab('worker-tasks');
                  else setActiveTab('home');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  active
                    ? `${r.color} shadow-sm scale-102`
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current User Badge & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                {currentUser.name.split('(')[0]}
              </span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  role === 'ADMIN'
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : role === 'FIELD_WORKER'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {role}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              +91 {currentUser.phone}
            </span>
          </div>

          <button
            onClick={logout}
            title={language === 'te' ? 'లాగౌట్' : 'Logout'}
            className="hidden sm:flex items-center gap-1 px-3 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar (White, Green, Orange Accents) */}
      <div className="border-t border-slate-100 bg-slate-50/90 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
          {/* Citizen Options */}
          {role === 'CITIZEN' && (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'home'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                {t.navHome}
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'report'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                ✍️ {t.navReport}
              </button>
              <button
                onClick={() => setActiveTab('my-complaints')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'my-complaints'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                📋 {t.navMyComplaints}
              </button>
            </>
          )}

          {/* Admin Navigation */}
          {role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 inline mr-1" />
                {t.navAdminDashboard}
              </button>
            </>
          )}

          {/* Worker Navigation */}
          {role === 'FIELD_WORKER' && (
            <>
              <button
                onClick={() => setActiveTab('worker-tasks')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'worker-tasks'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 inline mr-1" />
                {t.navWorkerTasks}
              </button>
            </>
          )}

          {/* Common Village Resources */}
          <button
            onClick={() => setActiveTab('village-map')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'village-map'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
            {t.navVillageMap}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'projects'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            {t.navProjects}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'announcements'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
            {t.navAnnouncements}
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'emergency'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            {t.navEmergency}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="font-bold text-sm text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-500 font-mono">+91 {currentUser.phone}</p>
            </div>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>{t.logout}</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {language === 'te' ? 'యూజర్ రోల్ మార్చండి:' : 'Switch Role:'}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                    if (r.id === 'ADMIN') setActiveTab('admin-dashboard');
                    else if (r.id === 'FIELD_WORKER') setActiveTab('worker-tasks');
                    else setActiveTab('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold ${
                    role === r.id ? r.color : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setShowAuthModal(true);
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 bg-orange-50 text-orange-800 font-bold text-xs rounded-full border border-orange-200 flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-orange-600" />
            <span>{language === 'te' ? 'OTP లాగిన్ తెరవండి' : 'Open OTP Login Screen'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
