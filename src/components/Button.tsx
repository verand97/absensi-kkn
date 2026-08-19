import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "success" | "danger" | "amber" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  cutSize?: number;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  cutSize,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const defaultCut = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const cut = cutSize ?? defaultCut;
  const polygon = `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;

  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-3 text-xs",
    lg: "px-8 py-4 text-xs md:text-sm",
  };

  const variantStyles = {
    primary:
      "bg-linear-to-r from-pine-600 to-pine-500 hover:from-pine-500 hover:to-pine-300 text-white shadow-[0_0_15px_rgba(62,122,79,0.3)]",
    success:
      "bg-sprout-400 hover:bg-sprout-500 text-forest-900 font-black shadow-[0_0_12px_rgba(143,227,152,0.3)]",
    danger:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_12px_rgba(217,83,79,0.3)]",
    amber:
      "bg-amber-400 hover:bg-amber-500 text-forest-900 font-black shadow-[0_0_12px_rgba(227,162,62,0.3)]",
    outline:
      "bg-slate-100 dark:bg-forest-700 hover:bg-slate-200 dark:hover:bg-forest-600 border border-slate-300 dark:border-pine-500/50 text-slate-700 dark:text-mist-200",
    ghost:
      "bg-transparent hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-mist-200",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      style={{ clipPath: polygon, ...style }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
