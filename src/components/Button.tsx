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
      "bg-gradient-to-r from-[#326440] to-[#3E7A4F] hover:from-[#3E7A4F] hover:to-[#5FA872] text-white shadow-[0_0_15px_rgba(62,122,79,0.3)]",
    success:
      "bg-[#8FE398] hover:bg-[#74D47E] text-[#0F1A14] font-black shadow-[0_0_12px_rgba(143,227,152,0.3)]",
    danger:
      "bg-[#D9534F] hover:bg-[#C9423E] text-white shadow-[0_0_12px_rgba(217,83,79,0.3)]",
    amber:
      "bg-[#E3A23E] hover:bg-[#D38E2C] text-[#0F1A14] font-black shadow-[0_0_12px_rgba(227,162,62,0.3)]",
    outline:
      "bg-slate-100 dark:bg-[#1A2E20] hover:bg-slate-200 dark:hover:bg-[#24422E] border border-slate-300 dark:border-[#3E7A4F]/50 text-slate-700 dark:text-[#D7DDD6]",
    ghost:
      "bg-transparent hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-[#D7DDD6]",
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
