import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800",

        secondary:
          "bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700",

        outline:
          "text-foreground",

        destructive:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
        success:
          "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
