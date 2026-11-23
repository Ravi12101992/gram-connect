'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Complaint, ComplaintCategory, ComplaintStatus, Priority } from '@/types';
import { initialUsers } from '@/lib/store';
import {
  LayoutDashboard,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Eye,
  FileSpreadsheet,
  Megaphone,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

export default function AdminPortal() {
  const {
    t,
    language,
    complaints,
    assignWorker,
    verifyComplaint,
    setSelectedComplaint,
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [wardFilter, setWardFilter] = useState<string>('ALL');

  // Assignment Modal State
  const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-1');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('HIGH');
  const [targetDate, setTargetDate] = useState<string>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Verification Modal State
  const [verifyingComplaint, setVerifyingComplaint] = useState<Complaint | null>(null);
  const [adminVerificationNotes, setAdminVerificationNotes] = useState<string>('');

  const fieldWorkers = initialUsers.filter((u) => u.role === 'FIELD_WORKER');

  // KPI Calculations
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'PENDING' || c.status === 'REVIEWED').length;
  const inProgress = complaints.filter((c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
  const completed = complaints.filter((c) => c.status === 'COMPLETED' || c.status === 'VERIFIED_CLOSED').length;
  
  const today = new Date().toISOString().split('T')[0];
  const overdue = complaints.filter(
    (c) => c.targetDate && c.targetDate < today && c.status !== 'COMPLETED' && c.status !== 'VERIFIED_CLOSED'
  ).length;

  // Filtered Complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      searchTerm === '' ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OVERDUE'
        ? c.targetDate && c.targetDate < today && c.status !== 'COMPLETED' && c.status !== 'VERIFIED_CLOSED'
        : c.status === statusFilter);

    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesWard = wardFilter === 'ALL' || c.ward.includes(wardFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesWard;
  });

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningComplaint) return;
    assignWorker(assigningComplaint.id, selectedWorkerId, selectedPriority, targetDate);
    setAssigningComplaint(null);
  };

  const handleAdminVerify = (verified: boolean) => {
    if (!verifyingComplaint) return;
    verifyComplaint(verifyingComplaint.id, verified, 5, adminVerificationNotes);
    setVerifyingComplaint(null);
    setAdminVerificationNotes('');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Category,Ward,Status,Priority,Citizen,Worker,TargetDate,Created\n';
    const rows = filteredComplaints
      .map(
        (c) =>
          `"${c.id}","${c.category}","${c.ward}","${c.status}","${c.priority}","${c.citizenName}","${c.assignedWorkerName || 'Unassigned'}","${c.targetDate || ''}","${c.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GramConnect-Grievances-${today}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold border border-orange-400/30">
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
              <span>{language === 'te' ? 'పంచాయతీ పాలనా విభాగం' : 'Panchayat Governance Console'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mt-2">{t.adminTitle}</h1>
            <p className="text-xs md:text-sm text-emerald-100 mt-1">{t.adminSubtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>{t.exportReport}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500">{t.totalComplaints}</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-[11px] font-semibold text-slate-400">100%</span>
          </div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING')}
          className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-700">{t.pendingReview}</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">{pending}</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
              Needs Action
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
          className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-blue-700">{t.activeWorks}</p>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-blue-600">{inProgress}</span>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
              Field Staff
            </span>
          </div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
          className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700">{t.resolvedIssues}</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-emerald-600">{completed}</span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              Closed
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'OVERDUE' ? 'ALL' : 'OVERDUE')}
          className={`col-span-2 lg:col-span-1 p-4 rounded-xl border shadow-xs cursor-pointer transition-all ${
            overdue > 0
              ? 'bg-rose-50 border-rose-300 hover:border-rose-500'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-rose-700">{t.overdueIssues}</p>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-rose-600">{overdue}</span>
            {overdue > 0 && (
              <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded animate-pulse">
                Escalated
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.search}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-44 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
          >
            <option value="ALL">
              {language === 'te' ? 'అన్ని విభాగాలు' : 'All Categories'}
            </option>
            <option value="DRINKING_WATER">{t.categories.DRINKING_WATER}</option>
            <option value="STREETLIGHTS">{t.categories.STREETLIGHTS}</option>
            <option value="SANITATION">{t.categories.SANITATION}</option>
            <option value="DRAINAGE">{t.categories.DRAINAGE}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
          >
            <option value="ALL">
              {language === 'te' ? 'అన్ని స్థితులు (Status)' : 'All Statuses'}
            </option>
            <option value="PENDING">{t.statuses.PENDING}</option>
            <option value="ASSIGNED">{t.statuses.ASSIGNED}</option>
            <option value="IN_PROGRESS">{t.statuses.IN_PROGRESS}</option>
            <option value="COMPLETED">{t.statuses.COMPLETED}</option>
            <option value="VERIFIED_CLOSED">{t.statuses.VERIFIED_CLOSED}</option>
            <option value="REOPENED">{t.statuses.REOPENED}</option>
            <option value="OVERDUE">⚠️ {t.overdueIssues}</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-800">
              {language === 'te' ? 'గ్రామ ఫిర్యాదుల రిజిస్టర్' : 'Grievance Master Ledger'}
            </h3>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {filteredComplaints.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">{t.categories.SANITATION ? 'Category' : 'విభాగం'}</th>
                <th className="py-3 px-4">Description & Ward</th>
                <th className="py-3 px-4">{t.priority}</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4">Assigned Worker</th>
                <th className="py-3 px-4 text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    {t.noComplaintsFound}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isPending = c.status === 'PENDING' || c.status === 'REVIEWED' || c.status === 'REOPENED';
                  const isCompletedAwaitingAdminVerify = c.status === 'COMPLETED';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {c.id}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {t.categories[c.category]}
                      </td>

                      {/* Details */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 truncate">
                          {language === 'te' && c.titleTe ? c.titleTe : c.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{c.ward}</p>
                        <p className="text-[10px] text-slate-400">
                          {c.citizenName} ({c.citizenPhone})
                        </p>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.priority === 'URGENT'
                              ? 'bg-rose-100 text-rose-800'
                              : c.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priorities[c.priority]}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'VERIFIED_CLOSED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-800'
                              : c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED'
                              ? 'bg-amber-100 text-amber-800'
                              : c.status === 'REOPENED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.statuses[c.status]}
                        </span>
                      </td>

                      {/* Worker */}
                      <td className="py-3 px-4">
                        {c.assignedWorkerName ? (
                          <span className="font-semibold text-slate-800">
                            {c.assignedWorkerName.split(' ')[0]}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        {isPending && (
                          <button
                            onClick={() => {
                              setAssigningComplaint(c);
                              setSelectedPriority(c.priority || 'HIGH');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-xs"
                          >
                            + {language === 'te' ? 'కేటాయించు' : 'Assign'}
                          </button>
                        )}

                        {isCompletedAwaitingAdminVerify && (
                          <button
                            onClick={() => setVerifyingComplaint(c)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-xs"
                          >
                            ✓ {language === 'te' ? 'ధృవీకరించు' : 'Verify'}
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg text-[11px]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {assigningComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  👷 {t.assignWorkerTitle}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Complaint ID: {assigningComplaint.id}
                </p>
              </div>
              <button
                onClick={() => setAssigningComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1">
              <p className="font-bold text-slate-800">{assigningComplaint.title}</p>
              <p className="text-slate-600">{assigningComplaint.description}</p>
              <p className="text-slate-500">📍 {assigningComplaint.ward} • {assigningComplaint.landmark}</p>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              {/* Select Worker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.selectWorker} *
                </label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  required
                >
                  {fieldWorkers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.setPriority}
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="URGENT">{t.priorities.URGENT}</option>
                    <option value="HIGH">{t.priorities.HIGH}</option>
                    <option value="MEDIUM">{t.priorities.MEDIUM}</option>
                    <option value="LOW">{t.priorities.LOW}</option>
                  </select>
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.setTargetDate}
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setAssigningComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  {t.saveAssignment}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Verification Modal */}
      {verifyingComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  🔍 {t.verifyWorkerWork}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Complaint ID: {verifyingComplaint.id}
                </p>
              </div>
              <button
                onClick={() => setVerifyingComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Evidence Comparison Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-600">Original Citizen Photo</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={verifyingComplaint.photoUrl || ''}
                  alt="Original Issue"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-emerald-700">Worker After Photo</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={verifyingComplaint.completionPhotoUrl || verifyingComplaint.photoUrl || ''}
                  alt="Completion evidence"
                  className="w-full h-32 object-cover rounded-lg border border-emerald-300"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1">
              <p className="font-bold text-slate-700">Worker Notes:</p>
              <p className="text-slate-600 italic">
                {verifyingComplaint.updates[verifyingComplaint.updates.length - 1]?.notes ||
                  'Task completed on site as per standards.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Panchayat Review Remarks
              </label>
              <input
                type="text"
                value={adminVerificationNotes}
                onChange={(e) => setAdminVerificationNotes(e.target.value)}
                placeholder="Inspected by Secretary. Work verified satisfactory."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => handleAdminVerify(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
              >
                ❌ {t.adminReopenBtn}
              </button>
              <button
                type="button"
                onClick={() => handleAdminVerify(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                ✓ {t.adminVerifyBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
