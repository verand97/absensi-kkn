import Link from "next/link";
import { QrCode, LogIn, Users } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-3xl p-8 shadow-xl animate-fade-in text-center relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-400 to-indigo-500"></div>

        <Image 
          src="/newlogokkn.png" 
          alt="Logo KKN Sumanding 2026" 
          width={90} 
          height={90} 
          className="mx-auto mb-6 drop-shadow-md" 
        />
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Absensi KKN Sumanding 2026</h1>
        <p className="text-slate-500 mb-10">Program Kehadiran 40 Hari</p>
        
        <div className="space-y-4">
          <Link href="/login" className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl transition-all font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1">
            <LogIn size={20} />
            Login Anggota & Admin
          </Link>
          
          <Link href="/qr" className="flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-4 rounded-2xl transition-all font-semibold shadow-sm hover:shadow-md hover:-translate-y-1">
            <QrCode size={20} />
            Lihat QR Code Anggota
          </Link>
        </div>
        
        <div className="mt-12 text-xs text-slate-400 font-medium">
          Dibuat untuk KKN Sumanding 2026
        </div>
      </div>
    </div>
  );
}
