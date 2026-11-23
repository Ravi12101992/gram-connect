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
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginWithPhone: (phone: string, otp: string) => { success: boolean; user?: User; message?: string };
  loginAsUser: (user: User) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
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
  const [language, setLanguage] = useState<Language>('te'); // Default to Telugu as per blueprint
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Check persisted auth & complaints on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('gramconnect_auth_user');
      const savedIsAuth = localStorage.getItem('gramconnect_is_authenticated');
      if (savedIsAuth === 'true' && savedAuth) {
        const user = JSON.parse(savedAuth);
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        if (user.role === 'ADMIN') setActiveTab('admin-dashboard');
        else if (user.role === 'FIELD_WORKER') setActiveTab('worker-tasks');
        else setActiveTab('home');
      }

      const savedComplaints = localStorage.getItem('gramconnect_complaints');
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints));
      }
    } catch {
      // ignore
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

  const loginAsUser = (user: User) => {
    setCurrentUser(user);
    setRole(user.role);
    setIsAuthenticated(true);
    setShowAuthModal(false);

    try {
      localStorage.setItem('gramconnect_auth_user', JSON.stringify(user));
      localStorage.setItem('gramconnect_is_authenticated', 'true');
    } catch {
      // ignore
    }

    if (user.role === 'ADMIN') {
      setActiveTab('admin-dashboard');
    } else if (user.role === 'FIELD_WORKER') {
      setActiveTab('worker-tasks');
    } else {
      setActiveTab('home');
    }
  };

  const loginWithPhone = (phone: string, otp: string) => {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number' };
    }

    // Find existing user or create a citizen user
    const existing = initialUsers.find((u) => u.phone.endsWith(cleanPhone.slice(-10)));
    let userToLogin: User;

    if (existing) {
      userToLogin = existing;
    } else {
      userToLogin = {
        id: `user-citizen-${Date.now()}`,
        name: `Citizen (${cleanPhone.slice(-4)})`,
        nameTe: `పౌరుడు (${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        role: 'CITIZEN',
        ward: 'Ward 3 (రామాలయం వీధి)',
      };
    }

    loginAsUser(userToLogin);
    return { success: true, user: userToLogin };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setShowAuthModal(false);
    try {
      localStorage.removeItem('gramconnect_auth_user');
      localStorage.removeItem('gramconnect_is_authenticated');
    } catch {
      // ignore
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
        isAuthenticated,
        setIsAuthenticated,
        loginWithPhone,
        loginAsUser,
        logout,
        showAuthModal,
        setShowAuthModal,
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
