'use client';

import React, { useState } from 'react';
import { Court, TimeSlot, BookingReservation } from '../types/booking';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Lock
} from 'lucide-react';

interface BookingModalProps {
  court: Court | null;
  initialSlot?: TimeSlot | null;
  date?: string;
  slotTimes?: string[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (reservation: BookingReservation) => void;
}

type ModalStep = 'confirm' | 'payment' | 'success';

export const BookingModal: React.FC<BookingModalProps> = ({
  court,
  initialSlot,
  date = 'Sep 9, 2025',
  slotTimes = [],
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  const [step, setStep] = useState<ModalStep>('confirm');
  const [confirmedReservation, setConfirmedReservation] = useState<BookingReservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'wallet'>('card');

  if (!isOpen || !court) return null;

  // Resolve list of booked times to display
  const timesToDisplay: string[] = slotTimes.length > 0 
    ? slotTimes 
    : initialSlot?.time 
      ? [initialSlot.time] 
      : ['08:00 AM'];

  // Helper to get pricing for each slot
  const getSlotPrice = (timeString: string): number => {
    const isPeak = timeString.includes('04:') || timeString.includes('05:') || timeString.includes('06:') || timeString.includes('07:') || timeString.includes('08:');
    return isPeak ? court.peakPricePerHour : court.pricePerHour;
  };

  const courtTotal = timesToDisplay.reduce((sum, t) => sum + getSlotPrice(t), 0);
  const facilityFee = 0; // Facility fee waived
  const totalPrice = courtTotal + facilityFee;

  const handleProcessPayment = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const passCode = `SYNC-${court.courtNumber}${Math.floor(1000 + Math.random() * 9000)}`;
      const reservation: BookingReservation = {
        bookingId: `BK-${Date.now().toString().slice(-6)}`,
        courtId: court.id,
        courtName: court.name,
        courtNumber: court.courtNumber,
        venue: court.venue,
        date: date,
        timeSlot: timesToDisplay.join(', '),
        durationMinutes: timesToDisplay.length * 60,
        addOns: [],
        playerNames: ['You (Host)'],
        splitPayment: false,
        totalPrice: totalPrice,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        accessPassCode: passCode,
      };

      setConfirmedReservation(reservation);
      onConfirmBooking(reservation);
      setIsSubmitting(false);
      setStep('success');

      // Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#84cc16', '#4d7c0f', '#0f172a'],
        });
      } catch {
        // Confetti fallback
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              {step === 'confirm' && 'STEP 1 OF 2 • REVIEW'}
              {step === 'payment' && 'STEP 2 OF 2 • PAYMENT'}
              {step === 'success' && 'CONFIRMED • PASS GENERATED'}
            </span>
            <h3 className="text-lg font-black text-slate-950">
              {step === 'confirm' && 'Booking Confirmation'}
              {step === 'payment' && 'Online Payment'}
              {step === 'success' && 'Digital Access Pass'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* STEP 1: CONFIRMATION OF COURT, DATE, AND TIME */}
          {step === 'confirm' && (
            <>
              {/* Court Card Banner */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-xs shrink-0">
                    #{court.courtNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{court.name}</h4>
                    <p className="text-xs text-slate-500">
                      {court.type === 'indoor' ? 'Indoor AC' : court.type === 'championship' ? 'Championship Stadium' : 'Pro Hardcourt'} • {court.venue}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Rate</span>
                  <span className="text-xs font-black text-slate-900">₱{court.pricePerHour}/hr</span>
                </div>
              </div>

              {/* Selected Parameters (Date & Court) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar className="h-4 w-4 text-[#4d7c0f]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Selected Date
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {date}
                  </div>
                </div>

                {/* Court */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Court
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm truncate">
                    Court #{court.courtNumber}
                  </div>
                </div>
              </div>

              {/* LIST ALL TIME BOOKED */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span>Selected Times ({timesToDisplay.length} {timesToDisplay.length === 1 ? 'Slot' : 'Slots'})</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    {timesToDisplay.length} Hour{timesToDisplay.length > 1 ? 's' : ''} Total
                  </span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
                  {timesToDisplay.map((time, idx) => {
                    const price = getSlotPrice(time);
                    const isPeak = time.includes('04:') || time.includes('05:') || time.includes('06:') || time.includes('07:') || time.includes('08:');

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-700">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold text-slate-900">{time}</span>
                          <span className="text-slate-400 text-[10px]">• 1 hour</span>
                          {isPeak && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                              Peak
                            </span>
                          )}
                        </div>
                        <span className="font-black text-slate-900">₱{price}.00</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Court Time ({timesToDisplay.length} {timesToDisplay.length === 1 ? 'hr' : 'hrs'}):</span>
                  <span className="font-bold text-slate-900">₱{courtTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Facility Access Fee:</span>
                  <span className="font-bold text-slate-900">₱0.00 (Waived)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-950">
                  <span>Total Booking Price:</span>
                  <span className="text-blue-600 text-base font-black">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons: Cancel vs Proceed to Payment */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-xs font-bold text-white hover:bg-[#1d4ed8] active:scale-98 transition-all shadow-md cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* STEP 2: PROCEED TO PAYMENT */}
          {step === 'payment' && (
            <>
              {/* Summary Pill */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking Details</span>
                  <span className="font-black text-slate-900">
                    Court #{court.courtNumber} • {date} ({timesToDisplay.length} slot{timesToDisplay.length > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Due</span>
                  <span className="text-sm font-black text-blue-600">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    <span>Select Payment Method</span>
                  </label>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Lock className="h-3 w-3" /> 256-Bit SSL
                  </span>
                </div>

                {/* Option Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Club Wallet</span>
                  </button>
                </div>

                {/* Method Details Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs">
                  {paymentMethod === 'card' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">Credit / Debit Card</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1 rounded">VISA</span>
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded">MC</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-700 text-xs">
                        <span>•••• •••• •••• 4242</span>
                        <span className="text-slate-400">08/28 • CVC ***</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-slate-800" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">Apple Pay</div>
                          <div className="text-[10px] text-slate-500">Chase Sapphire Preferred (•••• 9104)</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Ready
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-[#4d7c0f]" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">PickleSync Club Balance</div>
                          <div className="text-[10px] text-slate-500">Available: ₱1,500.00 credit</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#4d7c0f]">
                        -₱{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Keyless Entry Assurance */}
              <div className="flex items-center gap-2 rounded-xl bg-blue-50/70 border border-blue-100 p-2.5 text-xs text-blue-900">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Your QR entry pass and PIN code will be generated immediately after payment.</span>
              </div>

              {/* Action Buttons: Back vs Pay & Confirm */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('confirm')}
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleProcessPayment}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-xs font-bold text-white hover:bg-[#1d4ed8] active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'card'
                          ? `Pay ₱${totalPrice.toFixed(2)} with Card`
                          : paymentMethod === 'apple_pay'
                            ? `Pay ₱${totalPrice.toFixed(2)} with Apple Pay`
                            : `Pay ₱${totalPrice.toFixed(2)} from Wallet`}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: CONFIRMED & QR CODE GENERATED */}
          {step === 'success' && confirmedReservation && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-950">
                  Reservation Confirmed!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Court #{court.courtNumber} is booked. Your keyless access pass and QR code have been generated.
                </p>
              </div>

              {/* Digital Pass Card with Generated QR Code */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pass Code
                    </span>
                    <div className="text-sm font-mono font-black text-slate-900">
                      {confirmedReservation.accessPassCode}
                    </div>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    Paid • Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Court</span>
                    <span className="font-bold text-slate-900">Court #{court.courtNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Date</span>
                    <span className="font-bold text-slate-900">{confirmedReservation.date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Booked Times</span>
                    <span className="font-bold text-blue-600 break-words">{confirmedReservation.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Gate PIN</span>
                    <span className="font-mono font-bold text-slate-900">*4829#</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Paid</span>
                    <span className="font-bold text-emerald-700">₱{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Generated QR Code */}
                <div className="pt-2 flex flex-col items-center justify-center">
                  <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                    <QrCode className="h-28 w-28 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1.5">
                    SCAN AT TURNSTILE GATE 03
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-[#2563eb] py-3 text-xs font-bold text-white hover:bg-[#1d4ed8] transition-colors cursor-pointer shadow-sm"
                >
                  Done & Close
                </button>
                <button
                  onClick={() => alert(`Pass code ${confirmedReservation.accessPassCode} copied to clipboard!`)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Pass</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
