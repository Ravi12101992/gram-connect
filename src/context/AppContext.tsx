'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  ComplaintCategory,
  Language,
  Priority,
  User,
  UserRole,
} from '@/types';
import { initialComplaints, initialUsers } from '@/lib/store';
import { translations } from '@/lib/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  complaints: Complaint[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (c: Complaint | null) => void;
  addComplaint: (data: {
    category: ComplaintCategory;
    title: string;
    description: string;
    ward: string;
    landmark: string;
    photoUrl?: string;
    latitude?: number;
    longitude?: number;
  }) => Promise<Complaint>;
  assignWorker: (
    complaintId: string,
    workerId: string,
    priority: Priority,
    targetDate: string
  ) => void;
  updateWorkerTask: (
    complaintId: string,
    newStatus: 'IN_PROGRESS' | 'COMPLETED',
    notes: string,
    photoUrl?: string
  ) => void;
  verifyComplaint: (
    complaintId: string,
    verified: boolean,
    rating?: number,
    comment?: string
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('te'); // Default to Telugu as per prompt
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Synchronize currentUser when role changes
  useEffect(() => {
    if (role === 'CITIZEN') {
      setCurrentUser(initialUsers[0]);
    } else if (role === 'ADMIN') {
      setCurrentUser(initialUsers[2]);
    } else if (role === 'FIELD_WORKER') {
      setCurrentUser(initialUsers[3]);
    }
  }, [role]);

  // Load persisted complaints from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('gramconnect_complaints');
    if (saved) {
      try {
        setComplaints(JSON.parse(saved));
      } catch {
        // use initial
      }
    }
  }, []);

  const saveComplaints = (newList: Complaint[]) => {
    setComplaints(newList);
    try {
      localStorage.setItem('gramconnect_complaints', JSON.stringify(newList));
    } catch {
      // ignore storage quota error
    }
  };

  const addComplaint = async (data: {
    category: ComplaintCategory;
    title: string;
    description: string;
    ward: string;
    landmark: string;
    photoUrl?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<Complaint> => {
    const id = `GC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newComp: Complaint = {
      id,
      category: data.category,
      title: data.title,
      description: data.description,
      ward: data.ward,
      landmark: data.landmark,
      latitude: data.latitude || 16.5065,
      longitude: data.longitude || 80.6480,
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60',
      status: 'PENDING',
      priority: 'MEDIUM',
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenPhone: currentUser.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [
        {
          id: `upd-${Date.now()}`,
          complaintId: id,
          workerId: currentUser.id,
          workerName: currentUser.name,
          notes: 'Grievance submitted by citizen. Waiting for Panchayat review.',
          statusFrom: 'PENDING',
          statusTo: 'PENDING',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const updated = [newComp, ...complaints];
    saveComplaints(updated);
    return newComp;
  };

  const assignWorker = (
    complaintId: string,
    workerId: string,
    priority: Priority,
    targetDate: string
  ) => {
    const worker = initialUsers.find((u) => u.id === workerId) || initialUsers[3];
    const updated = complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'ASSIGNED' as const,
          priority,
          targetDate,
          assignedWorkerId: worker.id,
          assignedWorkerName: worker.name,
          assignedWorkerPhone: worker.phone,
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updates: [
            ...c.updates,
            {
              id: `upd-${Date.now()}`,
              complaintId,
              workerId: worker.id,
              workerName: worker.name,
              notes: `Assigned to ${worker.name}. Target completion: ${targetDate}`,
              statusFrom: c.status,
              statusTo: 'ASSIGNED' as const,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find((c) => c.id === complaintId) || null);
    }
  };

  const updateWorkerTask = (
    complaintId: string,
    newStatus: 'IN_PROGRESS' | 'COMPLETED',
    notes: string,
    photoUrl?: string
  ) => {
    const updated = complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : c.completedAt,
          completionPhotoUrl: photoUrl || c.completionPhotoUrl,
          updates: [
            ...c.updates,
            {
              id: `upd-${Date.now()}`,
              complaintId,
              workerId: currentUser.id,
              workerName: currentUser.name,
              notes,
              photoUrl,
              statusFrom: c.status,
              statusTo: newStatus,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find((c) => c.id === complaintId) || null);
    }
  };

  const verifyComplaint = (
    complaintId: string,
    verified: boolean,
    rating?: number,
    comment?: string
  ) => {
    const newStatus = verified ? ('VERIFIED_CLOSED' as const) : ('REOPENED' as const);
    const updated = complaints.map((c) => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: newStatus,
          closedAt: verified ? new Date().toISOString() : undefined,
          feedbackRating: rating || c.feedbackRating,
          feedbackComment: comment || c.feedbackComment,
          updatedAt: new Date().toISOString(),
          updates: [
            ...c.updates,
            {
              id: `upd-${Date.now()}`,
              complaintId,
              workerId: currentUser.id,
              workerName: currentUser.name,
              notes: verified
                ? `Work verified by ${currentUser.name}. Grievance closed.`
                : `Grievance reopened. Remarks: ${comment || 'Work unsatisfactory.'}`,
              statusFrom: c.status,
              statusTo: newStatus,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find((c) => c.id === complaintId) || null);
    }
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        role,
        setRole,
        currentUser,
        setCurrentUser,
        complaints,
        activeTab,
        setActiveTab,
        selectedComplaint,
        setSelectedComplaint,
        addComplaint,
        assignWorker,
        updateWorkerTask,
        verifyComplaint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
