import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "default" | "secondary" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  variant = "default",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "ui:rounded-lg ui:font-medium ui:transition-all ui:duration-200 ui:cursor-pointer disabled:ui:opacity-50 disabled:ui:cursor-not-allowed";

  const variantStyles: Record<ButtonVariant, string> = {
    default:
      "ui:bg-gradient-to-r ui:from-gradient-start ui:to-gradient-end ui:text-white ui:px-6 ui:py-2.5 hover:ui:opacity-90 active:ui:scale-[0.98]",
    secondary:
      "ui:bg-transparent ui:text-secondary-text ui:px-6 ui:py-2.5 ui:border-2 ui:border-transparent ui:bg-origin-border ui:[background-image:linear-gradient(white,white),linear-gradient(to_right,var(--color-gradient-start),var(--color-gradient-end))] ui:[background-clip:padding-box,border-box] hover:ui:bg-[linear-gradient(rgb(249_250_251),rgb(249_250_251)),linear-gradient(to_right,var(--color-gradient-start),var(--color-gradient-end))] active:ui:scale-[0.98]",
    icon: "ui:p-0 ui:bg-transparent ui:text-current hover:ui:opacity-70 active:ui:scale-95",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
