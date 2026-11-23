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
import LoginView from '@/components/LoginView';
import { Building2, X } from 'lucide-react';

export default function HomePage() {
  const { activeTab, isAuthenticated, showAuthModal, setShowAuthModal, language, t } = useApp();

  // If not authenticated, show the Blueprint Language & OTP Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <LoginView />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
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

      {/* Switch User / OTP Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl my-8">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-900 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
            <LoginView isModal={true} onClose={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}

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
            Built with Next.js App Router (React 19) + TypeScript + Tailwind CSS • Flowchart-based Village Governance Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
