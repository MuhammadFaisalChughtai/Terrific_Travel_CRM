import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import MissingHotelConfirmationsSection from '../components/MissingHotelConfirmationsSection';
import BookingManager from '../components/BookingManager';
import { Hotel, Home, ChevronRight, AlertTriangle } from 'lucide-react';

export default function Hotels() {
  const user = useAuthStore((state) => state.user);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(null);

  const isAdminOrAgent = Boolean(
    user?.roles?.some((r: any) => {
      const clean = (typeof r === 'string' ? r : r?.name || '')
        .toUpperCase()
        .replace(/[\s_-]+/g, '');
      return ['ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT', 'MANAGER', 'AGENT', 'TRAVELAGENT'].includes(clean);
    })
  );

  return (
    <div className="space-y-6">
      {/* Page Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link to="/" className="hover:text-foreground inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="font-semibold text-foreground">Missing Hotel Confirmations</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <Hotel className="w-5 h-5" />
            </div>
            <span>Missing Hotel Confirmations (Check-in ≤ 5 Days)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dedicated operational board for all bookings with hotel accommodations checking in within the next 5 days that are missing their Hotel Confirmation Number (HCN). Enter HCN to clear alerts and silence the danger buzzer.
          </p>
        </div>
      </div>

      {/* Full Missing Hotel Confirmations Management Section */}
      <MissingHotelConfirmationsSection
        onOpenBooking={(bId, bRef) => {
          setSelectedBookingId(bId);
          setSelectedBookingRef(bRef || null);
        }}
        isAdmin={isAdminOrAgent}
      />

      {/* Direct Booking Details Modal */}
      {selectedBookingId && (
        <BookingManager
          isOpen={Boolean(selectedBookingId)}
          bookingId={selectedBookingId}
          bookingReference={selectedBookingRef || undefined}
          onClose={() => {
            setSelectedBookingId(null);
            setSelectedBookingRef(null);
          }}
        />
      )}
    </div>
  );
}
