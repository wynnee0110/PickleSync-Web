'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { COURTS_DATA } from '@/lib/courts';
import { useBooking } from '@/components/providers/BookingProvider';
import { Court } from '@/types/booking';
import {
  NavId,
  TimeframeOption,
  BookingFilterTab,
  CourtStatus,
  CombinedBookingItem,
  ReservationFormData,
  INITIAL_WEEKLY_REVENUE,
  INITIAL_RECENT_ACTIVITY,
  MEMBERS_ONLINE,
  INITIAL_NOTIFICATIONS,
  AdminNotification,
} from './types';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminSubheader } from './AdminSubheader';
import { AdminMetricsSection } from './sections/AdminMetricsSection';
import { AdminAnalyticsSection } from './sections/AdminAnalyticsSection';
import { AdminCourtsSection } from './sections/AdminCourtsSection';
import { AdminBookingsSection } from './sections/AdminBookingsSection';
import { AdminMembersSection } from './sections/AdminMembersSection';
import { AdminQuickActionsSection } from './sections/AdminQuickActionsSection';
import { NewReservationModal } from './modals/NewReservationModal';
import { CourtStatusModal } from './modals/CourtStatusModal';

export function AdminDashboardClient() {
  const router = useRouter();
  const { bookings, addBooking, cancelBooking, showToast } = useBooking();

  // Navigation & Shell State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('Today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  // Filter States
  const [courtStatusFilter, setCourtStatusFilter] = useState<string>('all');
  const [bookingFilterTab, setBookingFilterTab] = useState<BookingFilterTab>('all');

  // Modals State
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [defaultCourtIdForBooking, setDefaultCourtIdForBooking] = useState<string>('');
  const [isCourtStatusModalOpen, setIsCourtStatusModalOpen] = useState(false);
  const [selectedCourtForStatus, setSelectedCourtForStatus] = useState<Court | null>(null);

  // Editable courts state (Courts #1 and #2 for this facility owner)
  const [courtsList, setCourtsList] = useState<Court[]>(() => COURTS_DATA.slice(0, 2));

  // Court counts & metrics
  const totalCourts = courtsList.length;
  const availableCourts = courtsList.filter((c) => c.status === 'available').length;
  const inPlayCourts = courtsList.filter((c) => c.status === 'in_play').length;
  const reservedCourts = courtsList.filter((c) => c.status === 'reserved').length;
  const maintenanceCourts = courtsList.filter((c) => c.status === 'maintenance').length;

  const totalBookingsCount = bookings.length + INITIAL_RECENT_ACTIVITY.length;
  const totalRevenueToday = 15500 + bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const occupancyPercent = Math.round(((inPlayCourts + reservedCourts) / totalCourts) * 100);

  // Handle Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
      showToast('Dashboard refreshed with latest club data');
    }, 600);
  };

  // Handle Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  // Handle Sign Out
  const handleSignOut = () => {
    showToast('Signed out of admin session');
    router.push('/admin/login');
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['Booking ID', 'Court Name', 'Player/Details', 'Time', 'Amount', 'Status'],
      ...bookings.map((b) => [
        b.bookingId,
        b.courtName,
        b.playerNames.join(', '),
        `${b.date} ${b.timeSlot}`,
        `₱${b.totalPrice}`,
        'confirmed',
      ]),
      ...INITIAL_RECENT_ACTIVITY.map((a) => [
        a.id,
        a.court,
        a.player,
        a.time,
        `₱${a.amount}`,
        a.status,
      ]),
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
  const filteredRecentBookings = useMemo<CombinedBookingItem[]>(() => {
    const combined: CombinedBookingItem[] = [
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
  const handleUpdateCourtStatus = (newStatus: CourtStatus) => {
    if (!selectedCourtForStatus) return;
    setCourtsList((prev) =>
      prev.map((c) => (c.id === selectedCourtForStatus.id ? { ...c, status: newStatus } : c))
    );
    setIsCourtStatusModalOpen(false);
    showToast(`Updated ${selectedCourtForStatus.name} status to ${newStatus.replace('_', ' ')}`);
  };

  // Handle creating a new reservation
  const handleCreateReservation = (data: ReservationFormData) => {
    const selectedCourt = courtsList.find((c) => c.id === data.courtId) || courtsList[0];
    const newId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    addBooking({
      bookingId: newId,
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      courtNumber: selectedCourt.courtNumber,
      venue: selectedCourt.venue,
      date: data.date,
      timeSlot: data.timeSlot,
      durationMinutes: parseInt(data.duration, 10),
      addOns: [],
      playerNames: [data.playerName],
      splitPayment: false,
      totalPrice: selectedCourt.pricePerHour,
      createdAt: 'Just now',
      accessPassCode: `SYNC-CRT${selectedCourt.courtNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setIsNewBookingModalOpen(false);
    showToast(`Reservation ${newId} confirmed for ${data.playerName}!`);
  };

  // Subheader titles by active section
  const sectionMeta: Record<NavId, { title: string; subtitle: string }> = {
    Dashboard: {
      title: 'Dashboard',
      subtitle: `Real-time on-site court occupancy, booking revenue, and member activity · Updated ${lastRefreshed}`,
    },
    Courts: {
      title: 'Courts Management',
      subtitle: `Manage court availability, operational schedules, and surfaces · Updated ${lastRefreshed}`,
    },
    Bookings: {
      title: 'Bookings & Reservations',
      subtitle: `Active sessions, player registrations, and upcoming club reservations · Updated ${lastRefreshed}`,
    },
    Members: {
      title: 'Club Members Directory',
      subtitle: `Player ratings, DUPR profiles, check-in history, and club presence · Updated ${lastRefreshed}`,
    },
    Revenue: {
      title: 'Revenue & Financial Analytics',
      subtitle: `Court rental earnings, equipment passes, and weekly club trends · Updated ${lastRefreshed}`,
    },
    Settings: {
      title: 'Club Operations & Settings',
      subtitle: `Facility parameters, operating hours, and admin access controls · Updated ${lastRefreshed}`,
    },
  };

  return (
    <div className="flex h-screen bg-[#f8fafd] text-[#1f1f1f] font-sans antialiased overflow-hidden">
      {/* ── Sidebar Navigation ────────────────────────────────────────── */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onSelectNav={(id) => {
          setActiveNav(id);
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
        courtStatusFilter={courtStatusFilter}
        onSelectCourtFilter={(filter) => {
          setCourtStatusFilter(filter);
          if (activeNav !== 'Courts' && activeNav !== 'Dashboard') {
            setActiveNav('Courts');
          }
        }}
        totalCourts={totalCourts}
        availableCourts={availableCourts}
        inPlayCourts={inPlayCourts}
        reservedCourts={reservedCourts}
        maintenanceCourts={maintenanceCourts}
        totalBookingsCount={totalBookingsCount}
        occupancyPercent={occupancyPercent}
        onOpenNewBookingModal={() => setIsNewBookingModalOpen(true)}
      />

      {/* ── Main Panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Bar */}
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          notifications={notifications}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onSignOut={handleSignOut}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Subheader Toolbar */}
          <AdminSubheader
            title={sectionMeta[activeNav].title}
            subtitle={sectionMeta[activeNav].subtitle}
            lastRefreshed={lastRefreshed}
            timeframe={timeframe}
            onChangeTimeframe={setTimeframe}
            onExportCSV={handleExportCSV}
          />

          {/* ── Section: Full Dashboard View ────────────────────────────── */}
          {activeNav === 'Dashboard' && (
            <>
              {/* KPI Metrics */}
              <AdminMetricsSection
                totalRevenueToday={totalRevenueToday}
                totalBookingsCount={totalBookingsCount}
                liveBookingsCount={bookings.length}
                occupancyPercent={occupancyPercent}
                availableCourts={availableCourts}
                totalCourts={totalCourts}
              />

              {/* Analytics & Resource Overview */}
              <AdminAnalyticsSection
                weeklyRevenue={INITIAL_WEEKLY_REVENUE}
                totalCourts={totalCourts}
                availableCourts={availableCourts}
                inPlayCourts={inPlayCourts}
                reservedCourts={reservedCourts}
                maintenanceCourts={maintenanceCourts}
                onQuickReserve={() => setIsNewBookingModalOpen(true)}
              />

              {/* Courts Overview */}
              <AdminCourtsSection
                courts={filteredCourts}
                statusFilter={courtStatusFilter}
                onSelectStatusFilter={setCourtStatusFilter}
                onSelectCourtForStatus={(court) => {
                  setSelectedCourtForStatus(court);
                  setIsCourtStatusModalOpen(true);
                }}
                liveBookings={bookings}
                onQuickBookCourt={(court) => {
                  setDefaultCourtIdForBooking(court.id);
                  setIsNewBookingModalOpen(true);
                }}
              />

              {/* Recent Bookings & Activity */}
              <AdminBookingsSection
                bookings={filteredRecentBookings}
                filterTab={bookingFilterTab}
                onChangeFilterTab={setBookingFilterTab}
                onCancelBooking={(id) => {
                  cancelBooking(id);
                  showToast(`Reservation ${id} cancelled`);
                }}
              />

              {/* Quick Actions */}
              <AdminQuickActionsSection
                onNewBooking={() => setIsNewBookingModalOpen(true)}
                onExportCSV={handleExportCSV}
                onOpenSettings={() => {
                  setActiveNav('Settings');
                  showToast('Opened club settings section');
                }}
              />
            </>
          )}

          {/* ── Section: Courts View ────────────────────────────────────── */}
          {activeNav === 'Courts' && (
            <>
              <AdminCourtsSection
                courts={filteredCourts}
                statusFilter={courtStatusFilter}
                onSelectStatusFilter={setCourtStatusFilter}
                onSelectCourtForStatus={(court) => {
                  setSelectedCourtForStatus(court);
                  setIsCourtStatusModalOpen(true);
                }}
                liveBookings={bookings}
                onQuickBookCourt={(court) => {
                  setDefaultCourtIdForBooking(court.id);
                  setIsNewBookingModalOpen(true);
                }}
              />

              <AdminQuickActionsSection
                onNewBooking={() => setIsNewBookingModalOpen(true)}
                onExportCSV={handleExportCSV}
              />
            </>
          )}

          {/* ── Section: Bookings View ──────────────────────────────────── */}
          {activeNav === 'Bookings' && (
            <AdminBookingsSection
              bookings={filteredRecentBookings}
              filterTab={bookingFilterTab}
              onChangeFilterTab={setBookingFilterTab}
              onCancelBooking={(id) => {
                cancelBooking(id);
                showToast(`Reservation ${id} cancelled`);
              }}
            />
          )}

          {/* ── Section: Members View ───────────────────────────────────── */}
          {activeNav === 'Members' && (
            <AdminMembersSection
              members={MEMBERS_ONLINE}
              searchQuery={searchQuery}
              onContactMember={(m) => showToast(`Contact modal opened for ${m.name}`)}
            />
          )}

          {/* ── Section: Revenue View ───────────────────────────────────── */}
          {activeNav === 'Revenue' && (
            <>
              <AdminMetricsSection
                totalRevenueToday={totalRevenueToday}
                totalBookingsCount={totalBookingsCount}
                liveBookingsCount={bookings.length}
                occupancyPercent={occupancyPercent}
                availableCourts={availableCourts}
                totalCourts={totalCourts}
              />

              <AdminAnalyticsSection
                weeklyRevenue={INITIAL_WEEKLY_REVENUE}
                totalCourts={totalCourts}
                availableCourts={availableCourts}
                inPlayCourts={inPlayCourts}
                reservedCourts={reservedCourts}
                maintenanceCourts={maintenanceCourts}
                onQuickReserve={() => setIsNewBookingModalOpen(true)}
              />
            </>
          )}

          {/* ── Section: Settings View ──────────────────────────────────── */}
          {activeNav === 'Settings' && (
            <div className="bg-white rounded-2xl border border-[#dadce0] p-6 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-6">
              <div>
                <h2 className="text-base font-semibold text-[#1f1f1f]">Club Facility Configuration</h2>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  General preferences, operating hours, and booking rules
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[#e0e2ec] bg-[#f8fafd] space-y-2">
                  <h3 className="text-xs font-semibold text-[#1f1f1f]">Operating Hours</h3>
                  <p className="text-xs text-[#5f6368]">Current club schedule: Mon - Sun, 07:00 AM - 11:00 PM</p>
                  <button
                    type="button"
                    onClick={() => showToast('Hours edit mode activated')}
                    className="text-xs text-[#0b57d0] font-medium hover:underline cursor-pointer"
                  >
                    Modify Hours
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#e0e2ec] bg-[#f8fafd] space-y-2">
                  <h3 className="text-xs font-semibold text-[#1f1f1f]">Booking Policy</h3>
                  <p className="text-xs text-[#5f6368]">Cancellation cutoff: 24h prior to match. Split payments enabled.</p>
                  <button
                    type="button"
                    onClick={() => showToast('Policy edit mode activated')}
                    className="text-xs text-[#0b57d0] font-medium hover:underline cursor-pointer"
                  >
                    Edit Rules
                  </button>
                </div>
              </div>

              <AdminQuickActionsSection
                onNewBooking={() => setIsNewBookingModalOpen(true)}
                onExportCSV={handleExportCSV}
              />
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <NewReservationModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        courts={courtsList}
        defaultCourtId={defaultCourtIdForBooking}
        onSubmit={handleCreateReservation}
      />

      <CourtStatusModal
        isOpen={isCourtStatusModalOpen}
        onClose={() => setIsCourtStatusModalOpen(false)}
        court={selectedCourtForStatus}
        onUpdateStatus={handleUpdateCourtStatus}
      />
    </div>
  );
}
