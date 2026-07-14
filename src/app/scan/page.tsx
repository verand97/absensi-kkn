"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ScannerPage() {
  const [day, setDay] = useState<number>(1);
  const [lastScanned, setLastScanned] = useState<string>("");
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  
  // Calculate default day based on today (for demo purposes)
  // Real usage they might just select from dropdown.

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  async function onScanSuccess(decodedText: string) {
    if (decodedText === lastScanned) return; // Prevent multiple rapid scans of same QR
    setLastScanned(decodedText);
    
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim: decodedText, day }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: `Berhasil absen: ${data.memberName} (Hari ke-${data.day})` });
        // clear status after 3 seconds
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({ type: 'error', msg: data.error || "Gagal absen" });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Terjadi kesalahan jaringan" });
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
                  setDay(Number(e.target.value));
                  setLastScanned("");
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
              <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                <p className="font-medium">{status.msg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
