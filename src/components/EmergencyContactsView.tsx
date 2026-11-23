'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { initialEmergencyContacts } from '@/lib/store';
import { PhoneCall, Shield, User, Clock, Phone } from 'lucide-react';

export default function EmergencyContactsView() {
  const { t, language } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-500/30">
            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'te' ? '24x7 అత్యవసర సహాయం' : 'Emergency Village Helpline'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black mt-1.5">{t.navEmergency}</h1>
          <p className="text-xs md:text-sm text-blue-100 mt-0.5">
            {language === 'te'
              ? 'పంచాయతీ కార్యదర్శి, లైన్‌మన్, వాటర్ సప్లై సిబ్బంది మరియు ఆరోగ్య కార్యకర్తల ఫోన్ నంబర్లు'
              : 'Direct contacts for Panchayat administration, power breakdowns, water pipe bursts, and medical staff'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialEmergencyContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {language === 'te' ? contact.roleTe : contact.role}
              </span>
              <h3 className="font-bold text-base text-slate-900">
                {language === 'te' ? contact.titleTe : contact.title}
              </h3>
              <p className="text-xs font-semibold text-slate-600">{contact.name}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                <Clock className="w-3 h-3 text-emerald-500" />
                {contact.available}
              </p>
            </div>

            <a
              href={`tel:${contact.phone}`}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-sm shrink-0"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>{contact.phone}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
