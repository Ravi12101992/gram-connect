export type Language = 'te' | 'en';

export type UserRole = 'CITIZEN' | 'ADMIN' | 'FIELD_WORKER';

export type ComplaintCategory = 'SANITATION' | 'DRAINAGE' | 'DRINKING_WATER' | 'STREETLIGHTS';

export type ComplaintStatus =
  | 'PENDING'
  | 'REVIEWED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED_CLOSED'
  | 'REOPENED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ProjectStatus = 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  phone: string;
  name: string;
  nameTe?: string;
  role: UserRole;
  ward?: string;
  avatar?: string;
}

export interface WorkUpdate {
  id: string;
  complaintId: string;
  workerId: string;
  workerName: string;
  notes: string;
  photoUrl?: string;
  statusFrom: ComplaintStatus;
  statusTo: ComplaintStatus;
  timestamp: string;
}

export interface Complaint {
  id: string; // e.g. GC-2026-1001
  category: ComplaintCategory;
  title: string;
  titleTe?: string;
  description: string;
  ward: string;
  landmark: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  completionPhotoUrl?: string;
  status: ComplaintStatus;
  priority: Priority;
  targetDate?: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedWorkerPhone?: string;
  assignedAt?: string;
  completedAt?: string;
  closedAt?: string;
  feedbackRating?: number;
  feedbackComment?: string;
  createdAt: string;
  updatedAt: string;
  updates: WorkUpdate[];
}

export interface VillageAsset {
  id: string;
  name: string;
  nameTe: string;
  type: 'tap' | 'tank' | 'drain' | 'pole' | 'toilet' | 'road';
  ward: string;
  location: string;
  latitude: number;
  longitude: number;
  condition: 'Good' | 'Needs Maintenance' | 'Under Repair';
  lastInspected: string;
}

export interface DevelopmentProject {
  id: string;
  title: string;
  titleTe: string;
  description: string;
  descriptionTe: string;
  category: string;
  location: string;
  budget: number; // in INR
  fundingSource: string;
  timeline: string;
  status: ProjectStatus;
  progress: number; // percentage
  photoUrl?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleTe: string;
  content: string;
  contentTe: string;
  category: 'Water' | 'Health' | 'GramaSabha' | 'Sanitation' | 'General';
  priority: 'NORMAL' | 'URGENT';
  ward: string;
  date: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  titleTe: string;
  name: string;
  phone: string;
  role: string;
  roleTe: string;
  available: string;
}
