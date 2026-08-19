"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Image from "next/image";

export default function QRPage() {
  const [members, setMembers] = useState<{name: string, nim: string}[]>([]);
  const [selectedNim, setSelectedNim] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  const selectedMember = members.find(m => m.nim === selectedNim);

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 300, 300);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_Absensi_${selectedMember?.name.replace(/\s+/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-forest-900 text-mist-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-px bg-forest-700 shadow-2xl relative text-center" style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
        <div className="bg-forest-800 p-8" style={{ clipPath: "polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)" }}>
          <Link href="/" className="absolute top-6 left-6 text-mist-500 hover:text-sprout-400 transition-colors print:hidden">
            <ArrowLeft size={24} />
          </Link>
          
          <Image 
            src="/newlogokkn.png" 
            alt="Logo KKN Sumanding 2026" 
            width={80} 
            height={80} 
            className="mx-auto mb-4 mt-2 drop-shadow-[0_0_10px_rgba(143,227,152,0.3)]" 
          />

          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white mb-1 print:hidden">QR Code Saya</h1>
          <p className="text-mist-500 text-xs uppercase tracking-widest mb-6 print:hidden">Pilih nama Anda untuk melihat QR Code absensi.</p>

          <select 
            value={selectedNim}
            onChange={(e) => setSelectedNim(e.target.value)}
            className="w-full p-4 border border-forest-700 bg-forest-900 text-white focus:outline-none focus:border-pine-500 transition-all font-mono text-sm mb-6 print:hidden appearance-none"
            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
          >
            <option value="" disabled>-- Pilih Nama Anggota --</option>
            {members.map(m => (
              <option key={m.nim} value={m.nim}>{m.name}</option>
            ))}
          </select>

          {selectedMember && (
            <div className="animate-fade-in flex flex-col items-center bg-forest-900 p-6 border border-forest-700" style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}>
              <div className="bg-white p-4 mb-4" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                <QRCode id="qr-code-svg" value={selectedMember.nim} size={200} />
              </div>
              <h2 className="font-bold text-base text-white uppercase tracking-wider">{selectedMember.name}</h2>
              <p className="text-sprout-400 font-mono mt-1 text-sm font-bold">{selectedMember.nim}</p>
              
              <p className="text-[10px] text-sprout-400 mt-4 bg-pine-500/20 border border-pine-500/40 px-3 py-1.5 font-bold uppercase tracking-widest print:hidden" style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}>
                Tunjukkan QR Code ini ke admin saat absensi
              </p>
              
              <div className="flex items-center justify-center gap-3 w-full mt-6 print:hidden">
                <button 
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-pine-600 to-pine-500 hover:from-pine-500 hover:to-pine-300 text-white p-3 transition-colors font-bold text-xs uppercase tracking-widest shadow-sm cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  <Download size={16} />
                  Simpan
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-600 border border-pine-500/50 text-white p-3 transition-colors font-bold shadow-sm cursor-pointer"
                  title="Print QR Code"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  <Printer size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
