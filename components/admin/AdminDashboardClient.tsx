'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { COURTS_DATA } from '@/lib/courts';
import { useBooking } from '@/components/providers/BookingProvider';
import { Court } from '@/types/booking';
import {
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Shield,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  Wrench,
  ExternalLink,
  Menu,
  X,
  Plus,
  Grid,
  Download,
  Check,
  Calendar,
  Filter,
  User,
  SlidersHorizontal,
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INITIAL_WEEKLY_REVENUE = [
  { day: 'Mon', value: 3200 },
  { day: 'Tue', value: 4100 },
  { day: 'Wed', value: 3750 },
  { day: 'Thu', value: 5800 },
  { day: 'Fri', value: 7200 },
  { day: 'Sat', value: 9400 },
  { day: 'Sun', value: 6100 },
];

interface ActivityItem {
  id: string;
  player: string;
  court: string;
  time: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  initials: string;
  color: string;
}

const INITIAL_RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'BK-901234', player: 'Marcus L.', court: 'Center Court Championship', time: '2 min ago', amount: 200, status: 'confirmed', initials: 'ML', color: 'bg-[#d2e3fc] text-[#0b57d0]' },
  { id: 'BK-901190', player: 'Sarah K.', court: 'The Sonic Dome', time: '14 min ago', amount: 180, status: 'confirmed', initials: 'SK', color: 'bg-[#ceead6] text-[#137333]' },
  { id: 'BK-901043', player: 'Jake T.', court: 'Rooftop Blaze', time: '31 min ago', amount: 160, status: 'pending', initials: 'JT', color: 'bg-[#feefc3] text-[#b06000]' },
  { id: 'BK-900988', player: 'Priya M.', court: 'The Neon Grid (UV)', time: '1 hr ago', amount: 200, status: 'confirmed', initials: 'PM', color: 'bg-[#f3e8fd] text-[#7c3aed]' },
  { id: 'BK-900712', player: 'Chris D.', court: 'Canyon View Outdoor', time: '2 hr ago', amount: 140, status: 'cancelled', initials: 'CD', color: 'bg-[#fad2cf] text-[#c5221f]' },
  { id: 'BK-900401', player: 'Wei Z.', court: 'Center Court Championship', time: '3 hr ago', amount: 200, status: 'confirmed', initials: 'WZ', color: 'bg-[#e8eaed] text-[#3c4043]' },
];

const MEMBERS_ONLINE = [
  { name: 'Marcus L.', email: 'marcus.l@example.com', dupr: 4.2, initials: 'ML', status: 'playing', court: 'Center Court' },
  { name: 'Sarah K.', email: 'sarah.k@example.com', dupr: 3.8, initials: 'SK', status: 'booked', court: 'Sonic Dome' },
  { name: 'Jake T.', email: 'jake.t@example.com', dupr: 5.0, initials: 'JT', status: 'booked', court: 'Rooftop Blaze' },
  { name: 'Priya M.', email: 'priya.m@example.com', dupr: 4.5, initials: 'PM', status: 'browsing', court: 'Lounge' },
];

const NOTIFICATIONS = [
  { id: 'n1', title: 'New reservation confirmed', desc: 'Marcus L. booked Center Court for 07:00 PM', time: '2m ago', unread: true },
  { id: 'n2', title: 'Maintenance scheduled', desc: 'Court 3 LED illumination inspection at 11:00 PM', time: '1h ago', unread: true },
  { id: 'n3', title: 'Weekly payout processed', desc: '₱12,450 sent to Stripe primary club balance', time: '4h ago', unread: false },
  { id: 'n4', title: 'High court demand', desc: 'Occupancy exceeded 85% for weekend slots', time: '1d ago', unread: false },
];

// ─── Navigation Items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Courts', label: 'Courts', icon: MapPin },
  { id: 'Bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'Members', label: 'Members', icon: Users },
  { id: 'Revenue', label: 'Revenue & Reports', icon: BarChart3 },
  { id: 'Settings', label: 'Settings', icon: Settings },
];

