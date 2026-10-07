import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  X,
  RefreshCw,
  Bell,
  Grid,
  MapPin,
  Activity,
  CalendarCheck,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { AdminNotification } from './types';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  notifications: AdminNotification[];
  onMarkAllNotificationsRead: () => void;
  onSignOut: () => void;
}

export function AdminHeader({
  onOpenSidebar,
  searchQuery,
  onSearchChange,
  isRefreshing,
  onRefresh,
  notifications,
  onMarkAllNotificationsRead,
  onSignOut,
}: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-[#dadce0] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full lg:hidden cursor-pointer"
          onClick={onOpenSidebar}
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courts, bookings, members..."
            className="w-full bg-transparent pl-3 pr-2 text-sm text-[#1f1f1f] placeholder-[#5f6368] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 text-[#5f6368] hover:text-[#1f1f1f] rounded-full cursor-pointer"
              aria-label="Clear search"
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
          onClick={onRefresh}
          title="Refresh data"
          className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors relative cursor-pointer"
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
            className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors relative cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#0b57d0]" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_16px_rgba(60,64,67,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
                <span className="text-sm font-semibold text-[#1f1f1f]">Notifications</span>
                <button
                  type="button"
                  onClick={onMarkAllNotificationsRead}
                  className="text-xs text-[#0b57d0] hover:underline cursor-pointer font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-[#f1f3f4] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
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
            className="p-2 text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors cursor-pointer"
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
            className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0b57d0] text-white text-xs font-semibold hover:ring-2 hover:ring-[#0b57d0]/30 transition-all cursor-pointer"
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
                    onSignOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-medium text-[#c5221f] hover:bg-[#fce8e6] transition-colors cursor-pointer"
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
  );
}
