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
  compact = false 
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (compact) {
    return (
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7F56FF]/10 dark:bg-[#7F56FF]/20 border border-[#7F56FF]/30 text-[#7F56FF] text-xs font-mono font-bold"
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
      >
        <Clock size={14} className="text-emerald-600 dark:text-[#80FF56] animate-pulse" />
        <span>
          {timeLeft.isFinished
            ? "KKN SELESAI 🎉"
            : `${timeLeft.days} Hari ${timeLeft.hours} Jam ${timeLeft.minutes}m ${timeLeft.seconds}s`}
        </span>
      </div>
    );
  }

  return (
    <div 
      className="p-px bg-slate-200 dark:bg-slate-700/50 shadow-xl w-full"
      style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
    >
      <div 
        className="bg-white dark:bg-[#12141C] p-5 md:p-6 w-full transition-colors"
        style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-emerald-600 dark:text-[#80FF56] shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">{title}</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-[#80FF56] bg-emerald-500/10 dark:bg-[#80FF56]/10 px-2.5 py-0.5 border border-emerald-500/30 dark:border-[#80FF56]/30 self-start sm:self-auto rounded-xs">
            {timeLeft.isFinished ? "SELESAI 🎉" : "TARGET: 04 SEP 2026"}
          </span>
        </div>

        {timeLeft.isFinished ? (
          <div className="text-center py-4 text-emerald-600 dark:text-[#80FF56] font-bold text-base uppercase tracking-widest animate-pulse">
            🎉 KKN SUMANDING 2026 TELAH RESMI SELESAI!
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-[#80FF56]">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mt-0.5">Hari</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-xl sm:text-3xl font-black font-mono text-[#7F56FF]">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mt-0.5">Jam</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-xl sm:text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mt-0.5">Menit</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center rounded-xs transition-colors">
              <span className="text-xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mt-0.5">Detik</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