// ─── Status Badge Component ──────────────────────────────────────────────────
function CourtStatusBadge({
  status,
  onClick,
}: {
  status: string;
  onClick?: () => void;
}) {
  const configs: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    available: { label: 'Available', bg: 'bg-[#e6f4ea]', text: 'text-[#137333]', dot: 'bg-[#1e8e3e]' },
    in_play: { label: 'In Play', bg: 'bg-[#fef7e0]', text: 'text-[#b06000]', dot: 'bg-[#ea8600]' },
    reserved: { label: 'Reserved', bg: 'bg-[#e8f0fe]', text: 'text-[#1967d2]', dot: 'bg-[#1a73e8]' },
    maintenance: { label: 'Maintenance', bg: 'bg-[#fce8e6]', text: 'text-[#c5221f]', dot: 'bg-[#d93025]' },
  };

  const c = configs[status] || configs.available;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity ${c.bg} ${c.text} ${onClick ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </button>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; bg: string; text: string }> = {
    confirmed: { label: 'Confirmed', bg: 'bg-[#e6f4ea]', text: 'text-[#137333]' },
    pending: { label: 'Pending', bg: 'bg-[#fef7e0]', text: 'text-[#b06000]' },
    cancelled: { label: 'Cancelled', bg: 'bg-[#fce8e6]', text: 'text-[#c5221f]' },
  };
  const c = configs[status] || configs.confirmed;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ─── Main Admin Dashboard Component ──────────────────────────────────────────
