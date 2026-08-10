"use client";

import { useEffect, useState } from "react";
import { Clock, Flag } from "lucide-react";

interface CountdownProps {
  targetDate?: Date | string;
  title?: string;
  compact?: boolean;
}

export default function CountdownTimer({ 
  targetDate = "2026-09-04T23:59:59+07:00", 
  title = "HITUNGAN MUNDUR HINGGA PENUTUPAN KKN (4 SEPT 2026)",
  compact = false 
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return null;
  }

  if (compact) {
    return (
      <div 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7F56FF]/10 border border-[#7F56FF]/30 text-[#7F56FF] text-xs font-mono font-bold"
        style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
      >
        <Clock size={14} className="text-[#80FF56] animate-pulse" />
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
      className="p-px bg-linear-to-r from-purple-500/30 via-[#7F56FF]/40 to-green-400/30 shadow-xl w-full"
      style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
    >
      <div 
        className="bg-slate-900/90 dark:bg-[#12141C] p-5 md:p-6 w-full"
        style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-[#80FF56] shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">{title}</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#80FF56] bg-[#80FF56]/10 px-2 py-0.5 border border-[#80FF56]/30 self-start sm:self-auto">
            {timeLeft.isFinished ? "SELESAI 🎉" : "TARGET: 04 SEP 2026"}
          </span>
        </div>

        {timeLeft.isFinished ? (
          <div className="text-center py-4 text-[#80FF56] font-bold text-base uppercase tracking-widest animate-pulse">
            🎉 KKN SUMANDING 2026 TELAH RESMI SELESAI!
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="bg-slate-800/80 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-700/60 flex flex-col items-center justify-center rounded-xs">
              <span className="text-xl sm:text-3xl font-black font-mono text-[#80FF56]">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Hari</span>
            </div>
            <div className="bg-slate-800/80 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-700/60 flex flex-col items-center justify-center rounded-xs">
              <span className="text-xl sm:text-3xl font-black font-mono text-[#7F56FF]">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Jam</span>
            </div>
            <div className="bg-slate-800/80 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-700/60 flex flex-col items-center justify-center rounded-xs">
              <span className="text-xl sm:text-3xl font-black font-mono text-cyan-400">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Menit</span>
            </div>
            <div className="bg-slate-800/80 dark:bg-[#090A0F] p-2.5 sm:p-3 border border-slate-700/60 flex flex-col items-center justify-center rounded-xs">
              <span className="text-xl sm:text-3xl font-black font-mono text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Detik</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
