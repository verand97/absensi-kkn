"use client";

import { useEffect, useState } from "react";
import { Clock, Flag } from "lucide-react";

interface CountdownProps {
  targetDate?: Date | string;
  title?: string;
  compact?: boolean;
}

function getTimeRemaining(targetDate: Date | string) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, isFinished: false };
}

export default function CountdownTimer({
  targetDate = "2026-09-04T23:59:59+07:00",
  title = "COUNTDOWN TO THE CLOSING OF KKN (04 SEPT 2026)",
  compact = false,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // ===== COMPACT MODE (badge satu baris — dipakai di header dashboard) =====
  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E3A23E]/10 dark:bg-[#E3A23E]/15 border border-[#E3A23E]/30 text-[#E3A23E] text-[10px] sm:text-xs font-mono font-bold"
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
      >
        <Clock size={13} className="text-[#E3A23E] animate-pulse shrink-0" />
        <span>
          {timeLeft.isFinished
            ? "KKN SELESAI 🎉"
            : `H-${timeLeft.days} | ${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
        </span>
      </div>
    );
  }

  // ===== FULL MODE (4 kotak — dipakai di landing page) =====
  return (
    <div
      className="p-px bg-slate-200 dark:bg-[#1C3324] shadow-xl w-full"
      style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
    >
      <div
        className="bg-white dark:bg-[#14241B] p-4 md:p-5 w-full transition-colors"
        style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-200 dark:border-[#1C3324] pb-2.5">
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-[#E3A23E] shrink-0" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-[#D7DDD6] font-display">{title}</h3>
          </div>
          <span className="text-[9px] font-mono font-bold text-[#E3A23E] bg-[#E3A23E]/10 px-2 py-0.5 border border-[#E3A23E]/30 self-start sm:self-auto rounded-xs">
            {timeLeft.isFinished ? "SELESAI 🎉" : "TARGET: 04 SEP 2026"}
          </span>
        </div>

        {timeLeft.isFinished ? (
          <div className="text-center py-3 text-[#E3A23E] font-bold text-sm uppercase tracking-widest animate-pulse">
            🎉 KKN SUMANDING 2026 TELAH RESMI SELESAI!
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-slate-100 dark:bg-[#0F1A14] p-2 sm:p-2.5 border border-slate-200 dark:border-[#1C3324] flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-lg sm:text-2xl font-black font-mono text-[#E3A23E]">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-[#9BA79C] mt-0.5">Hari</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2 sm:p-2.5 border border-slate-200 dark:border-[#1C3324] flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-lg sm:text-2xl font-black font-mono text-[#E3A23E]">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-[#9BA79C] mt-0.5">Jam</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2 sm:p-2.5 border border-slate-200 dark:border-[#1C3324] flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-lg sm:text-2xl font-black font-mono text-[#E3A23E]">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-[#9BA79C] mt-0.5">Menit</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2 sm:p-2.5 border border-slate-200 dark:border-[#1C3324] flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-lg sm:text-2xl font-black font-mono text-[#E3A23E]">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-[#9BA79C] mt-0.5">Detik</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}