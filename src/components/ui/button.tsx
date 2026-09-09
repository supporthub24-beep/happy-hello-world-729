 import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-primary-foreground border border-white/20 shadow-lg shadow-primary/20 hover:bg-primary/70 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
        destructive: "bg-destructive/80 text-destructive-foreground border border-white/20 shadow-lg shadow-destructive/20 hover:bg-destructive/70 hover:shadow-xl hover:shadow-destructive/30 hover:-translate-y-0.5",
        outline:
          "border border-white/30 bg-white/5 backdrop-blur-md shadow-lg hover:bg-white/10 hover:border-white/40 hover:shadow-xl hover:-translate-y-0.5",
        secondary: "bg-secondary/60 text-secondary-foreground border border-white/20 shadow-lg hover:bg-secondary/50 hover:shadow-xl hover:-translate-y-0.5",
        ghost: "hover:bg-white/10 hover:text-foreground border border-transparent hover:border-white/20",
        link: "text-primary underline-offset-4 hover:underline backdrop-blur-none",
        glass: "bg-white/10 text-foreground border border-white/30 backdrop-blur-xl shadow-xl hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };