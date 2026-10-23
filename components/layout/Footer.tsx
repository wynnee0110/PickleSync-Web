'use client';

import React, { useState } from 'react';
import { PickleMascot } from '@/components/ui/PickleMascot';
import { ShieldCheck, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-28 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <PickleMascot size={32} />
              <span className="text-xl font-black tracking-tight text-white">
                PickleSync
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The dedicated court management and direct booking system for PickleSync Arena athletes. Book on-site courts, smash dinks, and play today.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="inline-flex items-center gap-1.5 text-blue-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                USAP Regulation Certified
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">DUPR™ Verified Partner</span>
            </div>
          </div>

          {/* Arena Hours & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Facility Hours
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                <span>Mon – Sun: 06:00 AM – 11:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>Downtown Athletic Park, Bay 04</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span>(800) 555-DINK</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#court-schedule" className="hover:text-white transition-colors">Book Court</a></li>
              <li><a href="#open-play" className="hover:text-white transition-colors">Leagues & Open Play</a></li>
              <li><a href="#memberships" className="hover:text-white transition-colors">Club Memberships</a></li>
            </ul>
          </div>

          {/* Drop-in alerts subscription */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Drop-In Court Alerts
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get notified when prime-time evening slots are freed up or new open plays are scheduled.
            </p>
            {subscribed ? (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold">
                ✓ You are subscribed to slot alerts!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="player@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl bg-slate-800 px-3 py-2 text-xs text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to alerts"
                  className="rounded-xl bg-[#2563eb] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} PickleSync Club Technologies, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">12h Free Cancellation Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy & DUPR Data Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
