'use client';

import React, { useState } from 'react';
import { OpenMatch } from '../types/booking';
import { Zap, Users, Shield, Trophy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpenPlaySectionProps {
  matches: OpenMatch[];
}

export const OpenPlaySection: React.FC<OpenPlaySectionProps> = ({ matches: initialMatches }) => {
  const [matches, setMatches] = useState<OpenMatch[]>(initialMatches);
  const [joinedMatchId, setJoinedMatchId] = useState<string | null>(null);

  const handleJoinGame = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId && m.spotsFilled < m.spotsTotal) {
          return {
            ...m,
            spotsFilled: m.spotsFilled + 1,
            players: [
              ...m.players,
              {
                name: 'You (DUPR 3.8)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                dupr: 3.8,
              },
            ],
          };
        }
        return m;
      })
    );
    setJoinedMatchId(matchId);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#84cc16', '#4d7c0f'],
      });
    } catch {
      // Fallback
    }
  };

  return (
    <section id="open-play" className="py-16 sm:py-24 border-t border-slate-200 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 mb-3">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              <span>LEAGUES & OPEN PLAY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              PICKLE<span className="text-[#4d7c0f]">SYNC</span> OPEN SCRAMBLES
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
              Never get stuck without a 4th player. Join competitive open games or social 
              dink scrambles accurately matched to your skill rating.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-700 font-medium">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Ratings auto-synced with <b>DUPR™</b></span>
            </div>
          </div>
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((match) => {
            const hasJoined = joinedMatchId === match.id;
            const isFull = match.spotsFilled >= match.spotsTotal;
            const spotsLeft = match.spotsTotal - match.spotsFilled;

            return (
              <div
                key={match.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-blue-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <Trophy className="h-3.5 w-3.5" />
                      DUPR {match.duprRange}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {match.format}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {match.title}
                  </h3>

                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div className="text-slate-700 font-semibold">{match.courtName}</div>
                    <div>{match.date} • {match.time}</div>
                  </div>

                  {/* Player Avatars & Spots */}
                  <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-semibold text-slate-700">
                        Players ({match.spotsFilled}/{match.spotsTotal})
                      </span>
                      <span className={`text-[11px] font-bold ${spotsLeft === 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {spotsLeft === 0 ? 'Full Match' : `${spotsLeft} Spot${spotsLeft > 1 ? 's' : ''} Left!`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {match.players.map((p, idx) => (
                        <div key={idx} className="relative group/avatar" title={`${p.name} (DUPR ${p.dupr})`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="h-10 w-10 rounded-full border-2 border-white shadow-xs object-cover"
                          />
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white border border-white">
                            ★
                          </span>
                        </div>
                      ))}

                      {/* Empty spot placeholders */}
                      {Array.from({ length: spotsLeft }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-slate-400 text-xs font-semibold"
                        >
                          +1
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Join Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Drop-in Share
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₱{match.pricePerPlayer}
                    </span>
                  </div>

                  {hasJoined ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 border border-emerald-200"
                    >
                      <Check className="h-4 w-4" />
                      Spot Reserved!
                    </button>
                  ) : (
                    <button
                      disabled={isFull}
                      onClick={() => handleJoinGame(match.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                        isFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-95 shadow-sm'
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      {isFull ? 'Match Full' : 'Join Match'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
