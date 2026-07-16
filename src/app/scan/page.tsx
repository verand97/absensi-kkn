"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ScannerPage() {
  const [day, setDay] = useState<number>(1);
  const dayRef = useRef<number>(1);
  const lastScannedRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const [history, setHistory] = useState<{name: string, status: 'success'|'error', msg: string, time: string}[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  
  // Calculate default day based on today (for demo purposes)
  // Real usage they might just select from dropdown.

  useEffect(() => {
    async function onScanSuccess(decodedText: string) {
      if (decodedText === lastScannedRef.current || isProcessingRef.current) return;
      
      lastScannedRef.current = decodedText;
      isProcessingRef.current = true;
      
      try {
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nim: decodedText, day: dayRef.current }),
        });
        
        const data = await res.json();
        const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        if (res.ok) {
          setStatus({ type: 'success', msg: `Berhasil absen: ${data.memberName} (Hari ke-${data.day})` });
          setHistory(prev => [{name: data.memberName, status: 'success' as const, msg: `Hadir (H-${data.day})`, time: now}, ...prev].slice(0, 10));
        } else {
          const errorMsg = data.error || "Gagal absen";
          setStatus({ type: 'error', msg: errorMsg });
          setHistory(prev => [{name: decodedText, status: 'error' as const, msg: errorMsg, time: now}, ...prev].slice(0, 10));
        }
        
      } catch {
        const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setStatus({ type: 'error', msg: "Terjadi kesalahan jaringan" });
        setHistory(prev => [{name: decodedText, status: 'error' as const, msg: "Kesalahan jaringan", time: now}, ...prev].slice(0, 10));
      } finally {
        // Clear status and allow rescanning the same QR after 2.5 seconds
        setTimeout(() => {
          setStatus(null);
          lastScannedRef.current = "";
        }, 2500);
        
        // Allow processing a new QR almost immediately (0.5s debounce for different QRs)
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 500);
      }
    }

    function onScanFailure() {
      // Ignore frequent scan failures
    }

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 }
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 relative z-10">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Dashboard</span>
        </Link>
        
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-blue-600/20 p-6 text-white text-center border-b border-blue-500/20">
            <h1 className="text-xl font-bold">Scanner Absensi</h1>
            <p className="text-slate-300 text-sm mt-1">Arahkan kamera ke QR Code Anggota</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Pilih Hari Absensi</label>
              <select 
                value={day} 
                onChange={(e) => {
                  const newDay = Number(e.target.value);
                  setDay(newDay);
                  dayRef.current = newDay;
                  lastScannedRef.current = "";
                }}
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950/50 text-white focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium scheme-light dark:scheme-dark"
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>Hari ke-{i + 1}</option>
                ))}
              </select>
            </div>

            <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-950"></div>

            {status && (
              <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-start gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-2 border-green-500/30' : 'bg-red-500/10 text-red-400 border-2 border-red-500/30 backdrop-blur-md'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-400" size={24} /> : <AlertCircle className="shrink-0 text-red-400" size={24} />}
                <p className="font-bold text-base">{status.msg}</p>
              </div>
            )}
          </div>
          
          {history.length > 0 && (
            <div className="bg-slate-950/50 border-t border-white/5 p-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center justify-between">
                <span>Riwayat Terakhir (Sesi Ini)</span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px] border border-blue-500/20">{history.length}</span>
              </h3>
              <ul className="space-y-3">
                {history.map((item, i) => (
                  <li key={i} className={`p-3 rounded-xl border text-sm flex items-center justify-between shadow-sm ${item.status === 'success' ? 'bg-slate-800/50 border-green-500/20' : 'bg-slate-800/50 border-red-500/20'}`}>
                    <div>
                      <p className="font-bold text-slate-200">{item.name}</p>
                      <p className={`text-xs mt-0.5 ${item.status === 'success' ? 'text-green-400 font-semibold' : 'text-red-400'}`}>{item.msg}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-700">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
