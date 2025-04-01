import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Dialog = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      {children}
    </div>
  );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md mx-4">{children}</div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-200">{children}</h2>
);

export const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-400 mt-2">{children}</p>
);

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 flex justify-end gap-3">{children}</div>
);

export const DialogTrigger = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
