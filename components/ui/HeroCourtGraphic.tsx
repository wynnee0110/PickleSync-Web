import React from 'react';

export const HeroCourtGraphic: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#3b82f6]/20">
      {/* Aspect ratio container: 16:10 court view */}
      <div className="relative w-full aspect-[1.55/1] bg-[#4a7ec2] overflow-hidden select-none">
        {/* Court concrete texture gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3b6ea5] via-[#437ab8] to-[#5188c7]" />

        {/* Outer White Court Boundary */}
        <div className="absolute inset-[8%] border-[3.5px] border-white/95 rounded-sm">
          {/* Inner NVZ (Kitchen) - center blue accent zone */}
          <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-[#2e5d95] border-x-[3px] border-white/95" />

          {/* Center Service Line Left Side (from baseline to kitchen) */}
          <div className="absolute top-[50%] left-0 right-[65%] h-[3px] -translate-y-1/2 bg-white/95" />

          {/* Center Service Line Right Side (from kitchen to baseline) */}
          <div className="absolute top-[50%] left-[65%] right-0 h-[3px] -translate-y-1/2 bg-white/95" />

          {/* Center Net System with Post & Cable */}
          <div className="absolute top-[-3%] bottom-[-3%] left-1/2 -translate-x-1/2 w-[6px] bg-slate-900 z-20 shadow-md">
            {/* White top tape */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white" />
            {/* Top & bottom net posts */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-slate-950 border border-slate-600 shadow" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-slate-950 border border-slate-600 shadow" />
          </div>

          {/* 4 Doubles Players (Aerial silhouettes with real shadows) */}
          {/* Player 1 (Top Left, near NVZ line) */}
          <div className="absolute top-[28%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-10">
            {/* Shadow */}
            <div className="absolute top-2 left-3 w-8 h-4 bg-black/40 rounded-full blur-[2px] -rotate-45" />
            {/* Player Head & Shoulders */}
            <div className="relative flex flex-col items-center">
              <div className="h-5 w-6 rounded-full bg-[#f8fafc] border border-slate-700 shadow-sm flex items-center justify-center">
                <div className="h-3.5 w-3.5 rounded-full bg-[#0284c7]" />
              </div>
              <div className="w-1.5 h-3 bg-[#f59e0b] rounded -rotate-30 -translate-x-2" title="Paddle" />
            </div>
          </div>

          {/* Player 2 (Bottom Left, baseline defender) */}
          <div className="absolute top-[70%] left-[24%] -translate-x-1/2 -translate-y-1/2 z-10">
            {/* Shadow */}
            <div className="absolute top-2 left-4 w-9 h-4 bg-black/40 rounded-full blur-[2px] -rotate-30" />
            <div className="relative flex flex-col items-center">
              <div className="h-5 w-6 rounded-full bg-[#1e293b] border border-slate-600 shadow-sm flex items-center justify-center">
                <div className="h-3.5 w-3.5 rounded-full bg-[#f8fafc]" />
              </div>
              <div className="w-1.5 h-3 bg-[#ccff00] rounded rotate-45 translate-x-2" />
            </div>
          </div>

          {/* Player 3 (Top Right, kitchen dinker) */}
          <div className="absolute top-[32%] right-[24%] translate-x-1/2 -translate-y-1/2 z-10">
            {/* Shadow */}
            <div className="absolute top-2 left-3 w-8 h-4 bg-black/40 rounded-full blur-[2px] -rotate-45" />
            <div className="relative flex flex-col items-center">
              <div className="h-5 w-6 rounded-full bg-[#0f172a] border border-slate-700 shadow-sm flex items-center justify-center">
                <div className="h-3.5 w-3.5 rounded-full bg-[#38bdf8]" />
              </div>
              <div className="w-1.5 h-3 bg-[#ec4899] rounded -rotate-45 translate-x-2" />
            </div>
          </div>

          {/* Player 4 (Bottom Right, mid-court reset) */}
          <div className="absolute top-[72%] right-[28%] translate-x-1/2 -translate-y-1/2 z-10">
            {/* Shadow */}
            <div className="absolute top-2 left-4 w-8 h-4 bg-black/40 rounded-full blur-[2px] -rotate-25" />
            <div className="relative flex flex-col items-center">
              <div className="h-5 w-6 rounded-full bg-[#f8fafc] border border-slate-700 shadow-sm flex items-center justify-center">
                <div className="h-3.5 w-3.5 rounded-full bg-[#ea580c]" />
              </div>
              <div className="w-1.5 h-3 bg-[#84cc16] rounded rotate-12 -translate-x-2" />
            </div>
          </div>

          {/* Yellow Pickleball hovering over kitchen */}
          <div className="absolute top-[48%] left-[46%] z-30">
            <div className="absolute top-2 left-1.5 w-2 h-1.5 bg-black/45 rounded-full blur-[1px]" />
            <div className="relative h-2.5 w-2.5 rounded-full bg-[#bef264] border border-[#65a30d] shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
