"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { ArrowLeft, UserCircle2 } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl relative text-center">
        <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        
        <Image 
          src="/newlogokkn.png" 
          alt="Logo KKN Sumanding 2026" 
          width={80} 
          height={80} 
          className="mx-auto mb-6 mt-4 drop-shadow-md" 
        />

        <h1 className="text-2xl font-bold text-slate-800 mb-2">QR Code Saya</h1>
        <p className="text-slate-500 text-sm mb-8">Pilih nama Anda untuk melihat QR Code absensi.</p>

        <select 
          value={selectedNim}
          onChange={(e) => setSelectedNim(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 mb-8"
        >
          <option value="" disabled>-- Pilih Nama Anggota --</option>
          {members.map(m => (
            <option key={m.nim} value={m.nim}>{m.name}</option>
          ))}
        </select>

        {selectedMember && (
          <div className="animate-fade-in flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <QRCode value={selectedMember.nim} size={200} />
            </div>
            <h2 className="font-bold text-lg text-slate-800">{selectedMember.name}</h2>
            <p className="text-slate-500 font-mono mt-1 text-sm">{selectedMember.nim}</p>
            
            <p className="text-xs text-blue-600 mt-6 bg-blue-50 px-4 py-2 rounded-lg font-medium">
              Tunjukkan QR Code ini ke admin saat absensi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
