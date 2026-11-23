'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import CitizenPortal from '@/components/CitizenPortal';
import AdminPortal from '@/components/AdminPortal';
import FieldWorkerPortal from '@/components/FieldWorkerPortal';
import VillageMap from '@/components/VillageMap';
import ProjectsTracker from '@/components/ProjectsTracker';
import AnnouncementsView from '@/components/AnnouncementsView';
import EmergencyContactsView from '@/components/EmergencyContactsView';
import ComplaintDetailModal from '@/components/ComplaintDetailModal';
import { Building2, Heart, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const { activeTab, role, language, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Render View based on activeTab */}
        {activeTab === 'home' || activeTab === 'report' || activeTab === 'my-complaints' ? (
          <CitizenPortal />
        ) : activeTab === 'admin-dashboard' ? (
          <AdminPortal />
        ) : activeTab === 'worker-tasks' ? (
          <FieldWorkerPortal />
        ) : activeTab === 'village-map' ? (
          <VillageMap />
        ) : activeTab === 'projects' ? (
          <ProjectsTracker />
        ) : activeTab === 'announcements' ? (
          <AnnouncementsView />
        ) : activeTab === 'emergency' ? (
          <EmergencyContactsView />
        ) : (
          <CitizenPortal />
        )}
      </main>

      {/* Lifecycle Detail Modal */}
      <ComplaintDetailModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>{t.villageName}</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{t.motto}</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Built with Next.js App Router (React) + TypeScript + Tailwind CSS • Free Cloud Deploy Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
