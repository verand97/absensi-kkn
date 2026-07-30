"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Camera, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MemberScannerPage() {
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const lastScannedRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);
  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping camera:", err);
      } finally {
        html5QrCodeRef.current = null;
        setIsCameraActive(false);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
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
        const msg = data.allAttended 
          ? `Berhasil absen Hari ke-${data.day}! Semua anggota telah absen, sesi otomatis ditutup.`
          : `Berhasil absen untuk Hari ke-${data.day}!`;
        setStatus({ type: 'success', msg });
        setTimeout(() => {
          stopCamera();
          router.push("/dashboard");
        }, 2500);
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
  };

  const startCamera = async (facing: 'environment' | 'user') => {
    await stopCamera();
    try {
      const qrCodeInstance = new Html5Qrcode("reader");
      html5QrCodeRef.current = qrCodeInstance;

      await qrCodeInstance.start(
        { facingMode: facing },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraActive(false);
      setStatus({ type: 'error', msg: "Gagal membuka kamera. Pastikan izin kamera diberikan." });
    }
  };

  const handleChangeFacingMode = async (newFacing: 'environment' | 'user') => {
    setFacingMode(newFacing);
    if (isCameraActive) {
      await startCamera(newFacing);
    }
  };

  const handleSwitchScanMode = async (mode: 'camera' | 'upload') => {
    setScanMode(mode);
    setStatus(null);
    if (mode === 'upload') {
      await stopCamera();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await stopCamera();
    setIsUploading(true);
    setStatus(null);

    try {
      const html5QrCodeFile = new Html5Qrcode("reader-file");
      const decodedText = await html5QrCodeFile.scanFile(file, true);
      await onScanSuccess(decodedText);
      await html5QrCodeFile.clear();
    } catch (err) {
      console.error("File decode error:", err);
      setStatus({ type: 'error', msg: "Kode QR tidak terbaca atau tidak ditemukan pada gambar." });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 relative z-10">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Dashboard</span>
        </Link>
        
        <div id="reader-file" className="hidden"></div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-blue-600/20 p-6 text-white text-center border-b border-blue-500/20">
            <h1 className="text-xl font-bold">Scanner Absensi Anggota</h1>
            <p className="text-slate-300 text-sm mt-1">Pilih Scan Kamera atau Upload Foto QR Code</p>
          </div>
          
          <div className="p-6">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1.5 rounded-xl mb-6">
              <button
                onClick={() => handleSwitchScanMode('camera')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  scanMode === 'camera'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Camera size={16} /> Scan Kamera
              </button>
              <button
                onClick={() => handleSwitchScanMode('upload')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  scanMode === 'upload'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Upload size={16} /> Upload Foto
              </button>
            </div>

            {/* Mode 1: Camera */}
            {scanMode === 'camera' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex items-center justify-between gap-2 mb-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Pilih Kamera:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleChangeFacingMode('environment')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        facingMode === 'environment'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📷 Belakang
                    </button>
                    <button
                      onClick={() => handleChangeFacingMode('user')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        facingMode === 'user'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🤳 Depan
                    </button>
                  </div>
                </div>

                <div className="w-full relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-950 min-h-65 flex flex-col items-center justify-center">
                  <div id="reader" className="w-full"></div>

                  {!isCameraActive && (
                    <div className="p-6 text-center flex flex-col items-center justify-center z-10">
                      <Camera size={40} className="text-slate-500 mb-3 animate-pulse" />
                      <p className="text-xs text-slate-400 font-semibold mb-4">
                        Siap Pindai ({facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'})
                      </p>
                      <button
                        onClick={() => startCamera(facingMode)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105"
                      >
                        Buka Kamera Presensi
                      </button>
                    </div>
                  )}
                </div>

                {isCameraActive && (
                  <button
                    onClick={stopCamera}
                    className="mt-4 text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1.5 px-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <X size={16} /> Hentikan Kamera
                  </button>
                )}
              </div>
            )}

            {/* Mode 2: Upload */}
            {scanMode === 'upload' && (
              <div className="w-full flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/60 p-8 text-center rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center group min-h-62.5"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={28} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">
                    Pilih File Foto QR Code
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    PNG, JPG, JPEG, WEBP
                  </p>
                  <span className="bg-slate-800 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                    Pilih File Foto
                  </span>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                </div>

                {isUploading && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400 tracking-wider uppercase animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    Memproses Gambar QR...
                  </div>
                )}
              </div>
            )}

            {status && (
              <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-green-400" size={24} /> : <AlertCircle className="shrink-0 text-red-400" size={24} />}
                <p className="font-bold text-sm mt-0.5">{status.msg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
