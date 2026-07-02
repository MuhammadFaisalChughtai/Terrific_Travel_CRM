import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { toast } from 'sonner';

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
}

export default function EditAttendanceModal({ isOpen, onClose, record }: EditAttendanceModalProps) {
  const queryClient = useQueryClient();
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [status, setStatus] = useState('PRESENT');

  useEffect(() => {
    if (isOpen && record) {
      setCheckInTime(record.checkInTime ? new Date(record.checkInTime).toISOString().slice(0, 16) : '');
      setCheckOutTime(record.checkOutTime ? new Date(record.checkOutTime).toISOString().slice(0, 16) : '');
      setStatus(record.status || 'PRESENT');
    }
  }, [isOpen, record]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiClient.patch(`/attendance/admin/${record.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Attendance updated successfully");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update attendance");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      checkInTime: checkInTime ? new Date(checkInTime).toISOString() : null,
      checkOutTime: checkOutTime ? new Date(checkOutTime).toISOString() : null,
      status
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Attendance" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="ON_LEAVE">ON LEAVE</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Check In Time</label>
          <input
            type="datetime-local"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Check Out Time</label>
          <input
            type="datetime-local"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
