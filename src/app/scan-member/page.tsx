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
    <div className="min-h-screen bg-forest-900 text-mist-200 font-sans flex flex-col items-center py-10 px-4 relative z-10">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-mist-500 hover:text-sprout-400 mb-6 transition-colors font-bold text-xs tracking-widest uppercase">
          <ArrowLeft size={18} />
          <span>Kembali ke Dashboard</span>
        </Link>
        
        <div id="reader-file" className="hidden"></div>

        <div className="p-px bg-forest-700 shadow-2xl overflow-hidden" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="bg-forest-800" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            <div className="bg-forest-900 p-6 text-center border-b border-forest-700">
              <h1 className="text-xl font-bold font-display uppercase tracking-widest text-white">Scanner Absensi Anggota</h1>
              <p className="text-sprout-400 text-xs font-bold tracking-widest uppercase mt-1">Pilih Scan Kamera atau Upload Foto QR Code</p>
            </div>
            
            <div className="p-6">
              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-forest-900 p-1.5 border border-forest-700 mb-6" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                <button
                  onClick={() => handleSwitchScanMode('camera')}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    scanMode === 'camera'
                      ? 'bg-pine-500 text-white shadow-md'
                      : 'text-mist-500 hover:text-white hover:bg-forest-700'
                  }`}
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  <Camera size={16} /> Scan Kamera
                </button>
                <button
                  onClick={() => handleSwitchScanMode('upload')}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    scanMode === 'upload'
                      ? 'bg-pine-500 text-white shadow-md'
                      : 'text-mist-500 hover:text-white hover:bg-forest-700'
                  }`}
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  <Upload size={16} /> Upload Foto
                </button>
              </div>

              {/* Mode 1: Camera */}
              {scanMode === 'camera' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-between gap-2 mb-4 bg-forest-900 p-2.5 border border-forest-700" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                    <span className="text-xs font-bold uppercase text-mist-500">Pilih Kamera:</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleChangeFacingMode('environment')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          facingMode === 'environment'
                            ? 'bg-sprout-400/20 text-sprout-400 border border-sprout-400/40'
                            : 'text-mist-500 hover:text-slate-200'
                        }`}
                        style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                      >
                        📷 Belakang
                      </button>
                      <button
                        onClick={() => handleChangeFacingMode('user')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          facingMode === 'user'
                            ? 'bg-sprout-400/20 text-sprout-400 border border-sprout-400/40'
                            : 'text-mist-500 hover:text-slate-200'
                        }`}
                        style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                      >
                        🤳 Depan
                      </button>
                    </div>
                  </div>

                  <div className="w-full relative overflow-hidden border border-forest-700 bg-black min-h-65 flex flex-col items-center justify-center" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                    <div id="reader" className="w-full"></div>

                    {!isCameraActive && (
                      <div className="p-6 text-center flex flex-col items-center justify-center z-10">
                        <Camera size={40} className="text-sprout-400 mb-3 animate-pulse" />
                        <p className="text-xs text-mist-500 font-semibold uppercase tracking-wider mb-4">
                          Siap Pindai ({facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'})
                        </p>
                        <button
                          onClick={() => startCamera(facingMode)}
                          className="bg-linear-to-r from-pine-600 to-pine-500 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105 cursor-pointer"
                          style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                        >
                          Buka Kamera Presensi
                        </button>
                      </div>
                    )}
                  </div>

                  {isCameraActive && (
                    <button
                      onClick={stopCamera}
                      className="mt-4 text-xs text-rose-500 hover:text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1.5 py-1.5 px-4 bg-rose-500/10 border border-rose-500/20 cursor-pointer"
                      style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
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
                    className="w-full border-2 border-dashed border-forest-700 hover:border-pine-500 bg-forest-900 p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group min-h-62.5"
                    style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                  >
                    <div className="w-14 h-14 rounded-full bg-pine-500/20 text-sprout-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1 font-display uppercase tracking-wider">
                      Pilih File Foto QR Code
                    </p>
                    <p className="text-xs text-mist-500 font-mono tracking-widest uppercase mb-4">
                      PNG, JPG, JPEG, WEBP
                    </p>
                    <span 
                      className="bg-forest-700 border border-pine-500/50 text-white group-hover:bg-pine-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                      style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                    >
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
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-sprout-400 tracking-wider uppercase animate-pulse">
                      <div className="w-4 h-4 border-2 border-sprout-400 border-t-transparent rounded-full animate-spin"></div>
                      Memproses Gambar QR...
                    </div>
                  )}
                </div>
              )}

              {status && (
                <div className={`mt-4 p-4 flex items-start gap-3 animate-fade-in text-xs font-bold tracking-widest uppercase border ${status.type === 'success' ? 'bg-sprout-400/10 text-sprout-400 border-sprout-400/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                  {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-sprout-400" size={20} /> : <AlertCircle className="shrink-0 text-rose-500" size={20} />}
                  <p className="mt-0.5">{status.msg}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
