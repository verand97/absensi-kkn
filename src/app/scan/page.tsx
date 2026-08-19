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
    <div className="min-h-screen bg-[#0F1A14] text-[#D7DDD6] font-sans overflow-hidden flex flex-col items-center py-10 px-4 relative selection:bg-[#8FE398]/30 z-10">
      
      {/* Background Gradients & Grid */}
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[#3E7A4F]/15 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8FE398]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link href="/dashboard/admin" className="flex items-center gap-2 text-slate-400 hover:text-[#8FE398] mb-8 transition-colors text-xs font-bold tracking-widest uppercase">
          <ArrowLeft size={16} /> Dashboard Admin
        </Link>
        
        <div className="p-px bg-[#1C3324] shadow-2xl mb-8" style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
          <div className="bg-[#14241B] flex flex-col" style={{ clipPath: "polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)" }}>
            
            <div className="bg-[#0F1A14] p-6 text-center border-b border-[#1C3324]">
              <h1 className="text-xl font-bold font-display uppercase tracking-widest text-white drop-shadow-md">Scanner Admin</h1>
              <p className="text-[#8FE398] text-xs font-bold tracking-widest uppercase mt-1">Arahkan kamera ke QR Code Anggota</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-[#9BA79C] uppercase tracking-widest mb-2">Pilih Hari Absensi</label>
                <select 
                  value={day} 
                  onChange={(e) => {
                    const newDay = Number(e.target.value);
                    setDay(newDay);
                    dayRef.current = newDay;
                    lastScannedRef.current = "";
                  }}
                  className="w-full p-4 bg-[#0F1A14] border border-[#1C3324] text-white focus:outline-none focus:border-[#3E7A4F] transition-colors font-mono appearance-none"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                >
                  {Array.from({ length: 40 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>HARI {i + 1}</option>
                  ))}
                </select>
              </div>

              <div id="reader" className="w-full overflow-hidden border border-[#1C3324] bg-black" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}></div>

              {status && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md p-4 flex items-start gap-3 animate-fade-in text-xs font-bold tracking-widest uppercase border ${status.type === 'success' ? 'bg-[#8FE398]/90 backdrop-blur-md text-[#0F1A14] shadow-[0_0_30px_rgba(143,227,152,0.3)]' : 'bg-[#D9534F]/90 backdrop-blur-md text-white shadow-[0_0_30px_rgba(217,83,79,0.3)]'}`} style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                  {status.type === 'success' ? <CheckCircle2 className="shrink-0" size={16} /> : <AlertCircle className="shrink-0" size={16} />}
                  <p>{status.msg}</p>
                </div>
              )}
            </div>
            
            {history.length > 0 && (
              <div className="bg-[#0F1A14] border-t border-[#1C3324] p-6 md:p-8 animate-fade-in">
                <h3 className="text-xs font-bold text-[#9BA79C] uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Log Pemindaian</span>
                  <span className="bg-[#3E7A4F]/20 text-[#8FE398] px-2 py-0.5 border border-[#3E7A4F]/40">{history.length}</span>
                </h3>
                <ul className="space-y-3">
                  {history.map((item, i) => (
                    <li key={i} className={`p-3 border flex items-center justify-between ${item.status === 'success' ? 'bg-[#14241B] border-[#8FE398]/30' : 'bg-[#14241B] border-[#D9534F]/30'}`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                      <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wider">{item.name}</p>
                        <p className={`text-[10px] mt-1 font-bold tracking-widest uppercase ${item.status === 'success' ? 'text-[#8FE398]' : 'text-[#D9534F]'}`}>{item.msg}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#9BA79C] bg-[#0F1A14] px-2 py-1 border border-[#1C3324]">{item.time}</span>
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
