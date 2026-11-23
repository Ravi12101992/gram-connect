'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { initialAssets } from '@/lib/store';
import { VillageAsset } from '@/types';
import {
  MapPin,
  Layers,
  Droplets,
  Lightbulb,
  Trash2,
  Waves,
  Building,
  Navigation,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function VillageMap() {
  const { t, language, complaints, setSelectedComplaint } = useApp();
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'COMPLAINTS' | 'ASSETS'>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<VillageAsset | null>(null);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'tap':
      case 'tank':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'pole':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'toilet':
        return <Building className="w-4 h-4 text-emerald-600" />;
      case 'drain':
        return <Waves className="w-4 h-4 text-cyan-600" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-red-500/30">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{language === 'te' ? 'గ్రామ భౌగోళిక పటం' : 'GIS Village Map & Assets'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black mt-1.5">{t.navVillageMap}</h1>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5">
              {language === 'te'
                ? 'గ్రామంలోని మౌలిక వసతులు (వాటర్ ట్యాంకులు, వీధి దీపాలు) మరియు లైవ్ సమస్యల లొకేషన్లు'
                : 'Geo-spatial visualization of village public utilities, assets, and active issues'}
            </p>
          </div>

          {/* Layer Filter Pills */}
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold gap-1 border border-slate-700">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'ALL' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'te' ? 'అన్నీ' : 'All Pins'}
            </button>
            <button
              onClick={() => setActiveLayer('COMPLAINTS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'COMPLAINTS' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              ⚠️ {language === 'te' ? 'ఫిర్యాదులు' : 'Issues'} ({complaints.length})
            </button>
            <button
              onClick={() => setActiveLayer('ASSETS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLayer === 'ASSETS' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              🏛️ {language === 'te' ? 'ఆస్తులు' : 'Assets'} ({initialAssets.length})
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Simulation Canvas */}
      <div className="relative bg-slate-100 rounded-3xl border border-slate-300 overflow-hidden shadow-sm h-[420px] flex items-center justify-center p-6">
        {/* Village Blueprint Background Graphic */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Road & Ward Grid Visual Guides */}
        <div className="absolute inset-x-8 top-1/2 h-4 bg-slate-300/60 rounded-full -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute inset-y-8 left-1/2 w-4 bg-slate-300/60 rounded-full -translate-x-1/2 pointer-events-none"></div>

        {/* Ward Labels */}
        <div className="absolute top-8 left-12 text-xs font-black text-slate-400">WARD 1 (గాంధీ నగర్)</div>
        <div className="absolute top-8 right-12 text-xs font-black text-slate-400">WARD 2 (పాఠశాల రోడ్)</div>
        <div className="absolute bottom-8 left-12 text-xs font-black text-slate-400">WARD 3 (రామాలయం సెంటర్)</div>
        <div className="absolute bottom-8 right-12 text-xs font-black text-slate-400">WARD 4 (రైతు బజార్)</div>

        {/* Center Landmark Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white">
            <Building className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow mt-1 text-slate-800">
            Grama Panchayat Office
          </span>
        </div>

        {/* Simulated Dynamic Pins: Complaints */}
        {(activeLayer === 'ALL' || activeLayer === 'COMPLAINTS') &&
          complaints.map((c, i) => {
            const positions = [
              { top: '24%', left: '28%' },
              { top: '30%', right: '22%' },
              { bottom: '26%', left: '32%' },
              { bottom: '22%', right: '30%' },
            ];
            const pos = positions[i % positions.length];

            return (
              <div
                key={c.id}
                style={pos}
                onClick={() => setSelectedComplaint(c)}
                className="absolute z-20 cursor-pointer group flex flex-col items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white transition-transform group-hover:scale-125 ${
                    c.priority === 'URGENT'
                      ? 'bg-rose-600 animate-bounce'
                      : c.status === 'COMPLETED' || c.status === 'VERIFIED_CLOSED'
                      ? 'bg-emerald-600'
                      : 'bg-amber-500'
                  }`}
                >
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[9px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow opacity-90 group-hover:opacity-100 whitespace-nowrap mt-0.5">
                  {c.id} ({t.categories[c.category].split(' ')[0]})
                </span>
              </div>
            );
          })}

        {/* Dynamic Pins: Assets */}
        {(activeLayer === 'ALL' || activeLayer === 'ASSETS') &&
          initialAssets.map((ast, i) => {
            const assetPos = [
              { top: '15%', left: '42%' },
              { bottom: '15%', left: '48%' },
              { top: '65%', left: '18%' },
              { top: '40%', right: '15%' },
              { bottom: '38%', right: '18%' },
            ];
            const pos = assetPos[i % assetPos.length];

            return (
              <div
                key={ast.id}
                style={pos}
                onClick={() => setSelectedAsset(ast)}
                className="absolute z-20 cursor-pointer group flex flex-col items-center"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-125 transition-transform">
                  {getAssetIcon(ast.type)}
                </div>
                <span className="text-[9px] font-bold bg-white text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 shadow mt-0.5">
                  {language === 'te' ? ast.nameTe.split(' ')[0] : ast.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
      </div>

      {/* Selected Asset Details Drawer / Card */}
      {selectedAsset && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              {getAssetIcon(selectedAsset.type)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Village Public Asset • {selectedAsset.ward}
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-1">
                {language === 'te' ? selectedAsset.nameTe : selectedAsset.name}
              </h3>
              <p className="text-xs text-slate-500">
                📍 {selectedAsset.location} • Last Inspected: {selectedAsset.lastInspected}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedAsset.condition === 'Good'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {selectedAsset.condition}
            </span>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assets & Infrastructure Catalog */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800">
          🏛️ {language === 'te' ? 'గ్రామ మౌలిక వసతుల జాబితా (Assets)' : 'Village Asset Register'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {initialAssets.map((ast) => (
            <div
              key={ast.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3"
            >
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                {getAssetIcon(ast.type)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  {language === 'te' ? ast.nameTe : ast.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  📍 {ast.ward} - {ast.location}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ast.condition === 'Good'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ast.condition}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Inspected: {ast.lastInspected}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
