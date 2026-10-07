import React, { useState, useMemo } from 'react';
import { Mail, Trophy } from 'lucide-react';
import { MemberOnline } from '../types';

interface AdminMembersSectionProps {
  members: MemberOnline[];
  searchQuery?: string;
  onContactMember?: (member: MemberOnline) => void;
}

export function AdminMembersSection({
  members,
  searchQuery = '',
  onContactMember,
}: AdminMembersSectionProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'playing' | 'booked' | 'browsing'>('all');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.court.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  const getStatusBadge = (status: MemberOnline['status']) => {
    switch (status) {
      case 'playing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e] animate-pulse" />
            On Court
          </span>
        );
      case 'booked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e8f0fe] text-[#1967d2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1a73e8]" />
            Booked Ahead
          </span>
        );
      case 'browsing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f1f3f4] text-[#5f6368]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#747775]" />
            In Club Lounge
          </span>
        );
    }
  };

  return (
    <section aria-label="Club Directory & Members" className="bg-white rounded-2xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1f1f1f]">Club Members Directory</h2>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Real-time status, DUPR rankings, and court check-ins
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'playing', 'booked', 'browsing'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#5f6368] hover:bg-[#f1f3f4]'
              }`}
            >
              {tab === 'playing' ? 'On Court' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#f1f3f4]">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#747775]">
            No members found matching current filter.
          </div>
        ) : (
          filteredMembers.map((m) => (
            <div
              key={m.email}
              className="p-4 sm:px-5 flex items-center justify-between hover:bg-[#f8fafd] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-full bg-[#f3e8fd] text-[#7c3aed] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-[#1f1f1f]">{m.name}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md bg-[#feefc3] text-[#b06000] text-[10px] font-semibold">
                      <Trophy className="h-2.5 w-2.5" />
                      DUPR {m.dupr.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5f6368] mt-0.5 truncate">
                    {m.email} · {m.court}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-3">
                {getStatusBadge(m.status)}
                {onContactMember && (
                  <button
                    type="button"
                    onClick={() => onContactMember(m)}
                    title="Send player alert"
                    className="p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
