import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import FreeCancellationSection from '../components/FreeCancellationSection';
import BookingManager from '../components/BookingManager';
import { AlertTriangle, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FreeCancellationPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(null);

  const isAdmin = Boolean(
    user?.roles?.some((r: any) => {
      const clean = (typeof r === 'string' ? r : r?.name || '')
        .toUpperCase()
        .replace(/[\s_-]+/g, '');
      return ['ADMIN', 'SUPERADMIN', 'SUPER_ADMIN', 'ROOT'].includes(clean);
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
            <span className="font-semibold text-foreground">Free Cancellation Deadlines</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span>Free Cancellation Hotels &amp; Transportation</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dedicated monitoring dashboard for all recorded hotel and transportation free cancellation deadlines, urgency alerts, admin confirmations, and 1-click booking access.
          </p>
        </div>
      </div>

      {/* Complete Full Free Cancellation Management Section */}
      <FreeCancellationSection
        onOpenBooking={(bId, bRef) => {
          setSelectedBookingId(bId);
          setSelectedBookingRef(bRef || null);
        }}
        isAdmin={isAdmin}
      />

      {/* Direct Booking Details Modal */}
      {selectedBookingId && (
        <BookingManager
          isOpen={!!selectedBookingId}
          bookingId={selectedBookingId}
          bookingReference={selectedBookingRef || undefined}
          onClose={() => {
            setSelectedBookingId(null);
            setSelectedBookingRef(null);
            queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
          }}
        />
      )}
    </div>
  );
}
