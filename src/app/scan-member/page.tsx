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
    <div className="min-h-screen bg-[#0F1A14] text-[#D7DDD6] font-sans flex flex-col items-center py-10 px-4 relative z-10">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#9BA79C] hover:text-[#8FE398] mb-6 transition-colors font-bold text-xs tracking-widest uppercase">
          <ArrowLeft size={18} />
          <span>Kembali ke Dashboard</span>
        </Link>
        
        <div id="reader-file" className="hidden"></div>

        <div className="p-px bg-[#1C3324] shadow-2xl overflow-hidden" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
          <div className="bg-[#14241B]" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
            <div className="bg-[#0F1A14] p-6 text-center border-b border-[#1C3324]">
              <h1 className="text-xl font-bold font-display uppercase tracking-widest text-white">Scanner Absensi Anggota</h1>
              <p className="text-[#8FE398] text-xs font-bold tracking-widest uppercase mt-1">Pilih Scan Kamera atau Upload Foto QR Code</p>
            </div>
            
            <div className="p-6">
              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#0F1A14] p-1.5 border border-[#1C3324] mb-6" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                <button
                  onClick={() => handleSwitchScanMode('camera')}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    scanMode === 'camera'
                      ? 'bg-[#3E7A4F] text-white shadow-md'
                      : 'text-[#9BA79C] hover:text-white hover:bg-[#1C3324]'
                  }`}
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  <Camera size={16} /> Scan Kamera
                </button>
                <button
                  onClick={() => handleSwitchScanMode('upload')}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    scanMode === 'upload'
                      ? 'bg-[#3E7A4F] text-white shadow-md'
                      : 'text-[#9BA79C] hover:text-white hover:bg-[#1C3324]'
                  }`}
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  <Upload size={16} /> Upload Foto
                </button>
              </div>

              {/* Mode 1: Camera */}
              {scanMode === 'camera' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-between gap-2 mb-4 bg-[#0F1A14] p-2.5 border border-[#1C3324]" style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                    <span className="text-xs font-bold uppercase text-[#9BA79C]">Pilih Kamera:</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleChangeFacingMode('environment')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          facingMode === 'environment'
                            ? 'bg-[#8FE398]/20 text-[#8FE398] border border-[#8FE398]/40'
                            : 'text-[#9BA79C] hover:text-slate-200'
                        }`}
                        style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                      >
                        📷 Belakang
                      </button>
                      <button
                        onClick={() => handleChangeFacingMode('user')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          facingMode === 'user'
                            ? 'bg-[#8FE398]/20 text-[#8FE398] border border-[#8FE398]/40'
                            : 'text-[#9BA79C] hover:text-slate-200'
                        }`}
                        style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                      >
                        🤳 Depan
                      </button>
                    </div>
                  </div>

                  <div className="w-full relative overflow-hidden border border-[#1C3324] bg-black min-h-65 flex flex-col items-center justify-center" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                    <div id="reader" className="w-full"></div>

                    {!isCameraActive && (
                      <div className="p-6 text-center flex flex-col items-center justify-center z-10">
                        <Camera size={40} className="text-[#8FE398] mb-3 animate-pulse" />
                        <p className="text-xs text-[#9BA79C] font-semibold uppercase tracking-wider mb-4">
                          Siap Pindai ({facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'})
                        </p>
                        <button
                          onClick={() => startCamera(facingMode)}
                          className="bg-gradient-to-r from-[#326440] to-[#3E7A4F] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105 cursor-pointer"
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
                      className="mt-4 text-xs text-[#D9534F] hover:text-[#C9423E] font-bold uppercase tracking-wider flex items-center gap-1.5 py-1.5 px-4 bg-[#D9534F]/10 border border-[#D9534F]/20 cursor-pointer"
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
                    className="w-full border-2 border-dashed border-[#1C3324] hover:border-[#3E7A4F] bg-[#0F1A14] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group min-h-62.5"
                    style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#3E7A4F]/20 text-[#8FE398] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1 font-display uppercase tracking-wider">
                      Pilih File Foto QR Code
                    </p>
                    <p className="text-xs text-[#9BA79C] font-mono tracking-widest uppercase mb-4">
                      PNG, JPG, JPEG, WEBP
                    </p>
                    <span 
                      className="bg-[#1C3324] border border-[#3E7A4F]/50 text-white group-hover:bg-[#3E7A4F] px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
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
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#8FE398] tracking-wider uppercase animate-pulse">
                      <div className="w-4 h-4 border-2 border-[#8FE398] border-t-transparent rounded-full animate-spin"></div>
                      Memproses Gambar QR...
                    </div>
                  )}
                </div>
              )}

              {status && (
                <div className={`mt-4 p-4 flex items-start gap-3 animate-fade-in text-xs font-bold tracking-widest uppercase border ${status.type === 'success' ? 'bg-[#8FE398]/10 text-[#8FE398] border-[#8FE398]/30' : 'bg-[#D9534F]/10 text-[#D9534F] border-[#D9534F]/30'}`} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}>
                  {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-[#8FE398]" size={20} /> : <AlertCircle className="shrink-0 text-[#D9534F]" size={20} />}
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