export function AdminDashboardClient() {
  const { bookings, addBooking, cancelBooking, showToast } = useBooking();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<'Today' | 'This week' | 'This month'>('Today');
  const [courtStatusFilter, setCourtStatusFilter] = useState<string>('all');
  const [bookingFilterTab, setBookingFilterTab] = useState<'all' | 'live' | 'confirmed' | 'pending'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  // Modals & Popovers
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isCourtStatusModalOpen, setIsCourtStatusModalOpen] = useState(false);
  const [selectedCourtForStatus, setSelectedCourtForStatus] = useState<Court | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Editable courts state
  const [courtsList, setCourtsList] = useState<Court[]>(COURTS_DATA);

  // New reservation form state
  const [formCourtId, setFormCourtId] = useState(COURTS_DATA[0].id);
  const [formPlayerName, setFormPlayerName] = useState('');
  const [formTimeSlot, setFormTimeSlot] = useState('06:00 PM');
  const [formDate, setFormDate] = useState('Today');
  const [formDuration, setFormDuration] = useState('60');

  // Calculate court counts
  const totalCourts = courtsList.length;
  const availableCourts = courtsList.filter((c) => c.status === 'available').length;
  const inPlayCourts = courtsList.filter((c) => c.status === 'in_play').length;
  const reservedCourts = courtsList.filter((c) => c.status === 'reserved').length;
  const maintenanceCourts = courtsList.filter((c) => c.status === 'maintenance').length;

  const totalBookingsCount = bookings.length + INITIAL_RECENT_ACTIVITY.length;
  const totalRevenueToday = 15500 + bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const occupancyPercent = Math.round(((inPlayCourts + reservedCourts) / totalCourts) * 100);

  // Maximum value for revenue chart
  const maxRevenueBar = Math.max(...INITIAL_WEEKLY_REVENUE.map((d) => d.value));

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
      showToast('Dashboard refreshed with latest club data');
    }, 600);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['Booking ID', 'Court Name', 'Player/Details', 'Time', 'Amount', 'Status'],
      ...bookings.map((b) => [b.bookingId, b.courtName, b.playerNames.join(', '), `${b.date} ${b.timeSlot}`, `$${b.totalPrice}`, 'confirmed']),
      ...INITIAL_RECENT_ACTIVITY.map((a) => [a.id, a.court, a.player, a.time, `$${a.amount}`, a.status]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PickleSync_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded successfully');
  };

  // Filter courts by search and status
  const filteredCourts = useMemo(() => {
    return courtsList.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = courtStatusFilter === 'all' || c.status === courtStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courtsList, searchQuery, courtStatusFilter]);

  // Filter bookings by tab and search
  const filteredRecentBookings = useMemo(() => {
    const combined = [
      ...bookings.map((b) => ({
        id: b.bookingId,
        court: b.courtName,
        player: b.playerNames[0] || 'Member',
        time: `${b.date} · ${b.timeSlot}`,
        amount: b.totalPrice,
        status: 'confirmed' as const,
        isLive: true,
        initials: (b.playerNames[0] || 'MB').slice(0, 2).toUpperCase(),
        color: 'bg-[#d2e3fc] text-[#0b57d0]',
      })),
      ...INITIAL_RECENT_ACTIVITY.map((a) => ({
        ...a,
        isLive: false,
      })),
    ];

    return combined.filter((b) => {
      const matchesSearch =
        searchQuery === '' ||
        b.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.player.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (bookingFilterTab === 'live') return b.isLive;
      if (bookingFilterTab === 'confirmed') return b.status === 'confirmed';
      if (bookingFilterTab === 'pending') return b.status === 'pending';
      return true;
    });
  }, [bookings, searchQuery, bookingFilterTab]);

  // Handle status update for a court
  const handleUpdateCourtStatus = (newStatus: 'available' | 'in_play' | 'reserved' | 'maintenance') => {
    if (!selectedCourtForStatus) return;
    setCourtsList((prev) =>
      prev.map((c) => (c.id === selectedCourtForStatus.id ? { ...c, status: newStatus } : c))
    );
    setIsCourtStatusModalOpen(false);
    showToast(`Updated ${selectedCourtForStatus.name} status to ${newStatus.replace('_', ' ')}`);
  };

  // Handle creating a new reservation
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlayerName.trim()) {
      showToast('Please enter a player name');
      return;
    }

    const selectedCourt = courtsList.find((c) => c.id === formCourtId) || courtsList[0];
    const newId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    addBooking({
      bookingId: newId,
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      courtNumber: selectedCourt.courtNumber,
      venue: selectedCourt.venue,
      date: formDate,
      timeSlot: formTimeSlot,
      durationMinutes: parseInt(formDuration, 10),
      addOns: [],
      playerNames: [formPlayerName.trim()],
      splitPayment: false,
      totalPrice: selectedCourt.pricePerHour,
      createdAt: 'Just now',
      accessPassCode: `SYNC-CRT${selectedCourt.courtNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setIsNewBookingModalOpen(false);
    setFormPlayerName('');
    showToast(`Reservation ${newId} confirmed for ${formPlayerName}!`);
  };

  return (
    <div className="flex h-screen bg-[#f8fafd] text-[#1f1f1f] font-sans antialiased overflow-hidden">

      {/* ── Mobile Sidebar Overlay ────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#202124]/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Left Sidebar (Google Workspace / Material Design 3 Style) ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r border-[#dadce0] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          }`}
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center px-5 border-b border-[#f1f3f4] gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b57d0] text-white shadow-sm">
            <span className="text-base font-semibold tracking-tight">P</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-medium text-[#1f1f1f] tracking-tight">PickleSync</span>
              <span className="text-[11px] font-medium bg-[#e8f0fe] text-[#0b57d0] px-1.5 py-0.2 rounded-md">Admin</span>
            </div>
            <span className="text-[11px] text-[#747775]">Club Operations</span>
          </div>
          <button
            type="button"
            className="ml-auto p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button: Google FAB style */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => setIsNewBookingModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-[#c2e7ff] text-[#001d35] hover:bg-[#b5defc] transition-all shadow-[0_1px_3px_0_rgba(60,64,67,0.3)] hover:shadow-[0_2px_6px_2px_rgba(60,64,67,0.15)] font-medium text-sm"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span>New Reservation</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeNav === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveNav(id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${isActive
                    ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                    : 'text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f]'
                  }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-[#001d35]' : 'text-[#444746]'}`} />
                <span className="truncate">{label}</span>
                {id === 'Bookings' && totalBookingsCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${isActive ? 'bg-[#001d35] text-white' : 'bg-[#e8f0fe] text-[#0b57d0]'
                      }`}
                  >
                    {totalBookingsCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Filter Section */}
          <div className="pt-4 mt-3 border-t border-[#f1f3f4]">
            <p className="px-4 text-[11px] font-semibold uppercase tracking-wider text-[#747775] mb-1.5">
              Court Filters
            </p>
            <div className="space-y-0.5">
              {[
                { id: 'all', label: 'All Courts', count: totalCourts },
                { id: 'available', label: 'Available', count: availableCourts, dot: 'bg-[#1e8e3e]' },
                { id: 'in_play', label: 'In Play', count: inPlayCourts, dot: 'bg-[#ea8600]' },
                { id: 'maintenance', label: 'Maintenance', count: maintenanceCourts, dot: 'bg-[#d93025]' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCourtStatusFilter(f.id)}
                  className={`w-full flex items-center justify-between px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${courtStatusFilter === f.id
                      ? 'bg-[#e8f0fe] text-[#0b57d0] font-semibold'
                      : 'text-[#5f6368] hover:bg-[#f8fafd] hover:text-[#1f1f1f]'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {f.dot && <span className={`h-2 w-2 rounded-full ${f.dot}`} />}
                    <span>{f.label}</span>
                  </div>
                  <span className="text-[11px] text-[#747775]">{f.count}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer: Resource Meter & Links */}
        <div className="p-3 border-t border-[#f1f3f4] space-y-2">
          {/* Active occupancy meter */}
          <div className="bg-[#f8fafd] rounded-xl p-3 border border-[#eef0f4]">
            <div className="flex items-center justify-between text-xs text-[#444746] mb-1.5">
              <span className="font-medium">Court Capacity</span>
              <span className="font-semibold text-[#1f1f1f]">{inPlayCourts + reservedCourts}/{totalCourts} Active</span>
            </div>
            <div className="h-1.5 w-full bg-[#e0e2ec] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0b57d0] rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Google Top Bar (App Bar) ─────────────────────────────────── */}
        <header className="h-16 bg-white border-b border-[#dadce0] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium text-[#1f1f1f] hidden sm:inline">
              Club Console
            </span>
          </div>

          {/* Google Pill Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative flex items-center w-full h-11 rounded-full bg-[#f0f4f9] hover:bg-[#e9eef6] focus-within:bg-white focus-within:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] focus-within:border focus-within:border-[#dadce0] transition-all px-4">
              <Search className="h-4 w-4 text-[#5f6368] flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courts, bookings, members..."
                className="w-full bg-transparent pl-3 pr-2 text-sm text-[#1f1f1f] placeholder-[#5f6368] outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#5f6368] hover:text-[#1f1f1f] rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh data"
              className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors relative"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#0b57d0]' : ''}`} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowAppsMenu(false);
                  setShowUserMenu(false);
                }}
                title="Notifications"
                className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#0b57d0]" />
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_16px_rgba(60,64,67,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
                    <span className="text-sm font-semibold text-[#1f1f1f]">Notifications</span>
                    <span className="text-xs text-[#0b57d0] hover:underline cursor-pointer font-medium">Mark all read</span>
                  </div>
                  <div className="divide-y divide-[#f1f3f4] max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="py-2.5 flex items-start gap-3 hover:bg-[#f8fafd] px-1 rounded-lg">
                        <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-[#0b57d0]' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#1f1f1f]">{n.title}</p>
                          <p className="text-xs text-[#5f6368] mt-0.5 line-clamp-2">{n.desc}</p>
                          <p className="text-[10px] text-[#747775] mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Google 9-dots Apps menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowAppsMenu(!showAppsMenu);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
                title="Club Apps"
                className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors"
              >
                <Grid className="h-4 w-4" />
              </button>

              {/* Apps Menu Dropdown */}
              {showAppsMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_16px_rgba(60,64,67,0.18)] p-4 z-50">
                  <p className="text-xs font-semibold text-[#5f6368] mb-3">Quick Navigation</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Link
                      href="/"
                      className="p-2.5 rounded-xl hover:bg-[#f0f4f9] flex flex-col items-center gap-1.5 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] text-[#1f1f1f] font-medium">Site</span>
                    </Link>
                    <Link
                      href="/book"
                      className="p-2.5 rounded-xl hover:bg-[#f0f4f9] flex flex-col items-center gap-1.5 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
                        <Activity className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] text-[#1f1f1f] font-medium">Book</span>
                    </Link>
                    <Link
                      href="/bookings"
                      className="p-2.5 rounded-xl hover:bg-[#f0f4f9] flex flex-col items-center gap-1.5 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#feefc3] text-[#b06000] flex items-center justify-center">
                        <CalendarCheck className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] text-[#1f1f1f] font-medium">Bookings</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                  setShowAppsMenu(false);
                }}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0b57d0] text-white text-xs font-semibold hover:ring-2 hover:ring-[#0b57d0]/30 transition-all"
                title="Google Account: Club Administrator"
              >
                A
              </button>

              {/* User Account Popover */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_16px_rgba(60,64,67,0.18)] p-4 z-50 text-center">
                  <div className="flex flex-col items-center pb-3 border-b border-[#f1f3f4]">
                    <div className="h-12 w-12 rounded-full bg-[#0b57d0] text-white text-lg font-bold flex items-center justify-center mb-2">
                      A
                    </div>
                    <span className="text-sm font-semibold text-[#1f1f1f]">Club Manager</span>
                    <span className="text-xs text-[#5f6368]">admin@picklesync.com</span>
                  </div>
                  <div className="pt-3 space-y-1">
                    <Link
                      href="/"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-medium text-[#1f1f1f] border border-[#dadce0] hover:bg-[#f8fafd]"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#5f6368]" />
                      Back to public website
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        showToast('Signed out of admin session');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-medium text-[#c5221f] hover:bg-[#fce8e6] transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── Scrollable Dashboard Content ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Subheader: Title & Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">Dashboard</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e] animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-1">
                Real-time on-site court occupancy, booking revenue, and member activity · Updated {lastRefreshed}
              </p>
            </div>

            {/* Timeframe pill selector & Export */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex rounded-full bg-[#eef2f6] p-0.5 border border-[#dadce0]">
                {(['Today', 'This week', 'This month'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${timeframe === t
                        ? 'bg-white text-[#1f1f1f] shadow-sm font-semibold'
                        : 'text-[#5f6368] hover:text-[#1f1f1f]'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dadce0] bg-white text-xs font-medium text-[#444746] hover:bg-[#f8fafd] transition-colors shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-[#5f6368]" />
                Export CSV
              </button>
            </div>
          </div>

          {/* ── KPI Metric Cards ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Card 1: Revenue */}
            <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[#444746]">Total Revenue Today</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  +18.4%
                </span>
              </div>
              <div className="my-2">
                <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
                  ₱{totalRevenueToday.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-[#747775]">
                <span>vs ₱8,900 yesterday</span>
                <span className="h-2 w-2 rounded-full bg-[#1e8e3e]" />
              </div>
            </div>

            {/* Card 2: Bookings */}
            <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[#444746]">Active Bookings</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#0b57d0] bg-[#e8f0fe] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  +{bookings.length + 3} today
                </span>
              </div>
              <div className="my-2">
                <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
                  {totalBookingsCount}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-[#747775]">
                <span>{bookings.length} live from this session</span>
                <span className="h-2 w-2 rounded-full bg-[#0b57d0]" />
              </div>
            </div>

            {/* Card 3: Occupancy */}
            <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[#444746]">Court Occupancy</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  +5% peak
                </span>
              </div>
              <div className="my-2">
                <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
                  {occupancyPercent}%
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-[#747775]">
                <span>{availableCourts} of {totalCourts} courts free</span>
                <span className="h-2 w-2 rounded-full bg-[#ea8600]" />
              </div>
            </div>

            {/* Card 4: Members */}
            <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[#444746]">Active Members</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  +12 this week
                </span>
              </div>
              <div className="my-2">
                <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
                  284
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-[#747775]">
                <span>4 members online now</span>
                <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
              </div>
            </div>

          </div>

          {/* ── Charts & Resource Breakdown ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Revenue Analytics (Google Analytics Style Bar Chart) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dadce0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#1f1f1f]">Weekly Revenue Overview</h2>
                  <p className="text-xs text-[#5f6368] mt-0.5">Court bookings and facility passes for last 7 days</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#137333] bg-[#e6f4ea] px-2.5 py-1 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +22% vs previous period
                </div>
              </div>

              {/* Minimal Clean Bars */}
              <div className="pt-4 pb-2 border-b border-[#f1f3f4]">
                <div className="flex items-end gap-3 sm:gap-6 h-44">
                  {INITIAL_WEEKLY_REVENUE.map((d) => {
                    const heightPercent = Math.round((d.value / maxRevenueBar) * 100);
                    const isSunday = d.day === 'Sun';
                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                          {/* Hover Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#202124] text-white text-[11px] font-medium py-1 px-2 rounded-md shadow-md pointer-events-none whitespace-nowrap z-10">
                            ₱{d.value.toLocaleString()}
                          </div>
                          <div
                            className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${isSunday
                                ? 'bg-[#0b57d0] hover:bg-[#0842a0]'
                                : 'bg-[#d3e3fd] hover:bg-[#a8c7fa]'
                              }`}
                            style={{ height: `${heightPercent}%`, minHeight: '6px' }}
                          />
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isSunday ? 'text-[#0b57d0] font-semibold' : 'text-[#747775]'}`}>
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Baseline legend */}
              <div className="flex items-center justify-between text-[11px] text-[#747775] pt-3">
                <span>Baseline: ₱0</span>
                <span>Peak day: Sat (₱9,400)</span>
                <span>Total 7-day revenue: ₱39,550</span>
              </div>
            </div>

            {/* Court Utilization Breakdown (Google Cloud Resource Monitor Style) */}
            <div className="bg-white rounded-2xl border border-[#dadce0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#1f1f1f]">Court Utilization</h2>
                  <span className="text-xs text-[#5f6368] font-medium">{totalCourts} Total Courts</span>
                </div>

                {/* Minimal Segmented Progress Bar */}
                <div className="space-y-3">
                  <div className="h-3 w-full bg-[#f1f3f4] rounded-full overflow-hidden flex">
                    <div
                      title={`Available: ${availableCourts}`}
                      style={{ width: `${(availableCourts / totalCourts) * 100}%` }}
                      className="h-full bg-[#1e8e3e]"
                    />
                    <div
                      title={`In Play: ${inPlayCourts}`}
                      style={{ width: `${(inPlayCourts / totalCourts) * 100}%` }}
                      className="h-full bg-[#ea8600]"
                    />
                    <div
                      title={`Reserved: ${reservedCourts}`}
                      style={{ width: `${(reservedCourts / totalCourts) * 100}%` }}
                      className="h-full bg-[#1a73e8]"
                    />
                    <div
                      title={`Maintenance: ${maintenanceCourts}`}
                      style={{ width: `${(maintenanceCourts / totalCourts) * 100}%` }}
                      className="h-full bg-[#d93025]"
                    />
                  </div>

                  {/* Clean Legend list */}
                  <div className="space-y-2 pt-2">
                    {[
                      { label: 'Available', count: availableCourts, color: 'bg-[#1e8e3e]', text: 'Ready for booking' },
                      { label: 'In Play', count: inPlayCourts, color: 'bg-[#ea8600]', text: 'Match in progress' },
                      { label: 'Reserved', count: reservedCourts, color: 'bg-[#1a73e8]', text: 'Scheduled later today' },
                      { label: 'Maintenance', count: maintenanceCourts, color: 'bg-[#d93025]', text: 'Inspection or cleaning' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1 border-b border-[#f8fafd]">
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                          <div>
                            <span className="text-xs font-medium text-[#1f1f1f]">{item.label}</span>
                            <span className="text-[10px] text-[#747775] ml-2 hidden sm:inline">{item.text}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#1f1f1f]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f1f3f4]">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(true)}
                  className="w-full text-center py-2 rounded-full border border-[#dadce0] text-xs font-medium text-[#0b57d0] hover:bg-[#e8f0fe] transition-colors"
                >
                  Quick Reserve Court Slot
                </button>
              </div>
            </div>

          </div>

          {/* ── Courts Management Table ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#1f1f1f]">Courts Overview</h2>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Click any court status chip to instantly change its live status
                </p>
              </div>

              {/* Status filter chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['all', 'available', 'in_play', 'reserved', 'maintenance'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setCourtStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${courtStatusFilter === st
                        ? 'bg-[#0b57d0] text-white font-semibold'
                        : 'bg-[#f1f3f4] text-[#444746] hover:bg-[#e0e2ec]'
                      }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] font-medium">
                  <tr>
                    <th className="px-5 py-3">Court Name & Location</th>
                    <th className="px-4 py-3">Surface & Specs</th>
                    <th className="px-4 py-3">Status (Click to toggle)</th>
                    <th className="px-4 py-3">Hourly Rate</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f4]">
                  {filteredCourts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#747775]">
                        No courts matching current filter or search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCourts.map((court) => (
                      <tr key={court.id} className="hover:bg-[#f8fafd] transition-colors">
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/book?court=${court.id}`}
                            className="font-semibold text-[#1f1f1f] hover:text-[#0b57d0] transition-colors"
                          >
                            {court.name}
                          </Link>
                          <p className="text-[11px] text-[#747775] mt-0.5">{court.location}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[#444746]">
                          <span className="capitalize">{court.type}</span> · {court.surface.split(' ')[0]}
                        </td>
                        <td className="px-4 py-3.5">
                          <CourtStatusBadge
                            status={court.status}
                            onClick={() => {
                              setSelectedCourtForStatus(court);
                              setIsCourtStatusModalOpen(true);
                            }}
                          />
                        </td>
                        <td className="px-4 py-3.5 font-medium text-[#1f1f1f]">
                          ₱{court.pricePerHour}/hr
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/book?court=${court.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0b57d0] hover:underline"
                          >
                            Book <ChevronRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Recent Bookings Table ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#1f1f1f]">Recent Bookings & Activity</h2>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Real-time club reservations and player bookings
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'live', 'confirmed', 'pending'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setBookingFilterTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${bookingFilterTab === tab
                        ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                        : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                      }`}
                  >
                    {tab === 'live' ? 'Live Session' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-[#f1f3f4]">
              {filteredRecentBookings.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#747775]">
                  No bookings found for the selected criteria.
                </div>
              ) : (
                filteredRecentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 sm:px-5 flex items-center justify-between hover:bg-[#f8fafd] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Avatar */}
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${b.color}`}
                      >
                        {b.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-[#1f1f1f] truncate">{b.player}</p>
                          {b.isLive && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-semibold">
                              <span className="h-1 w-1 rounded-full bg-[#1e8e3e] animate-pulse" />
                              Active Session
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5f6368] mt-0.5 truncate">
                          {b.court} · {b.time}
                        </p>
                      </div>
                    </div>

                    {/* Right side amount & action */}
                    <div className="flex items-center gap-3 ml-3 text-right">
                      <div>
                        <p className="text-xs font-semibold text-[#1f1f1f]">${b.amount}</p>
                        <BookingStatusBadge status={b.status} />
                      </div>

                      {b.isLive && (
                        <button
                          type="button"
                          onClick={() => {
                            cancelBooking(b.id);
                            showToast(`Reservation ${b.id} cancelled`);
                          }}
                          className="px-2.5 py-1 text-xs text-[#c5221f] hover:bg-[#fce8e6] rounded-full font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Quick Admin Actions ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
            <h2 className="text-sm font-semibold text-[#1f1f1f] mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Add Reservation', icon: Plus, action: () => setIsNewBookingModalOpen(true), bg: 'hover:bg-[#e8f0fe] text-[#0b57d0]' },
                { label: 'Download CSV Report', icon: Download, action: handleExportCSV, bg: 'hover:bg-[#e6f4ea] text-[#137333]' },
                { label: 'View Booking Page', icon: CalendarCheck, href: '/book', bg: 'hover:bg-[#fef7e0] text-[#b06000]' },
                { label: 'Club Settings', icon: Settings, action: () => showToast('Settings panel opened'), bg: 'hover:bg-[#f3e8fd] text-[#7c3aed]' },
              ].map((item) => {
                const Icon = item.icon;
                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#dadce0] bg-white transition-all text-center ${item.bg}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium text-[#1f1f1f]">{item.label}</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#dadce0] bg-white transition-all text-center ${item.bg}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-[#1f1f1f]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </main>
      </div>

      {/* ── Google Material Modal: Create New Reservation ─────────────── */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202124]/40 backdrop-blur-[1px] p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_24px_rgba(60,64,67,0.2)] p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f4]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-[#c2e7ff] text-[#001d35] flex items-center justify-center">
                  <Plus className="h-4 w-4 stroke-[3]" />
                </div>
                <h3 className="text-base font-semibold text-[#1f1f1f]">New Court Reservation</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="pt-4 space-y-4">
              {/* Player Name */}
              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1">Player Name</label>
                <input
                  type="text"
                  required
                  value={formPlayerName}
                  onChange={(e) => setFormPlayerName(e.target.value)}
                  placeholder="e.g. Marcus Lopez"
                  className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0]"
                />
              </div>

              {/* Court Selection */}
              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1">Court</label>
                <select
                  value={formCourtId}
                  onChange={(e) => setFormCourtId(e.target.value)}
                  className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] bg-white cursor-pointer"
                >
                  {courtsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.pricePerHour}/hr)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#444746] mb-1">Date</label>
                  <select
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] bg-white cursor-pointer"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Friday">This Friday</option>
                    <option value="Saturday">This Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#444746] mb-1">Time Slot</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] bg-white cursor-pointer"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {['60', '90', '120'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setFormDuration(dur)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-colors ${formDuration === dur
                          ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0] font-semibold'
                          : 'border-[#dadce0] text-[#444746] hover:bg-[#f8fafd]'
                        }`}
                    >
                      {dur} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#f1f3f4]">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#0b57d0] text-white hover:bg-[#0842a0] transition-colors shadow-sm"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Google Material Modal: Change Court Status ─────────────────── */}
      {isCourtStatusModalOpen && selectedCourtForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202124]/40 backdrop-blur-[1px] p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_24px_rgba(60,64,67,0.2)] p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
              <div>
                <h3 className="text-sm font-semibold text-[#1f1f1f]">Change Court Status</h3>
                <p className="text-xs text-[#5f6368]">{selectedCourtForStatus.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCourtStatusModalOpen(false)}
                className="p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="pt-4 space-y-2">
              {[
                { status: 'available' as const, label: 'Available', desc: 'Court is open for public reservations', dot: 'bg-[#1e8e3e]' },
                { status: 'in_play' as const, label: 'In Play', desc: 'Players are currently on court', dot: 'bg-[#ea8600]' },
                { status: 'reserved' as const, label: 'Reserved', desc: 'Booked for an upcoming slot', dot: 'bg-[#1a73e8]' },
                { status: 'maintenance' as const, label: 'Maintenance', desc: 'Court closed for cleaning or repairs', dot: 'bg-[#d93025]' },
              ].map((opt) => (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => handleUpdateCourtStatus(opt.status)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${selectedCourtForStatus.status === opt.status
                      ? 'border-[#0b57d0] bg-[#e8f0fe]/60'
                      : 'border-[#dadce0] hover:bg-[#f8fafd]'
                    }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full mt-1 flex-shrink-0 ${opt.dot}`} />
                  <div>
                    <span className="text-xs font-semibold text-[#1f1f1f]">{opt.label}</span>
                    <p className="text-[11px] text-[#5f6368] mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 mt-2 flex justify-end border-t border-[#f1f3f4]">
              <button
                type="button"
                onClick={() => setIsCourtStatusModalOpen(false)}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-[#444746] hover:bg-[#f1f3f4]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
