import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

// --- Dialog Root ---
// Handles the open state and provides context or passes props down.
// We'll adapt it to accept open and onOpenChange for controlled usage.
export const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean; // Make optional for trigger-based usage
  onOpenChange?: (open: boolean) => void; // Make optional
  children: ReactNode;
}) => {
  // If used in a controlled way (open prop is provided), render based on it.
  if (open === false) return null;

  // Basic wrapper - actual modal logic might be in DialogContent
  // or handled by how these components are composed.
  // For simplicity, this root doesn't render much itself if uncontrolled.
  // If controlled, it renders the backdrop/container.
  if (open === true && onOpenChange) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
        onClick={() => onOpenChange(false)} // Close on backdrop click
      >
        {/* Stop propagation prevents closing when clicking inside content */}
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  }

  // If uncontrolled (no open prop), just render children (likely Trigger + Content)
  return <>{children}</>;
};

// --- Dialog Trigger ---
// Needs to handle opening the dialog if uncontrolled.
// For simplicity, we'll assume it just renders its children for now.
// Removing `asChild` support as it complicates things significantly here.
export const DialogTrigger = ({ children }: { children: ReactNode }) => {
  // In a real implementation, this might need context or a click handler
  // to set the open state if the Dialog is uncontrolled.
  // For now, it just renders the trigger element.
  return <>{children}</>;
};


// --- Dialog Content ---
// Accept className and merge it.
export const DialogContent = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "bg-gray-800 rounded-lg p-4 w-full max-w-md mx-4", // Default styles
      "border border-gray-700 text-white", // Added styles from Collage.tsx
      className // Allow overriding/extending
    )}
  >
    {children}
  </div>
);

// --- Dialog Header ---
// Accept className.
export const DialogHeader = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

// --- Dialog Title ---
// Accept className.
export const DialogTitle = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <h2 className={cn("text-xl font-semibold text-gray-200", className)}>
    {children}
  </h2>
);

// --- Dialog Description ---
// Accept className.
export const DialogDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <p className={cn("text-gray-400 mt-2", className)}>
    {children}
  </p>
);

// --- Dialog Footer ---
// Accept className.
export const DialogFooter = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("mt-4 flex justify-end gap-3", className)}>
    {children}
  </div>
);

// --- Dialog Close (Optional but good practice) ---
// A button specifically for closing the dialog
export const DialogClose = ({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) => {
    // This would typically use context to call the onClose/onOpenChange function
    // For now, it's just a styled button placeholder.
    return (
        <button className={cn("p-1 rounded-full hover:bg-gray-700", className)} {...props}>
            {children || <X size={18} />}
        </button>
    );
};
