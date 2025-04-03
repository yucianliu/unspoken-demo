import * as React from "react";
import { cn } from "../../utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "bg-[#B2B2A8] backdrop-blur-md text-gray-300 placeholder:text-gray-400 w-full resize-none overflow-hidden rounded-[1rem] p-4 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea }; 