import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}: ModalProps) {
  const maxWClass = 
    maxWidth === 'sm' ? 'max-w-sm' :
    maxWidth === 'md' ? 'max-w-md' :
    maxWidth === 'lg' ? 'max-w-lg' :
    maxWidth === 'xl' ? 'max-w-xl' :
    maxWidth === '2xl' ? 'max-w-2xl' :
    maxWidth === '4xl' ? 'max-w-4xl' :
    maxWidth === '5xl' ? 'max-w-5xl' :
    maxWidth === '6xl' ? 'max-w-6xl' :
    maxWidth === '7xl' ? 'max-w-7xl' :
    'max-w-md';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`w-full ${maxWClass} bg-card border border-border/80 rounded-xl shadow-xl overflow-hidden relative z-10`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <h3 className="text-xs font-bold tracking-wider uppercase text-foreground bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
