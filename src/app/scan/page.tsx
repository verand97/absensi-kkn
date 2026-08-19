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
          const successMsg = data.allAttended
            ? `BERHASIL: ${data.memberName} (H-${data.day}) - SEMUA ANGGOTA TELAH ABSEN (SESI DITUTUP)`
            : `BERHASIL: ${data.memberName} (H-${data.day})`;
          const logMsg = data.allAttended
            ? `HADIR (H-${data.day}) - SESI DITUTUP`
            : `HADIR (H-${data.day})`;
          setStatus({ type: 'success', msg: successMsg });
          setHistory(prev => [{name: data.memberName, status: 'success' as const, msg: logMsg, time: now}, ...prev].slice(0, 10));
        } else {
          const errorMsg = data.error?.toUpperCase() || "GAGAL ABSEN";
          setStatus({ type: 'error', msg: errorMsg });
          setHistory(prev => [{name: decodedText, status: 'error' as const, msg: errorMsg, time: now}, ...prev].slice(0, 10));
        }
        
      } catch {
        const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setStatus({ type: 'error', msg: "ERROR JARINGAN/SISTEM" });
        setHistory(prev => [{name: decodedText, status: 'error' as const, msg: "ERROR JARINGAN", time: now}, ...prev].slice(0, 10));
      } finally {
        setTimeout(() => {
          setStatus(null);
          lastScannedRef.current = "";
        }, 2500);
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 500);
      }
    }

    function onScanFailure() {}

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="min-h-screen bg-forest-900 text-mist-200 font-sans overflow-hidden flex flex-col items-center py-10 px-4 relative selection:bg-sprout-400/30 z-10">
      
      {/* Background Gradients & Grid */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-pine-500/15 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sprout-400/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-slate-400 hover:text-sprout-400 mb-8 transition-colors text-xs font-bold tracking-widest uppercase">
          <ArrowLeft size={16} /> Dashboard Admin
        </Link>
        
        <div className="p-px bg-forest-700 shadow-2xl mb-8" style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
          <div className="bg-forest-800 flex flex-col" style={{ clipPath: "polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)" }}>
            
            <div className="bg-forest-900 p-6 text-center border-b border-forest-700">
              <h1 className="text-xl font-bold font-display uppercase tracking-widest text-white drop-shadow-md">Scanner Admin</h1>
              <p className="text-sprout-400 text-xs font-bold tracking-widest uppercase mt-1">Arahkan kamera ke QR Code Anggota</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-mist-500 uppercase tracking-widest mb-2">Pilih Hari Absensi</label>
                <select 
                  value={day} 
                  onChange={(e) => {
                    const newDay = Number(e.target.value);
                    setDay(newDay);
                    dayRef.current = newDay;
                    lastScannedRef.current = "";
                  }}
                  className="w-full p-4 bg-forest-900 border border-forest-700 text-white focus:outline-none focus:border-pine-500 transition-colors font-mono appearance-none"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                >
                  {Array.from({ length: 40 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>HARI {i + 1}</option>
                  ))}
                </select>
              </div>

              <div id="reader" className="w-full overflow-hidden border border-forest-700 bg-black" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}></div>

              {status && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md p-4 flex items-start gap-3 animate-fade-in text-xs font-bold tracking-widest uppercase border ${status.type === 'success' ? 'bg-sprout-400/90 backdrop-blur-md text-forest-900 shadow-[0_0_30px_rgba(143,227,152,0.3)]' : 'bg-rose-500/90 backdrop-blur-md text-white shadow-[0_0_30px_rgba(217,83,79,0.3)]'}`} style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                  {status.type === 'success' ? <CheckCircle2 className="shrink-0" size={16} /> : <AlertCircle className="shrink-0" size={16} />}
                  <p>{status.msg}</p>
                </div>
              )}
            </div>
            
            {history.length > 0 && (
              <div className="bg-forest-900 border-t border-forest-700 p-6 md:p-8 animate-fade-in">
                <h3 className="text-xs font-bold text-mist-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Log Pemindaian</span>
                  <span className="bg-pine-500/20 text-sprout-400 px-2 py-0.5 border border-pine-500/40">{history.length}</span>
                </h3>
                <ul className="space-y-3">
                  {history.map((item, i) => (
                    <li key={i} className={`p-3 border flex items-center justify-between ${item.status === 'success' ? 'bg-forest-800 border-sprout-400/30' : 'bg-forest-800 border-rose-500/30'}`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                      <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider">{item.name}</p>
                        <p className={`text-[10px] mt-1 font-bold tracking-widest uppercase ${item.status === 'success' ? 'text-sprout-400' : 'text-rose-500'}`}>{item.msg}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-mist-500 bg-forest-900 px-2 py-1 border border-forest-700">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
