"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ArrowLeft, UserCircle2, Download, Printer } from "lucide-react";
import Image from "next/image";

export default function QRPage() {
  const [members, setMembers] = useState<{name: string, nim: string}[]>([]);
  const [selectedNim, setSelectedNim] = useState("");

  useEffect(() => {
    // Fetch members from API to populate dropdown
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl relative text-center">
        <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors print:hidden">
          <ArrowLeft size={24} />
        </Link>
        
        <Image 
          src="/newlogokkn.png" 
          alt="Logo KKN Sumanding 2026" 
          width={80} 
          height={80} 
          className="mx-auto mb-6 mt-4 drop-shadow-md" 
        />

        <h1 className="text-2xl font-bold text-slate-800 mb-2 print:hidden">QR Code Saya</h1>
        <p className="text-slate-500 text-sm mb-8 print:hidden">Pilih nama Anda untuk melihat QR Code absensi.</p>

        <select 
          value={selectedNim}
          onChange={(e) => setSelectedNim(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 mb-8 print:hidden"
        >
          <option value="" disabled>-- Pilih Nama Anggota --</option>
          {members.map(m => (
            <option key={m.nim} value={m.nim}>{m.name}</option>
          ))}
        </select>

        {selectedMember && (
          <div className="animate-fade-in flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <QRCode id="qr-code-svg" value={selectedMember.nim} size={200} />
            </div>
            <h2 className="font-bold text-lg text-slate-800">{selectedMember.name}</h2>
            <p className="text-slate-500 font-mono mt-1 text-sm">{selectedMember.nim}</p>
            
            <p className="text-xs text-blue-600 mt-6 bg-blue-50 px-4 py-2 rounded-lg font-medium print:hidden">
              Tunjukkan QR Code ini ke admin saat absensi
            </p>
            
            <div className="flex items-center justify-center gap-3 w-full mt-6 print:hidden">
              <button 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors font-semibold text-sm shadow-sm"
              >
                <Download size={16} />
                Simpan
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl transition-colors font-semibold shadow-sm"
                title="Print QR Code"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
