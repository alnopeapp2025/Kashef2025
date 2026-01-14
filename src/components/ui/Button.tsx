import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-black text-yellow-400 hover:bg-gray-900 border-transparent",
      secondary: "bg-white/20 text-black hover:bg-white/30 border-transparent backdrop-blur-sm",
      outline: "bg-transparent border-2 border-black text-black hover:bg-black/5",
      ghost: "bg-transparent text-black hover:bg-black/5 border-transparent",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:pointer-events-none border",
          variants[variant],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
