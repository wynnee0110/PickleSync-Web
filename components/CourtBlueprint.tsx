'use client';

import React, { useState } from 'react';
import { Court } from '../types/booking';
import { Sparkles, Activity, Video, Zap, Key } from 'lucide-react';

interface CourtBlueprintProps {
  court: Court;
  onSelectCourt: () => void;
}

export const CourtBlueprint: React.FC<CourtBlueprintProps> = ({ court, onSelectCourt }) => {
  const [activeZone, setActiveZone] = useState<'kitchen' | 'baseline' | 'net' | 'camera' | 'gate'>('kitchen');

  const zoneDetails = {
    kitchen: {
      title: '7 FT Non-Volley Zone ("The Kitchen")',
      desc: 'Regulation 7-foot kitchen lined with high-friction CushionX acrylic. Calibrated to prevent sliding during fast-paced dink rallies and drop-shot resets.',
      badge: 'Regulation NVZ',
    },
    baseline: {
      title: 'Baseline & Deep Service Boxes',
      desc: 'Extended 8-foot run-off area behind baselines with shock-absorbent cushioning for deep groundstroke drives and third-shot drops.',
      badge: '8mm Cushioning',
    },
    net: {
      title: 'USAP Tournament Tension Net',
      desc: 'Heavy-duty steel-cable net precisely calibrated to 34 inches center height and 36 inches at the perimeter posts.',
      badge: '34" USAP Calibrated',
    },
    camera: {
      title: 'AI DUPR Replay & Scoreboard Cam',
      desc: 'Overhead 4K optical tracking system that automatically verifies scores, logs player stats, and uploads matches to your DUPR profile.',
      badge: 'Auto-Sync DUPR',
    },
    gate: {
      title: 'Smart Turnstile Gate & Security',
      desc: 'Keyless electronic turnstile. Automatically activates with your personal PIN (*4829#) or QR mobile pass 5 minutes before your slot begins.',
      badge: 'Keyless Access',
    },
  };

  return (
    <section id="court-blueprint" className="py-16 sm:py-24 border-t border-slate-200 bg-slate-50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-3">
              <Activity className="h-3.5 w-3.5" />
              <span>PRIVATE COURT TELEMETRY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              INTERACTIVE COURT <span className="text-[#4d7c0f]">BLUEPRINT</span>
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
              Inspect the physical specifications, court zones, and live telemetry 
              of The PickleSync Court. Tap on any hotspot to explore features.
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs text-xs">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">Court Ready for Play</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">68°F / Light Lux: 600</span>
          </div>
        </div>

        {/* Blueprint Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SVG Court Visualizer */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Court Blueprint: Top-Down Schematic
              </span>
              <div className="flex gap-1 text-[11px]">
                <button
                  onClick={() => setActiveZone('kitchen')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeZone === 'kitchen' ? 'bg-[#4d7c0f] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  The Kitchen
                </button>
                <button
                  onClick={() => setActiveZone('net')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeZone === 'net' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Net Post
                </button>
                <button
                  onClick={() => setActiveZone('camera')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    activeZone === 'camera' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  AI Cam
                </button>
              </div>
            </div>

            {/* SVG Schematic View */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-slate-300 bg-[#4a7ec2] shadow-inner p-4 flex items-center justify-center select-none">
              <svg viewBox="0 0 160 100" className="w-full h-full">
                {/* Court Floor */}
                <rect x="5" y="5" width="150" height="90" rx="3" fill="#4a7ec2" stroke="#ffffff" strokeWidth="2.5" />

                {/* Left Service Box */}
                <line x1="5" y1="50" x2="55" y2="50" stroke="#ffffff" strokeWidth="2" />
                {/* Right Service Box */}
                <line x1="105" y1="50" x2="155" y2="50" stroke="#ffffff" strokeWidth="2" />

                {/* Kitchen Zone (NVZ) */}
                <rect
                  x="55"
                  y="5"
                  width="50"
                  height="90"
                  fill="#2e5d95"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => setActiveZone('kitchen')}
                />

                {/* Net System */}
                <line
                  x1="80"
                  y1="2"
                  x2="80"
                  y2="98"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeDasharray="3 1.5"
                  className="cursor-pointer"
                  onClick={() => setActiveZone('net')}
                />

                {/* Hotspot Markers */}
                {/* Kitchen Marker */}
                <g onClick={() => setActiveZone('kitchen')} className="cursor-pointer">
                  <circle cx="80" cy="25" r="5" fill="#84cc16" opacity="0.9" />
                  <circle cx="80" cy="25" r="7" stroke="#bef264" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                  <text x="80" y="27.5" fill="#000" fontSize="5" fontWeight="bold" textAnchor="middle">K</text>
                </g>

                {/* Net Marker */}
                <g onClick={() => setActiveZone('net')} className="cursor-pointer">
                  <circle cx="80" cy="75" r="5" fill="#38bdf8" opacity="0.9" />
                  <text x="80" y="77.5" fill="#000" fontSize="5" fontWeight="bold" textAnchor="middle">N</text>
                </g>

                {/* Camera Marker */}
                <g onClick={() => setActiveZone('camera')} className="cursor-pointer">
                  <circle cx="145" cy="15" r="5" fill="#a855f7" opacity="0.9" />
                  <text x="145" y="17.5" fill="#fff" fontSize="4" fontWeight="bold" textAnchor="middle">CAM</text>
                </g>

                {/* Gate Marker */}
                <g onClick={() => setActiveZone('gate')} className="cursor-pointer">
                  <circle cx="15" cy="15" r="5" fill="#f59e0b" opacity="0.9" />
                  <text x="15" y="17.5" fill="#fff" fontSize="4" fontWeight="bold" textAnchor="middle">PIN</text>
                </g>
              </svg>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Dimensions: 20&apos; x 44&apos; Regulation USAP</span>
              <span>Net Height: 34&quot; Center / 36&quot; Sidelines</span>
            </div>
          </div>

          {/* Interactive Inspector Sidebar */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Specification Focus
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {zoneDetails[activeZone].title}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200 font-bold bg-slate-100 text-slate-700">
                  {zoneDetails[activeZone].badge}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {zoneDetails[activeZone].desc}
              </p>

              {/* Court Telemetry Stats */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-purple-600" />
                    AI DUPR Cam Tracking:
                  </span>
                  <span className="font-bold text-slate-900">Active (4K 60fps)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Lighting Output:
                  </span>
                  <span className="font-bold text-slate-900">600 Lux Broadcast</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-amber-600" />
                    Turnstile Lock:
                  </span>
                  <span className="font-bold text-emerald-600">Sync PIN Code Online</span>
                </div>
              </div>

              {/* Current Match Ticker */}
              {court.currentMatch && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-amber-600" />
                    Currently In Play:
                  </div>
                  <div className="text-amber-950 font-medium">{court.currentMatch.players}</div>
                  <div className="text-slate-600 mt-1 flex justify-between">
                    <span>Score: <b className="text-slate-900">{court.currentMatch.gameScore}</b></span>
                    <span>Finishes at: <b className="text-slate-900">{court.currentMatch.endsAt}</b></span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onSelectCourt}
              className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3.5 text-sm font-bold text-white hover:bg-[#1d4ed8] transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Reserve Court Time Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
