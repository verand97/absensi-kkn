"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, CheckCircle2, AlertCircle } from "lucide-react";
import LogoutButton from "./LogoutButton";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

interface SettingData {
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface MemberData {
  name: string;
  nim: string;
  attendances: { day: number }[];
}

export default function MemberDashboard({ member, setting }: { member: MemberData, setting: SettingData }) {
  const presentDays = new Set(member.attendances.map((a: { day: number }) => a.day));
  
  const [showScanner, setShowScanner] = useState(false);
  const lastScannedRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!showScanner) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

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
            router.refresh();
            setShowScanner(false);
            setStatus(null);
          }, 2000);
        } else {
          const errorMsg = data.error || "Gagal absen";
          setStatus({ type: 'error', msg: errorMsg });
        }
        
      } catch {
        setStatus({ type: 'error', msg: "Terjadi kesalahan jaringan" });
      } finally {
        setTimeout(() => {
          setStatus(prev => prev?.type === 'success' ? prev : null);
          lastScannedRef.current = "";
        }, 3000);
        
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 1000);
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
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [showScanner, router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Anggota</h1>
            <p className="text-slate-500 text-sm mt-1">Selamat datang, {member.name}</p>
          </div>
          <LogoutButton />
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-xl font-bold">Status Absensi</h2>
            <p className="text-blue-100 text-sm mt-1">
              Jam buka: {setting.startTime} - {setting.endTime}
            </p>
          </div>
          
          <div className="p-6">
            {!setting.isActive ? (
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                <AlertCircle className="mx-auto mb-2 text-slate-400" size={32} />
                <p className="font-medium">Sesi absensi saat ini sedang ditutup oleh Admin.</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                {/* QR Code Anda */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                  <h3 className="font-bold text-slate-700 mb-4">QR Code Anda</h3>
                  <div className="bg-white p-3 rounded-xl shadow-sm mb-4 border border-slate-100">
                    <QRCode value={member.nim} size={160} />
                  </div>
                  <p className="text-sm text-center text-slate-500 font-medium">
                    Tunjukkan QR ini ke Admin untuk di-scan.
                  </p>
                </div>
                
                {/* Scanner Absen Mandiri */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                  <h3 className="font-bold text-slate-700 mb-4">Absen Mandiri</h3>
                  
                  {!showScanner ? (
                    <div className="text-center flex flex-col items-center w-full">
                      <p className="text-sm text-slate-500 mb-6 font-medium">
                        Atau Anda bisa absen mandiri dengan men-scan QR Code dari layar Admin.
                      </p>
                      <button
                        onClick={() => setShowScanner(true)}
                        className="flex items-center justify-center gap-2 w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <Camera size={20} />
                        Buka Scanner
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col">
                      <div className="flex justify-between items-center mb-3 px-1">
                        <h4 className="font-bold text-sm text-slate-700">Arahkan ke QR Admin</h4>
                        <button 
                          onClick={() => setShowScanner(false)} 
                          className="text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-full transition-colors border border-slate-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white"></div>
                      
                      {status && (
                        <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 animate-fade-in text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-600 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={18} />}
                          <p className="font-bold">{status.msg}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold mb-4">Riwayat Kehadiran Anda (Total: {presentDays.size})</h2>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: 40 }).map((_, i) => {
              const isPresent = presentDays.has(i + 1);
              return (
                <div 
                  key={i} 
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                    isPresent 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold mb-1">H{i + 1}</span>
                  {isPresent ? '✓' : '-'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
