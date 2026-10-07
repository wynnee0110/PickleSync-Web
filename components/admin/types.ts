import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

export type CourtStatus = 'available' | 'in_play' | 'reserved' | 'maintenance';
export type TimeframeOption = 'Today' | 'This week' | 'This month';
export type BookingFilterTab = 'all' | 'live' | 'confirmed' | 'pending';
export type NavId = 'Dashboard' | 'Courts' | 'Bookings' | 'Members' | 'Revenue' | 'Settings';

export interface ActivityItem {
  id: string;
  player: string;
  court: string;
  time: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  initials: string;
  color: string;
}

export interface CombinedBookingItem {
  id: string;
  court: string;
  player: string;
  time: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  isLive: boolean;
  initials: string;
  color: string;
}

export interface MemberOnline {
  name: string;
  email: string;
  dupr: number;
  initials: string;
  status: 'playing' | 'booked' | 'browsing';
  court: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export interface WeeklyRevenueItem {
  day: string;
  value: number;
}

export interface ReservationFormData {
  courtId: string;
  playerName: string;
  timeSlot: string;
  date: string;
  duration: string;
}

export interface NavItemConfig {
  id: NavId;
  label: string;
  icon: LucideIcon;
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────
export const INITIAL_WEEKLY_REVENUE: WeeklyRevenueItem[] = [
  { day: 'Mon', value: 3200 },
  { day: 'Tue', value: 4100 },
  { day: 'Wed', value: 3750 },
  { day: 'Thu', value: 5800 },
  { day: 'Fri', value: 7200 },
  { day: 'Sat', value: 9400 },
  { day: 'Sun', value: 6100 },
];

export const INITIAL_RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'BK-901234', player: 'Marcus L.', court: 'Center Court Championship', time: '2 min ago', amount: 200, status: 'confirmed', initials: 'ML', color: 'bg-[#d2e3fc] text-[#0b57d0]' },
  { id: 'BK-901190', player: 'Sarah K.', court: 'The Sonic Dome', time: '14 min ago', amount: 180, status: 'confirmed', initials: 'SK', color: 'bg-[#ceead6] text-[#137333]' },
  { id: 'BK-901043', player: 'Jake T.', court: 'Rooftop Blaze', time: '31 min ago', amount: 160, status: 'pending', initials: 'JT', color: 'bg-[#feefc3] text-[#b06000]' },
  { id: 'BK-900988', player: 'Priya M.', court: 'The Neon Grid (UV)', time: '1 hr ago', amount: 200, status: 'confirmed', initials: 'PM', color: 'bg-[#f3e8fd] text-[#7c3aed]' },
  { id: 'BK-900712', player: 'Chris D.', court: 'Canyon View Outdoor', time: '2 hr ago', amount: 140, status: 'cancelled', initials: 'CD', color: 'bg-[#fad2cf] text-[#c5221f]' },
  { id: 'BK-900401', player: 'Wei Z.', court: 'Center Court Championship', time: '3 hr ago', amount: 200, status: 'confirmed', initials: 'WZ', color: 'bg-[#e8eaed] text-[#3c4043]' },
];

export const MEMBERS_ONLINE: MemberOnline[] = [
  { name: 'Marcus L.', email: 'marcus.l@example.com', dupr: 4.2, initials: 'ML', status: 'playing', court: 'Center Court' },
  { name: 'Sarah K.', email: 'sarah.k@example.com', dupr: 3.8, initials: 'SK', status: 'booked', court: 'Sonic Dome' },
  { name: 'Jake T.', email: 'jake.t@example.com', dupr: 5.0, initials: 'JT', status: 'booked', court: 'Rooftop Blaze' },
  { name: 'Priya M.', email: 'priya.m@example.com', dupr: 4.5, initials: 'PM', status: 'browsing', court: 'Lounge' },
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  { id: 'n1', title: 'New reservation confirmed', desc: 'Marcus L. booked Center Court for 07:00 PM', time: '2m ago', unread: true },
  { id: 'n2', title: 'Maintenance scheduled', desc: 'Court 3 LED illumination inspection at 11:00 PM', time: '1h ago', unread: true },
  { id: 'n3', title: 'Weekly payout processed', desc: '₱12,450 sent to Stripe primary club balance', time: '4h ago', unread: false },
  { id: 'n4', title: 'High court demand', desc: 'Occupancy exceeded 85% for weekend slots', time: '1d ago', unread: false },
];

export const NAV_ITEMS: NavItemConfig[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Courts', label: 'Courts', icon: MapPin },
  { id: 'Bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'Members', label: 'Members', icon: Users },
  { id: 'Revenue', label: 'Revenue & Reports', icon: BarChart3 },
  { id: 'Settings', label: 'Settings', icon: Settings },
];
