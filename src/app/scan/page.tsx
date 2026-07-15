"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      
    } catch (err) {
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

  function onScanFailure(error: any) {
    // Ignore frequent scan failures
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Dashboard</span>
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-xl font-bold">Scanner Absensi</h1>
            <p className="text-blue-100 text-sm mt-1">Arahkan kamera ke QR Code Anggota</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Hari Absensi</label>
              <select 
                value={day} 
                onChange={(e) => {
                  const newDay = Number(e.target.value);
                  setDay(newDay);
                  dayRef.current = newDay;
                  lastScannedRef.current = "";
                }}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>Hari ke-{i + 1}</option>
                ))}
              </select>
            </div>

            <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-slate-200"></div>

            {status && (
              <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md p-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-red-50 text-red-700 border-2 border-red-200'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-600" size={24} /> : <AlertCircle className="shrink-0 text-red-600" size={24} />}
                <p className="font-bold text-base">{status.msg}</p>
              </div>
            )}
          </div>
          
          {history.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-100 p-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                <span>Riwayat Terakhir (Sesi Ini)</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{history.length}</span>
              </h3>
              <ul className="space-y-3">
                {history.map((item, i) => (
                  <li key={i} className={`p-3 rounded-xl border text-sm flex items-center justify-between shadow-sm ${item.status === 'success' ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className={`text-xs mt-0.5 ${item.status === 'success' ? 'text-green-600 font-semibold' : 'text-red-500'}`}>{item.msg}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{item.time}</span>
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
