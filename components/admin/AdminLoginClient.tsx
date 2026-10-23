'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  Activity,
  Sparkles,
  HelpCircle,
  Check,
  Loader2,
  Building2,
  UserCheck,
  RefreshCw,
  X,
} from 'lucide-react';
import { PickleMascot } from '@/components/ui/PickleMascot';

interface RolePreset {
  id: string;
  name: string;
  role: string;
  email: string;
  badgeColor: string;
  description: string;
}

const PRESET_ACCOUNTS: RolePreset[] = [
  {
    id: 'gm',
    name: 'Sarah Jenkins',
    role: 'General Manager',
    email: 'gm@picklesync.com',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Full Console Access & Financials',
  },
  {
    id: 'desk',
    name: 'Marcus Chen',
    role: 'Front Desk Lead',
    email: 'frontdesk@picklesync.com',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Court Check-in & Booking Dispatch',
  },
  {
    id: 'ops',
    name: 'Elena Rostova',
    role: 'Court Operations',
    email: 'ops@picklesync.com',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Facility Maintenance & Real-time Status',
  },
];

export function AdminLoginClient() {
  const router = useRouter();

  // Mode: 'credentials' or '2fa'
  const [authMode, setAuthMode] = useState<'credentials' | '2fa'>('credentials');
  const [selectedRole, setSelectedRole] = useState<string>('gm');

  // Form Fields
  const [email, setEmail] = useState('gm@picklesync.com');
  const [password, setPassword] = useState('pickleMaster2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);

  // 2FA Fields (6-digits)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Error summary ref for accessible focus
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Handle Preset Selection
  const handleSelectRole = (preset: RolePreset) => {
    setSelectedRole(preset.id);
    setEmail(preset.email);
    setPassword('pickleMaster2026!');
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);
  };

  // Validation
  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    if (!email.trim()) {
      setEmailError('Please enter your staff email address');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email format (e.g., name@picklesync.com)');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your administrator password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) {
      setFormError('Please resolve the errors highlighted below.');
      setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 50);
    }

    return isValid;
  };

  // Handle Credentials Submit
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setFormError(null);

    // Simulate authenticating against session provider
    setTimeout(() => {
      setIsLoading(false);

      // Check simulated password
      if (password === 'wrong') {
        setFormError('Invalid staff credentials. Please check your password or choose a demo role.');
        setPasswordError('Incorrect password entered.');
        errorSummaryRef.current?.focus();
        return;
      }

      // If user selected 2FA mode or toggled, transition to 2FA, otherwise direct login
      if (authMode === '2fa') {
        // Already on 2FA
        handleCompleteLogin();
      } else {
        handleCompleteLogin();
      }
    }, 700);
  };

  // Handle 2FA digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto advance focus to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpRefs.current[5]?.focus();
    }
  };

  const handle2faSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setFormError('Please enter the complete 6-digit verification code.');
      errorSummaryRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleCompleteLogin();
    }, 600);
  };

  const handleCompleteLogin = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/admin');
    }, 800);
  };

  // Auto-focus first 2FA box when switching to 2FA
  useEffect(() => {
    if (authMode === '2fa') {
      otpRefs.current[0]?.focus();
    }
  }, [authMode]);

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col justify-between selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* Top Navigation & Return Link */}
      <header className="w-full border-b border-[#dadce0]/70 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#444746] hover:text-[#1f1f1f] transition-colors rounded-lg px-2.5 py-1.5 hover:bg-[#f1f3f4] cursor-pointer"
              aria-label="Return to PickleSync public homepage"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Main Website</span>
              <span className="sm:hidden">Exit</span>
            </Link>
          </div>

          {/* Center Brand */}
          <div className="flex items-center gap-2.5">
            <PickleMascot size={26} className="drop-shadow-xs" />
            <span className="text-base font-bold text-[#1f1f1f] tracking-tight">
              Pickle<span className="text-[#0b57d0]">Sync</span>
            </span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e8f0fe] text-[#0b57d0] border border-[#d2e3fc]">
              Console Admin
            </span>
          </div>

          {/* Right Help Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#444746] hover:text-[#1f1f1f] px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-[#747775]" />
              <span>Staff Support</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* ── Left Column: Operations Insight & Brand Confidence (5 cols) ── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-3xl bg-linear-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
            {/* Subtle court lines geometry background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="admin-court-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#admin-court-grid)" />
              </svg>
            </div>

            {/* Glowing Accent Orbs */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand & Real-Time Telemetry */}
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-xs">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Facility Engine Live</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">v2.4.0-prod</span>
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Club Console <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-blue-400">
                    Operations Portal
                  </span>
                </h1>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Real-time court scheduling, player check-in dispatch, revenue telemetry, and facility management for PickleSync clubs.
                </p>
              </div>

              {/* Facility Telemetry Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-medium">
                    <span>Active Courts</span>
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">8 / 8</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">94% peak utilization</div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-medium">
                    <span>Today&apos;s Sessions</span>
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">42</div>
                  <div className="text-[11px] text-blue-300 mt-0.5">100% court occupancy</div>
                </div>
              </div>

              {/* Staff Quote */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4.5 backdrop-blur-xs space-y-2">
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  &ldquo;PickleSync allows our staff to orchestrate 8 indoor courts seamlessly during peak evening leagues without double bookings or desk chaos.&rdquo;
                </p>
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="h-7 w-7 rounded-full bg-emerald-600/60 flex items-center justify-center text-xs font-semibold text-white">
                    SJ
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Sarah Jenkins</p>
                    <p className="text-[10px] text-slate-400">General Manager, Central Club</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Credentials */}
            <div className="relative z-10 pt-6 border-t border-white/10 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Enterprise Security & Audit Trail Active</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                All staff logins are encrypted via TLS 1.3 and logged with IP address and hardware fingerprint in accordance with Club Compliance Standards.
              </p>
            </div>
          </div>

          {/* ── Right Column: Interactive Login Console Form (7 cols) ── */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white rounded-3xl border border-[#dadce0] shadow-[0_12px_40px_-15px_rgba(15,23,42,0.08)] p-6 sm:p-10 transition-all">
              {/* Form Header */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#1f1f1f] tracking-tight">
                    {authMode === 'credentials' ? 'Sign in to Club Console' : 'Two-Factor Authentication'}
                  </h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f1f3f4] text-[#444746] text-xs font-medium">
                    <Building2 className="h-3.5 w-3.5 text-[#0b57d0]" />
                    <span>Facility Staff Only</span>
                  </div>
                </div>
                <p className="text-sm text-[#444746]">
                  {authMode === 'credentials'
                    ? 'Enter your club administrator credentials or select a demo role profile below.'
                    : 'Enter the 6-digit verification code sent to your authorized mobile terminal.'}
                </p>
              </div>

              {/* ── Quick Demo Role Preset Selector ── */}
              {authMode === 'credentials' && (
                <div className="mb-6 rounded-2xl bg-[#f8fafd] border border-[#dadce0] p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-[#1f1f1f] uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-[#0b57d0]" />
                      Quick Test Accounts (Click to Fill)
                    </span>
                    <span className="text-[11px] text-[#5e5e5e]">One-click evaluation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_ACCOUNTS.map((preset) => {
                      const isSelected = selectedRole === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectRole(preset)}
                          className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white border-[#0b57d0] shadow-xs ring-2 ring-[#0b57d0]/20'
                              : 'bg-white/80 border-[#dadce0] hover:bg-white hover:border-[#b0b3b8]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1f1f1f] leading-snug truncate">
                              {preset.name}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#0b57d0] shrink-0" />}
                          </div>
                          <span className="text-[11px] text-[#0b57d0] font-medium mt-0.5">
                            {preset.role}
                          </span>
                          <span className="text-[10px] text-[#747775] mt-1 line-clamp-1">
                            {preset.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Accessible Error Summary Alert ── */}
              {formError && (
                <div
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  aria-labelledby="form-error-title"
                  className="mb-6 rounded-2xl bg-[#fce8e6] border border-[#f5b7b1] p-4 text-[#ba1a1a] focus:outline-hidden focus:ring-2 focus:ring-[#ba1a1a]"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
                    <div className="space-y-1">
                      <h3 id="form-error-title" className="text-sm font-bold">
                        Authentication Notice
                      </h3>
                      <p className="text-xs leading-relaxed text-[#5c0e0e]">{formError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Success Banner during Transition ── */}
              {isSuccess && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-6 rounded-2xl bg-[#e6f4ea] border border-[#a8dab5] p-4 text-[#137333] flex items-center gap-3 animate-in fade-in"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#137333]" />
                  <div>
                    <h3 className="text-sm font-bold">Identity Verified</h3>
                    <p className="text-xs text-[#0f5323]">Opening PickleSync Club Console dashboard...</p>
                  </div>
                </div>
              )}

              {/* ── Form Mode 1: Standard Email & Password ── */}
              {authMode === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} noValidate className="space-y-5">
                  {/* Staff Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="admin-email"
                        className="block text-xs font-semibold text-[#1f1f1f] uppercase tracking-wide"
                      >
                        Staff Email / Account
                      </label>
                      <span className="text-[11px] text-[#747775]">Required</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#747775]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        id="admin-email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                        disabled={isLoading || isSuccess}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError(null);
                        }}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? 'email-error-text' : undefined}
                        placeholder="staff@picklesync.com"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white text-[#1f1f1f] transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2 ${
                          emailError
                            ? 'border-[#ba1a1a] focus-visible:ring-[#ba1a1a]'
                            : 'border-[#dadce0] hover:border-[#747775]'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p id="email-error-text" className="mt-1.5 text-xs text-[#ba1a1a] font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="admin-password"
                        className="block text-xs font-semibold text-[#1f1f1f] uppercase tracking-wide"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSupportModal(true)}
                        className="text-xs text-[#0b57d0] hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#747775]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="admin-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        disabled={isLoading || isSuccess}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(null);
                        }}
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? 'password-error-text' : undefined}
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border bg-white text-[#1f1f1f] transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2 ${
                          passwordError
                            ? 'border-[#ba1a1a] focus-visible:ring-[#ba1a1a]'
                            : 'border-[#dadce0] hover:border-[#747775]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#747775] hover:text-[#1f1f1f] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p id="password-error-text" className="mt-1.5 text-xs text-[#ba1a1a] font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberTerminal}
                        onChange={(e) => setRememberTerminal(e.target.checked)}
                        className="h-4 w-4 rounded-md border-[#747775] text-[#0b57d0] focus:ring-[#0b57d0] cursor-pointer"
                      />
                      <span className="text-xs text-[#444746] font-medium">
                        Remember this workstation for 30 days
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setAuthMode('2fa')}
                      className="text-xs text-[#0b57d0] hover:text-[#0842a0] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Use 2FA Token</span>
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isSuccess}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] active:bg-[#052d70] text-white font-semibold text-sm shadow-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Access Granted</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Console</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Form Mode 2: Two-Factor Authentication (OTP) ── */}
              {authMode === '2fa' && (
                <form onSubmit={handle2faSubmit} noValidate className="space-y-6">
                  {/* Demo 2FA code helper alert */}
                  <div className="rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc] p-3.5 text-xs text-[#0b57d0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-[#0b57d0]" />
                      <span>
                        Demo 2FA Security Token: <strong className="font-mono font-bold">482910</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(['4', '8', '2', '9', '1', '0']);
                      }}
                      className="text-xs underline font-semibold hover:text-[#0842a0] cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f1f1f] uppercase tracking-wide mb-3 text-center">
                      Enter 6-Digit Authenticator Code
                    </label>

                    {/* 6 Digit Inputs */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          disabled={isLoading || isSuccess}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border border-[#dadce0] bg-white text-[#1f1f1f] shadow-2xs focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0] focus:outline-hidden transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isSuccess}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold text-sm shadow-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0b57d0] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Validating Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Proceed to Dashboard</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('credentials');
                          setFormError(null);
                        }}
                        className="text-[#0b57d0] hover:underline font-medium cursor-pointer"
                      >
                        ← Back to standard login
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtp(['', '', '', '', '', '']);
                          otpRefs.current[0]?.focus();
                        }}
                        className="text-[#747775] hover:text-[#1f1f1f] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Clear code</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ── Footer Trust Notes ── */}
              <div className="mt-8 pt-6 border-t border-[#f1f3f4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#747775] gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span>PickleSync Facility Cloud v2.4</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="hover:text-[#1f1f1f] hover:underline cursor-pointer"
                  >
                    Privacy & Compliance
                  </button>
                  <span className="text-[#dadce0]">•</span>
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(true)}
                    className="hover:text-[#1f1f1f] hover:underline cursor-pointer"
                  >
                    Emergency IT Desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-[#dadce0] bg-white py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#747775]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} PickleSync Technologies, Inc. All rights reserved.</span>
          <span className="text-[11px] text-[#444746]">
            Authorized club staff & facility operators only. Unauthorized access is strictly prohibited.
          </span>
        </div>
      </footer>

      {/* ── Staff Support & Credential Reset Modal ── */}
      {showSupportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowSupportModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[#dadce0] shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f3f4]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#0b57d0]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 id="support-dialog-title" className="text-base font-bold text-[#1f1f1f]">
                  Club IT & Staff Support
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-[#747775] hover:bg-[#f1f3f4] cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#444746] leading-relaxed">
              If you have lost access to your PickleSync Club Console credentials or need role permissions updated:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] space-y-1">
                <p className="text-xs font-semibold text-[#1f1f1f]">General Manager Emergency Dispatch</p>
                <p className="text-xs text-[#747775]">Call: (800) 555-COURT (Ext 901)</p>
                <p className="text-xs text-[#747775]">Email: it-security@picklesync.com</p>
              </div>

              <div className="p-3 rounded-xl bg-[#e6f4ea] border border-[#a8dab5] text-[#137333] space-y-1 text-xs">
                <p className="font-semibold">Review / Demo Access Instructions:</p>
                <p>
                  You can use any of the preset account pills on the login screen to test General Manager, Front Desk, or Court Operations roles immediately with full privileges.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0b57d0] text-white text-xs font-semibold hover:bg-[#0842a0] transition-colors cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
