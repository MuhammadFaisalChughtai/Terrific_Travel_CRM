import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { toast } from 'sonner';
import {
  Plane,
  Building2,
  Layers,
  Clock,
  AlertTriangle,
  Lock,
  Search,
  CheckCircle2,
  Calendar,
  CreditCard,
  UserCheck,
  AlertCircle,
  X,
  Plus,
  RefreshCw,
  FileText,
  Check,
  ChevronRight,
  Filter,
  User as UserIcon,
  Phone,
  Mail,
  Receipt,
  Ticket,
} from 'lucide-react';

export interface IssuanceTicket {
  id: string;
  ticketNumber: string;
  type: 'FLIGHT' | 'HOTEL';
  status: 'TO_DO' | 'PENDING' | 'ON_HOLD' | 'ISSUED';
  paymentStatus: string;
  leadGuestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  travelStartDate: string;
  travelEndDate?: string | null;
  totalCost: number;
  currency: string;
  airline?: string | null;
  flightNumbers?: string | null;
  routing?: string | null;
  pnrTicketNumber?: string | null;
  hotelName?: string | null;
  destination?: string | null;
  roomCategory?: string | null;
  boardBasis?: string | null;
  hotelReservationNo?: string | null;
  statusChangedAt: string;
  isLocked: boolean;
  lockedAt?: string | null;
  holdReason?: string | null;
  bookingId?: string | null;
  bookingReference?: string | null;
  serviceId?: string | null;
  createdById?: string | null;
  assignedToId?: string | null;
  isSlaBreached?: boolean;
  elapsedMinutes?: number;
  creatorName?: string;
  assigneeName?: string | null;
  createdAt: string;
}

const COLUMNS = [
  {
    id: 'TO_DO',
    label: 'To Do',
    description: 'New requests waiting for an admin',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    headerBorder: 'border-slate-300',
  },
  {
    id: 'PENDING',
    label: 'Pending',
    description: 'Claimed and currently being processed',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    headerBorder: 'border-sky-400',
  },
  {
    id: 'ON_HOLD',
    label: 'On Hold',
    description: 'Clarification required from agent',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    headerBorder: 'border-amber-400',
  },
  {
    id: 'ISSUED',
    label: 'Issued',
    description: 'Finalized, confirmed & locked',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    headerBorder: 'border-emerald-500',
  },
];

