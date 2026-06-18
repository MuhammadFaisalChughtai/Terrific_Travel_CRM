import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
  loading = false
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Warning Icon Container */}
        <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center animate-pulse">
          <AlertTriangle size={20} />
        </div>

        {/* Message */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-foreground">Confirm Deletion</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 w-full pt-1">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-1.5 px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-lg text-xs transition-all border border-border"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-1.5 px-3 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold rounded-lg text-xs transition-all shadow-md shadow-destructive/10"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
