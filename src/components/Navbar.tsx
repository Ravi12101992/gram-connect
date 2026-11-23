'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
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
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t, role, setRole, currentUser, activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const roles: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'CITIZEN',
      label: language === 'te' ? 'పౌరుడు (Citizen)' : 'Citizen',
      icon: <User className="w-4 h-4" />,
      color: 'bg-emerald-600 text-white',
    },
    {
      id: 'ADMIN',
      label: language === 'te' ? 'అడ్మిన్ (Admin)' : 'Panchayat Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-indigo-600 text-white',
    },
    {
      id: 'FIELD_WORKER',
      label: language === 'te' ? 'ఫీల్డ్ వర్కర్ (Worker)' : 'Field Worker',
      icon: <Wrench className="w-4 h-4" />,
      color: 'bg-amber-600 text-white',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner / Govt. Brand Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t.villageName}</span>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <span className="hidden sm:inline italic text-emerald-200">{t.motto}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-black/20 rounded-full p-0.5 border border-white/20">
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  language === 'te' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white hover:text-amber-200'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  language === 'en' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white hover:text-amber-200'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">Gram<span className="text-emerald-700">Connect</span></span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                v1.0 MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'te' ? 'స్మార్ట్ గ్రామం · మెరుగైన జీవనం' : 'Smart Village · Better Living'}
            </p>
          </div>
        </div>

        {/* Role Switcher (Desktop) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
          <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

        {/* Current User Badge & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
            <span className="text-[11px] text-slate-500">{currentUser.ward || 'Panchayat Portal'}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
          {/* Citizen Options */}
          {role === 'CITIZEN' && (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'home'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                {t.navHome}
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'report'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                }`}
              >
                ✍️ {t.navReport}
              </button>
              <button
                onClick={() => setActiveTab('my-complaints')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'my-complaints'
                    ? 'bg-emerald-700 text-white shadow-sm'
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-indigo-700 text-white shadow-sm'
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'worker-tasks'
                    ? 'bg-amber-600 text-white shadow-sm'
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'village-map'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 inline mr-1 text-red-500" />
            {t.navVillageMap}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'projects'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
            {t.navProjects}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'announcements'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
            {t.navAnnouncements}
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'emergency'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
            {t.navEmergency}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-semibold ${
                  role === r.id ? r.color : 'bg-slate-100 text-slate-700'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