export default function IssuancePage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [filterType, setFilterType] = useState<'ALL' | 'FLIGHT' | 'HOTEL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingIssueTicket, setPendingIssueTicket] = useState<IssuanceTicket | null>(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [pendingHoldTicket, setPendingHoldTicket] = useState<IssuanceTicket | null>(null);
  const [holdReasonText, setHoldReasonText] = useState('');
  const [viewTicket, setViewTicket] = useState<IssuanceTicket | null>(null);

  // New Request Form State
  const [newType, setNewType] = useState<'FLIGHT' | 'HOTEL'>('FLIGHT');
  const [newLeadGuest, setNewLeadGuest] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newTravelStart, setNewTravelStart] = useState('');
  const [newTravelEnd, setNewTravelEnd] = useState('');
  const [newTotalCost, setNewTotalCost] = useState('');
  const [newCurrency, setNewCurrency] = useState('GBP');
  const [newBookingRef, setNewBookingRef] = useState('');
  // Flight fields
  const [newAirline, setNewAirline] = useState('');
  const [newFlightNumbers, setNewFlightNumbers] = useState('');
  const [newRouting, setNewRouting] = useState('');
  // Hotel fields
  const [newHotelName, setNewHotelName] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('');
  const [newBoardBasis, setNewBoardBasis] = useState('RO');

  // Role Checks
  const isAgentOnly = useMemo(() => {
    if (!user || !user.roles) return true;
    const isPrivileged = user.roles.some((r) => {
      const up = r.toUpperCase();
      return up === 'ADMIN' || up === 'SUPER_ADMIN' || up === 'SUPERADMIN' || up === 'MANAGER';
    });
    return !isPrivileged;
  }, [user]);

  // Fetch Tickets
  const { data: tickets = [], isLoading, refetch } = useQuery<IssuanceTicket[]>({
    queryKey: ['issuance-tickets', filterType],
    queryFn: async () => {
      const res = await apiClient.get(`/issuance/tickets?type=${filterType}`);
      return res.data?.data || [];
    },
    refetchInterval: 20000,
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: async (payload: {
      ticketId: string;
      newStatus: string;
      outputConfirmation?: string;
      holdReason?: string;
    }) => {
      const res = await apiClient.patch(`/issuance/tickets/${payload.ticketId}/status`, {
        newStatus: payload.newStatus,
        outputConfirmation: payload.outputConfirmation,
        holdReason: payload.holdReason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issuance-tickets'] });
      toast.success('Ticket status updated successfully');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || 'Failed to update ticket status';
      toast.error(msg);
    },
  });

  // Create ticket mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post('/issuance/tickets', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issuance-tickets'] });
      toast.success('Issuance request created successfully');
      setShowCreateModal(false);
      resetNewForm();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || 'Failed to create issuance request';
      toast.error(msg);
    },
  });

  const resetNewForm = () => {
    setNewLeadGuest('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewTravelStart('');
    setNewTravelEnd('');
    setNewTotalCost('');
    setNewBookingRef('');
    setNewAirline('');
    setNewFlightNumbers('');
    setNewRouting('');
    setNewHotelName('');
    setNewDestination('');
    setNewRoomCategory('');
    setNewBoardBasis('RO');
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('text/plain', ticketId);
    setDraggedTicketId(ticketId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId;
    setDraggedTicketId(null);

    if (!ticketId) return;
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.status === targetStatus) return;

    // Rule: Booking Agents cannot move to ISSUED
    if (targetStatus === 'ISSUED' && isAgentOnly) {
      toast.error('Permission Denied: Only Issuance Admins can move cards to Issued.');
      return;
    }

    // Rule: Intercept drop onto ISSUED if mandatory confirmation is missing
    const existingCode =
      ticket.type === 'FLIGHT' ? ticket.pnrTicketNumber : ticket.hotelReservationNo;
    if (targetStatus === 'ISSUED' && (!existingCode || !existingCode.trim())) {
      setPendingIssueTicket(ticket);
      setConfirmationCode('');
      return;
    }

    // Rule: Intercept drop onto ON_HOLD to capture reason
    if (targetStatus === 'ON_HOLD') {
      setPendingHoldTicket(ticket);
      setHoldReasonText('');
      return;
    }

    // Standard transition
    statusMutation.mutate({ ticketId: ticket.id, newStatus: targetStatus });
  };

  const submitIssueConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingIssueTicket || !confirmationCode.trim()) return;

    statusMutation.mutate({
      ticketId: pendingIssueTicket.id,
      newStatus: 'ISSUED',
      outputConfirmation: confirmationCode.trim(),
    });
    setPendingIssueTicket(null);
    setConfirmationCode('');
  };

  const submitHoldReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingHoldTicket || !holdReasonText.trim()) return;

    statusMutation.mutate({
      ticketId: pendingHoldTicket.id,
      newStatus: 'ON_HOLD',
      holdReason: holdReasonText.trim(),
    });
    setPendingHoldTicket(null);
    setHoldReasonText('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadGuest.trim() || !newTravelStart) {
      toast.error('Please enter the guest name and travel start date.');
      return;
    }

    createMutation.mutate({
      type: newType,
      leadGuestName: newLeadGuest.trim(),
      guestEmail: newGuestEmail.trim() || undefined,
      guestPhone: newGuestPhone.trim() || undefined,
      travelStartDate: newTravelStart,
      travelEndDate: newTravelEnd || undefined,
      totalCost: Number(newTotalCost) || 0,
      currency: newCurrency,
      bookingReference: newBookingRef.trim() || undefined,
      airline: newType === 'FLIGHT' ? newAirline.trim() : undefined,
      flightNumbers: newType === 'FLIGHT' ? newFlightNumbers.trim() : undefined,
      routing: newType === 'FLIGHT' ? newRouting.trim() : undefined,
      hotelName: newType === 'HOTEL' ? newHotelName.trim() : undefined,
      destination: newType === 'HOTEL' ? newDestination.trim() : undefined,
      roomCategory: newType === 'HOTEL' ? newRoomCategory.trim() : undefined,
      boardBasis: newType === 'HOTEL' ? newBoardBasis : undefined,
    });
  };

  // Filter & Search
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.leadGuestName?.toLowerCase().includes(q) ||
        t.airline?.toLowerCase().includes(q) ||
        t.flightNumbers?.toLowerCase().includes(q) ||
        t.hotelName?.toLowerCase().includes(q) ||
        t.bookingReference?.toLowerCase().includes(q) ||
        t.pnrTicketNumber?.toLowerCase().includes(q) ||
        t.hotelReservationNo?.toLowerCase().includes(q)
      );
    });
  }, [tickets, searchQuery]);

  return (
    <div className="space-y-5 pb-12">
      {/* TOP HEADER & STATS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary" />
              <span>Issuance Board</span>
            </h1>
            {isAgentOnly ? (
              <span className="text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
                Agent View
              </span>
            ) : (
              <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                Admin Issuance Desk
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unified operations queue for Flights &amp; Hotels. 2-hour SLA tracking with automated status pings and lock controls.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Top-Level Type Filter Toggles */}
          <div className="flex items-center p-1 bg-secondary rounded-xl border border-border">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'ALL'
                  ? 'bg-card text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              All
            </button>
            <button
              onClick={() => setFilterType('FLIGHT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'FLIGHT'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              Flights
            </button>
            <button
              onClick={() => setFilterType('HOTEL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'HOTEL'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Hotels
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reference, guest, airline, PNR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary w-64 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Refresh Board"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* New Request Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 min-h-[640px] items-start">
        {COLUMNS.map((column) => {
          const colTickets = filteredTickets.filter((t) => t.status === column.id);
          const isDragTarget = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col h-full rounded-2xl border transition-all duration-150 p-3.5 bg-card/60 backdrop-blur-xs ${
                isDragTarget
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border'
              }`}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${column.headerBorder}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {column.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${column.badgeClass}`}
                    >
                      {colTickets.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{column.description}</p>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 min-h-[500px]">
                {colTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-xl text-center p-4">
                    <FileText className="w-7 h-7 text-muted-foreground/40 mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">No tickets in this column</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                      Drag cards here to update status
                    </p>
                  </div>
                ) : (
                  colTickets.map((ticket) => {
                    const isFlight = ticket.type === 'FLIGHT';
                    const isSlaBreach = ticket.isSlaBreached;

                    return (
                      <div
                        key={ticket.id}
                        draggable={!ticket.isLocked || !isAgentOnly}
                        onDragStart={(e) => handleDragStart(e, ticket.id)}
                        onClick={() => setViewTicket(ticket)}
                        className={`group relative bg-card rounded-xl p-3.5 border transition-all duration-150 cursor-grab active:cursor-grabbing hover:shadow-md select-none ${
                          isSlaBreach
                            ? 'border-red-500 ring-1 ring-red-500/40 bg-red-500/5'
                            : 'border-border hover:border-border/80'
                        }`}
                      >
                        {/* Type Badge & SLA / Lock Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            {isFlight ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-md">
                                <Plane className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                                Flight
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                                <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                Hotel
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                              {ticket.ticketNumber}
                            </span>
                          </div>

                          {/* Status Flags */}
                          {ticket.isLocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-medium bg-secondary text-muted-foreground px-2 py-0.5 rounded-md border border-border">
                              <Lock className="w-3 h-3 text-muted-foreground" />
                              Locked
                            </span>
                          ) : isSlaBreach ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 px-2 py-0.5 rounded-md animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                              SLA &gt; 2h
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {ticket.elapsedMinutes ?? 0}m
                            </span>
                          )}
                        </div>

                        {/* Lead Guest */}
                        <div className="font-bold text-sm text-foreground tracking-tight line-clamp-1 mb-1.5">
                          {ticket.leadGuestName}
                        </div>

                        {/* Booking Link if present */}
                        {ticket.bookingReference && (
                          <div className="text-[10px] text-primary font-semibold mb-2">
                            Booking: {ticket.bookingReference}
                          </div>
                        )}

                        {/* Dynamic Flight / Hotel Specific Details */}
                        {isFlight ? (
                          <div className="text-xs bg-secondary/50 rounded-lg p-2.5 border border-border/50 space-y-1">
                            <div className="flex items-center justify-between font-semibold text-foreground">
                              <span>{ticket.airline || 'Airline'}</span>
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {ticket.flightNumbers || '—'}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              Route: <strong className="text-foreground">{ticket.routing || 'N/A'}</strong>
                            </div>
                            {ticket.pnrTicketNumber && (
                              <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400 pt-1 border-t border-border/60 flex items-center justify-between">
                                <span>PNR / Ticket:</span>
                                <span className="font-mono">{ticket.pnrTicketNumber}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs bg-secondary/50 rounded-lg p-2.5 border border-border/50 space-y-1">
                            <div className="font-semibold text-foreground truncate">
                              {ticket.hotelName || 'Hotel'}
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                              <span>{ticket.destination || 'Destination'}</span>
                              <span>
                                {ticket.roomCategory || 'Standard'} ({ticket.boardBasis || 'RO'})
                              </span>
                            </div>
                            {ticket.hotelReservationNo && (
                              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-border/60 flex items-center justify-between">
                                <span>Res No:</span>
                                <span className="font-mono">{ticket.hotelReservationNo}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* On-Hold Clarification Notice */}
                        {ticket.status === 'ON_HOLD' && ticket.holdReason && (
                          <div className="mt-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 p-2 rounded-lg text-[11px] flex items-start gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="line-clamp-2">
                              <strong>Clarification:</strong> {ticket.holdReason}
                            </div>
                          </div>
                        )}

                        {/* Footer Details: Date, Cost, Originating Agent */}
                        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>{new Date(ticket.travelStartDate).toLocaleDateString()}</span>
                          </div>
                          <div className="font-bold text-foreground">
                            {ticket.currency} {Number(ticket.totalCost).toFixed(2)}
                          </div>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>Agent: {ticket.creatorName || 'Agent'}</span>
                          {ticket.assigneeName ? (
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <UserCheck className="w-3 h-3" />
                              {ticket.assigneeName}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MANDATORY VALIDATION MODAL FOR MOVING TO "ISSUED" */}
      {pendingIssueTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Finalize &amp; Issue {pendingIssueTicket.type === 'FLIGHT' ? 'Flight' : 'Hotel'}
              </h3>
              <button
                onClick={() => setPendingIssueTicket(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitIssueConfirmation} className="mt-4 space-y-4">
              <div className="bg-secondary/60 p-3 rounded-xl border border-border text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Guest:</strong> {pendingIssueTicket.leadGuestName}
                </p>
                <p>
                  <strong>Reference:</strong> {pendingIssueTicket.ticketNumber}
                </p>
                <p>
                  <strong>Service:</strong>{' '}
                  {pendingIssueTicket.type === 'FLIGHT'
                    ? `${pendingIssueTicket.airline || ''} (${pendingIssueTicket.flightNumbers || ''})`
                    : pendingIssueTicket.hotelName}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  {pendingIssueTicket.type === 'FLIGHT'
                    ? 'Airline PNR / Ticket Number *'
                    : 'Hotel Confirmation / Reservation Number *'}
                </label>
                <input
                  required
                  autoFocus
                  type="text"
                  placeholder={
                    pendingIssueTicket.type === 'FLIGHT'
                      ? 'e.g. 7X9KLP or 006-2349817290'
                      : 'e.g. HTL-RES-984210'
                  }
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full text-sm font-semibold tracking-wide py-2.5 px-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase placeholder:normal-case text-foreground"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Submitting this code will finalize the booking, lock the financial and travel date records, and automatically email the confirmation to the client and agent.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPendingIssueTicket(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!confirmationCode.trim() || statusMutation.isPending}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
                >
                  {statusMutation.isPending ? 'Finalizing...' : 'Confirm & Issue Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLARIFICATION HOLD MODAL */}
      {pendingHoldTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-amber-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Place Ticket On Hold
              </h3>
              <button
                onClick={() => setPendingHoldTicket(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitHoldReason} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Reason for Hold (Sent to Agent) *
                </label>
                <textarea
                  required
                  autoFocus
                  rows={3}
                  placeholder="e.g. Payment unverified, fare expired, passenger passport details mismatch..."
                  value={holdReasonText}
                  onChange={(e) => setHoldReasonText(e.target.value)}
                  className="w-full text-xs p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-foreground"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  The originating agent will be notified immediately via email with this clarification request.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPendingHoldTicket(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!holdReasonText.trim() || statusMutation.isPending}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {statusMutation.isPending ? 'Sending...' : 'Notify Agent & Hold'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW ISSUANCE REQUEST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Create New Issuance Request
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Service Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewType('FLIGHT')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      newType === 'FLIGHT'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Plane className="w-4 h-4 text-sky-600" />
                    Flight Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('HOTEL')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      newType === 'HOTEL'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Hotel Reservation
                  </button>
                </div>
              </div>

              {/* Booking Reference if existing */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Booking Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TT-2026-0042"
                  value={newBookingRef}
                  onChange={(e) => setNewBookingRef(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Lead Guest & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Lead Guest Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newLeadGuest}
                    onChange={(e) => setNewLeadGuest(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Guest Email
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Travel Dates & Total Cost */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Travel Start Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={newTravelStart}
                    onChange={(e) => setNewTravelStart(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Travel End Date
                  </label>
                  <input
                    type="date"
                    value={newTravelEnd}
                    onChange={(e) => setNewTravelEnd(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Total Cost (GBP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTotalCost}
                    onChange={(e) => setNewTotalCost(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Flight Specific Fields */}
              {newType === 'FLIGHT' && (
                <div className="bg-sky-50/50 dark:bg-sky-950/20 p-3.5 rounded-xl border border-sky-100 dark:border-sky-900/50 space-y-3">
                  <div className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" />
                    Flight Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Airline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Turkish Airlines / Saudia"
                        value={newAirline}
                        onChange={(e) => setNewAirline(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Flight Numbers
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TK 137 / TK 1980"
                        value={newFlightNumbers}
                        onChange={(e) => setNewFlightNumbers(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Routing
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BHX -> IST -> JED"
                      value={newRouting}
                      onChange={(e) => setNewRouting(e.target.value)}
                      className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Hotel Specific Fields */}
              {newType === 'HOTEL' && (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-3">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Hotel Reservation Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Hotel Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pullman Zamzam Makkah"
                        value={newHotelName}
                        onChange={(e) => setNewHotelName(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Destination / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Makkah, Saudi Arabia"
                        value={newDestination}
                        onChange={(e) => setNewDestination(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Room Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Deluxe Quad Room"
                        value={newRoomCategory}
                        onChange={(e) => setNewRoomCategory(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Board Basis
                      </label>
                      <select
                        value={newBoardBasis}
                        onChange={(e) => setNewBoardBasis(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground"
                      >
                        <option value="RO">Room Only (RO)</option>
                        <option value="BB">Bed &amp; Breakfast (BB)</option>
                        <option value="HB">Half Board (HB)</option>
                        <option value="FB">Full Board (FB)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
                >
                  {createMutation.isPending ? 'Logging Request...' : 'Create Issuance Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                {viewTicket.type === 'FLIGHT' ? (
                  <Plane className="w-5 h-5 text-sky-600" />
                ) : (
                  <Building2 className="w-5 h-5 text-emerald-600" />
                )}
                <h3 className="text-base font-bold text-foreground">
                  {viewTicket.ticketNumber} — {viewTicket.leadGuestName}
                </h3>
              </div>
              <button
                onClick={() => setViewTicket(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/60 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-bold text-foreground">{viewTicket.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Service Type</span>
                  <span className="font-bold text-foreground">{viewTicket.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Booking Ref</span>
                  <span className="font-bold text-foreground">{viewTicket.bookingReference || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Total Cost</span>
                  <span className="font-bold text-foreground">
                    {viewTicket.currency} {Number(viewTicket.totalCost).toFixed(2)}
                  </span>
                </div>
              </div>

              {viewTicket.type === 'FLIGHT' ? (
                <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 rounded-xl space-y-1">
                  <p><strong>Airline:</strong> {viewTicket.airline || 'N/A'}</p>
                  <p><strong>Flight(s):</strong> {viewTicket.flightNumbers || 'N/A'}</p>
                  <p><strong>Routing:</strong> {viewTicket.routing || 'N/A'}</p>
                  <p>
                    <strong>Airline PNR / Ticket No:</strong>{' '}
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {viewTicket.pnrTicketNumber || 'Not yet issued'}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1">
                  <p><strong>Hotel:</strong> {viewTicket.hotelName || 'N/A'}</p>
                  <p><strong>Destination:</strong> {viewTicket.destination || 'N/A'}</p>
                  <p><strong>Room Category:</strong> {viewTicket.roomCategory || 'N/A'} ({viewTicket.boardBasis || 'RO'})</p>
                  <p>
                    <strong>Confirmation No:</strong>{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {viewTicket.hotelReservationNo || 'Not yet issued'}
                    </span>
                  </p>
                </div>
              )}

              {viewTicket.holdReason && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200">
                  <strong>Hold Clarification:</strong> {viewTicket.holdReason}
                </div>
              )}

              <div className="border-t border-border pt-3 flex items-center justify-between text-muted-foreground text-[11px]">
                <span>Logged by: {viewTicket.creatorName || 'Agent'}</span>
                <span>Assigned to: {viewTicket.assigneeName || 'Unassigned'}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewTicket(null)}
                className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 rounded-xl"
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
