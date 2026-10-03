'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Trophy } from 'lucide-react';

export const MembershipSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'dropin',
      name: 'Player Drop-In',
      price: 0,
      period: 'free forever',
      badge: 'Casual Dinker',
      description: 'Ideal for weekend players reserving occasional courts with friends.',
      features: [
        '48-hour advance court booking window',
        'Standard peak & off-peak hourly rates',
        'Access to public Open Play scrambles',
        'Mobile QR Turnstile Gate Pass',
        'Basic player profile & scorekeeping',
      ],
      popular: false,
    },
    {
      id: 'sync-plus',
      name: 'Sync Plus Pass',
      price: billingCycle === 'monthly' ? 1499 : 1199,
      period: 'per month',
      badge: 'Most Popular',
      description: 'The sweet spot for active players and competitive recreational duos.',
      features: [
        '7-day advance priority court reservations',
        '15% discount on all peak hour slots',
        '2 free premium paddle demos per month',
        'DUPR™ verified analytics & score auto-sync',
        '2 free monthly guest passes for teammates',
        '10% off pro shop gear and ball tubes',
      ],
      popular: true,
    },
    {
      id: 'championship',
      name: 'Championship VIP',
      price: billingCycle === 'monthly' ? 3499 : 2899,
      period: 'per month',
      badge: 'Tournament Pro',
      description: 'Unlimited access for dedicated grinders and league competitors.',
      features: [
        '14-day ultra-priority advance booking window',
        '50% discount on all courts + free off-peak slots',
        'Unlimited Spinshot Pro ball machine bookings',
        'Free Selkirk & JOOLA pro paddle demos',
        'Private locker room, steam lounge & cold plunge',
        'VIP entrance & dedicated tournament seeds',
      ],
      popular: false,
    },
  ];

  return (
    <section id="memberships" className="py-16 sm:py-24 border-t border-slate-200 bg-slate-50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-3">
            <Trophy className="h-3.5 w-3.5" />
            <span>CLUB MEMBERSHIPS & PASSES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            UNLOCK PRIORITY <span className="text-[#4d7c0f]">COURT ACCESS</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Get early court reservation windows, discounted peak hour slots, and free 
            high-end paddle demos with PickleSync memberships.
          </p>

          {/* Billing Switcher */}
          <div className="mt-6 inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px] font-extrabold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 bg-white transition-all duration-300 ${
                  tier.popular
                    ? 'border-2 border-[#2563eb] shadow-xl lg:-translate-y-2'
                    : 'border border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2563eb] px-4 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                    {!tier.popular && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-950">
                      ₱{tier.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      /{tier.period}
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="mt-8 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Included Privileges:
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                        <div className="mt-0.5 rounded-full bg-emerald-100 p-0.5 text-emerald-700 shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan CTA */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all cursor-pointer ${
                      tier.popular
                        ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-md'
                        : isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Plan Activated</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Join Club • {tier.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
