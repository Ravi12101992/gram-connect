'use server';

import { Complaint, ComplaintCategory, Priority } from '@/types';
import { initialComplaints } from '@/lib/store';

// In-memory runtime cache for server-side operations
// This provides seamless out-of-the-box operation on all platforms
let serverComplaints: Complaint[] = [...initialComplaints];

export async function getComplaintsServer(): Promise<Complaint[]> {
  return serverComplaints;
}

export async function createComplaintAction(formData: {
  category: ComplaintCategory;
  title: string;
  description: string;
  ward: string;
  landmark: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  citizenName: string;
  citizenPhone: string;
  citizenId: string;
}): Promise<{ success: boolean; complaint?: Complaint; error?: string }> {
  try {
    const idNumber = 100 + serverComplaints.length + 1;
    const newId = `GC-2026-${idNumber}`;
    
    const newComplaint: Complaint = {
      id: newId,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      ward: formData.ward,
      landmark: formData.landmark,
      latitude: formData.latitude || 16.5065,
      longitude: formData.longitude || 80.6480,
      photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60',
      status: 'PENDING',
      priority: 'MEDIUM',
      citizenId: formData.citizenId || 'user-citizen-1',
      citizenName: formData.citizenName || 'Ramesh Naidu (రమేష్)',
      citizenPhone: formData.citizenPhone || '9848022338',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [],
    };

    serverComplaints.unshift(newComplaint);
    return { success: true, complaint: newComplaint };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Failed to submit complaint' };
  }
}

export async function assignWorkerAction(payload: {
  complaintId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  priority: Priority;
  targetDate: string;
}): Promise<{ success: boolean; complaint?: Complaint; error?: string }> {
  const index = serverComplaints.findIndex((c) => c.id === payload.complaintId);
  if (index === -1) {
    return { success: false, error: 'Complaint not found' };
  }

  const updated: Complaint = {
    ...serverComplaints[index],
    status: 'ASSIGNED',
    priority: payload.priority,
    targetDate: payload.targetDate,
    assignedWorkerId: payload.workerId,
    assignedWorkerName: payload.workerName,
    assignedWorkerPhone: payload.workerPhone,
    assignedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updates: [
      ...serverComplaints[index].updates,
      {
        id: `upd-${Date.now()}`,
        complaintId: payload.complaintId,
        workerId: payload.workerId,
        workerName: payload.workerName,
        notes: `Assigned to ${payload.workerName} by Panchayat Secretary with priority ${payload.priority}. Target due: ${payload.targetDate}`,
        statusFrom: serverComplaints[index].status,
        statusTo: 'ASSIGNED',
        timestamp: new Date().toISOString(),
      },
    ],
  };

  serverComplaints[index] = updated;
  return { success: true, complaint: updated };
}

export async function updateWorkerStatusAction(payload: {
  complaintId: string;
  workerId: string;
  workerName: string;
  newStatus: 'IN_PROGRESS' | 'COMPLETED';
  notes: string;
  photoUrl?: string;
}): Promise<{ success: boolean; complaint?: Complaint; error?: string }> {
  const index = serverComplaints.findIndex((c) => c.id === payload.complaintId);
  if (index === -1) {
    return { success: false, error: 'Complaint not found' };
  }

  const current = serverComplaints[index];
  const updated: Complaint = {
    ...current,
    status: payload.newStatus,
    updatedAt: new Date().toISOString(),
    completedAt: payload.newStatus === 'COMPLETED' ? new Date().toISOString() : current.completedAt,
    completionPhotoUrl: payload.photoUrl || current.completionPhotoUrl,
    updates: [
      ...current.updates,
      {
        id: `upd-${Date.now()}`,
        complaintId: payload.complaintId,
        workerId: payload.workerId,
        workerName: payload.workerName,
        notes: payload.notes,
        photoUrl: payload.photoUrl,
        statusFrom: current.status,
        statusTo: payload.newStatus,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  serverComplaints[index] = updated;
  return { success: true, complaint: updated };
}

export async function verifyAndCloseAction(payload: {
  complaintId: string;
  verified: boolean;
  rating?: number;
  comment?: string;
  role: 'CITIZEN' | 'ADMIN';
}): Promise<{ success: boolean; complaint?: Complaint; error?: string }> {
  const index = serverComplaints.findIndex((c) => c.id === payload.complaintId);
  if (index === -1) {
    return { success: false, error: 'Complaint not found' };
  }

  const current = serverComplaints[index];
  const newStatus = payload.verified ? 'VERIFIED_CLOSED' : 'REOPENED';
  
  const updated: Complaint = {
    ...current,
    status: newStatus,
    closedAt: payload.verified ? new Date().toISOString() : undefined,
    feedbackRating: payload.rating || current.feedbackRating,
    feedbackComment: payload.comment || current.feedbackComment,
    updatedAt: new Date().toISOString(),
    updates: [
      ...current.updates,
      {
        id: `upd-${Date.now()}`,
        complaintId: payload.complaintId,
        workerId: payload.role,
        workerName: payload.role === 'ADMIN' ? 'Panchayat Secretary' : 'Citizen Verification',
        notes: payload.verified
          ? `Work verified and closed successfully. ${payload.comment ? `Feedback: ${payload.comment}` : ''}`
          : `Grievance reopened. Issue persists or needs rework: ${payload.comment || 'Requires further action.'}`,
        statusFrom: current.status,
        statusTo: newStatus,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  serverComplaints[index] = updated;
  return { success: true, complaint: updated };
}
