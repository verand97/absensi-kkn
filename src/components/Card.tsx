import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  cutSize?: "sm" | "md" | "lg";
  variant?: "default" | "solid" | "bordered";
}

export default function Card({
  children,
  className = "",
  cutSize = "md",
  variant = "default",
  style,
  ...props
}: CardProps) {
  const cutPixels = cutSize === "sm" ? 12 : cutSize === "lg" ? 24 : 16;
  const innerCutPixels = cutPixels - 1;

  const outerPolygon = `polygon(${cutPixels}px 0, 100% 0, 100% calc(100% - ${cutPixels}px), calc(100% - ${cutPixels}px) 100%, 0 100%, 0 ${cutPixels}px)`;
  const innerPolygon = `polygon(${innerCutPixels}px 0, 100% 0, 100% calc(100% - ${innerCutPixels}px), calc(100% - ${innerCutPixels}px) 100%, 0 100%, 0 ${innerCutPixels}px)`;

  let outerBg = "bg-slate-200 dark:bg-[#1C3324]/60";
  let innerBg = "bg-white dark:bg-[#1C3324]";

  if (variant === "solid") {
    outerBg = "bg-[#1C3324]";
    innerBg = "bg-[#1C3324]";
  } else if (variant === "bordered") {
    outerBg = "bg-[#3E7A4F]/40";
    innerBg = "bg-white dark:bg-[#0F1A14]";
  }

  return (
    <div
      className={`p-px ${outerBg} shadow-xl transition-colors ${className}`}
      style={{ clipPath: outerPolygon, ...style }}
      {...props}
    >
      <div
        className={`w-full h-full ${innerBg} transition-colors`}
        style={{ clipPath: innerPolygon }}
      >
        {children}
      </div>
    </div>
  );
}
