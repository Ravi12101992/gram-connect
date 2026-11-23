'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Complaint } from '@/types';
import {
  Wrench,
  CheckCircle,
  Clock,
  Play,
  Camera,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Phone,
  Eye,
} from 'lucide-react';

export default function FieldWorkerPortal() {
  const {
    t,
    language,
    complaints,
    currentUser,
    updateWorkerTask,
    setSelectedComplaint,
  } = useApp();

  const [activeTabWorker, setActiveTabWorker] = useState<'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'>('ASSIGNED');
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [workerNotes, setWorkerNotes] = useState('');
  const [afterPhoto, setAfterPhoto] = useState<string>('');

  // Filter tasks assigned to current worker
  const myTasks = complaints.filter(
    (c) =>
      c.assignedWorkerId === currentUser.id ||
      c.assignedWorkerName?.includes(currentUser.name.split(' ')[0])
  );

  const assignedTasks = myTasks.filter((t) => t.status === 'ASSIGNED');
  const inProgressTasks = myTasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = myTasks.filter((t) => t.status === 'COMPLETED' || t.status === 'VERIFIED_CLOSED');

  const currentList =
    activeTabWorker === 'ASSIGNED'
      ? assignedTasks
      : activeTabWorker === 'IN_PROGRESS'
      ? inProgressTasks
      : completedTasks;

  const handleStartWork = (c: Complaint) => {
    updateWorkerTask(
      c.id,
      'IN_PROGRESS',
      `Worker ${currentUser.name} reached the site and commenced repair works.`
    );
  };

  const handleCompleteTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    updateWorkerTask(
      selectedTask.id,
      'COMPLETED',
      workerNotes || 'Repairs executed successfully on site.',
      afterPhoto || 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=60'
    );
    setSelectedTask(null);
    setWorkerNotes('');
    setAfterPhoto('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Worker Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-400/30">
              <Wrench className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'ఫీల్డ్ వర్కర్ కార్యాలయం' : 'Field Operations App'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black mt-1.5">{t.workerTitle}</h1>
            <p className="text-xs md:text-sm text-amber-100 mt-0.5">{t.workerSubtitle}</p>
          </div>

          <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold text-white">{currentUser.name}</p>
              <p className="text-[11px] text-amber-200">{currentUser.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Status Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTabWorker('ASSIGNED')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTabWorker === 'ASSIGNED'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {t.assignedTasks} ({assignedTasks.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTabWorker('IN_PROGRESS')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTabWorker === 'IN_PROGRESS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>
            {t.inProgressTasks} ({inProgressTasks.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTabWorker('COMPLETED')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTabWorker === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>
            {t.completedTasks} ({completedTasks.length})
          </span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {currentList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">
              {language === 'te'
                ? 'ఈ విభాగంలో ఎటువంటి పనులు లేవు.'
                : 'No tasks in this queue currently.'}
            </p>
          </div>
        ) : (
          currentList.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {t.categories[task.category]}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.priorities[task.priority]}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {language === 'te' && task.titleTe ? task.titleTe : task.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{task.description}</p>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {task.ward} • {task.landmark}
                    </span>
                    {task.targetDate && (
                      <span className="flex items-center gap-1 font-semibold text-amber-800">
                        <Calendar className="w-3.5 h-3.5" />
                        Target Due: {task.targetDate}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      {task.citizenName} ({task.citizenPhone})
                    </span>
                  </div>
                </div>

                {/* Citizen Photo Thumbnail */}
                {task.photoUrl && (
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={task.photoUrl}
                      alt="Citizen evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedComplaint(task)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.viewDetails}</span>
                </button>

                <div className="flex gap-2">
                  {task.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleStartWork(task)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{t.startWork}</span>
                    </button>
                  )}

                  {task.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.completeTask}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completion Evidence Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  📷 {t.completeTask}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Complaint ID: {selectedTask.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.evidenceNotesPlaceholder} *
                </label>
                <textarea
                  rows={3}
                  value={workerNotes}
                  onChange={(e) => setWorkerNotes(e.target.value)}
                  placeholder="Replaced damaged valve, tested line pressure, cleared debris..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.uploadEvidencePhoto}
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  {afterPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={afterPhoto}
                      alt="After photo"
                      className="h-28 w-full object-cover rounded-lg"
                    />
                  ) : (
                    <label className="cursor-pointer block text-xs text-slate-600 py-2">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                      <span>Click to simulate / upload resolved site photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAfterPhoto(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
                >
                  {language === 'te' ? 'పూర్తయిందని సమర్పించండి' : 'Submit Completion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
