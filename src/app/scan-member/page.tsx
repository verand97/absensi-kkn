"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MemberScannerPage() {
  const lastScannedRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();
  
  async function onScanSuccess(decodedText: string) {
    if (decodedText === lastScannedRef.current || isProcessingRef.current) return;
    
    lastScannedRef.current = decodedText;
    isProcessingRef.current = true;
    
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: decodedText }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: `Berhasil absen untuk Hari ke-${data.day}!` });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const errorMsg = data.error || "Gagal absen";
        setStatus({ type: 'error', msg: errorMsg });
      }
      
    } catch {
      setStatus({ type: 'error', msg: "Terjadi kesalahan jaringan" });
    } finally {
      setTimeout(() => {
        setStatus(null);
        lastScannedRef.current = "";
      }, 3000);
      
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000);
    }
  }

  function onScanFailure() {
    // Ignore frequent scan failures
  }

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Dashboard</span>
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-xl font-bold">Scanner Absensi Anggota</h1>
            <p className="text-blue-100 text-sm mt-1">Scan QR Code yang ditampilkan Admin atau upload gambar QR Code</p>
          </div>
          
          <div className="p-6">
            <div id="reader" className="w-full overflow-hidden rounded-2xl border-2 border-slate-200 mb-4"></div>

            {status && (
              <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-600" size={24} /> : <AlertCircle className="shrink-0 text-red-600" size={24} />}
                <p className="font-bold text-sm mt-0.5">{status.msg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
