"use client";

import { useState } from "react";
import { UserCog, Save, X, AlertCircle, CheckCircle2, Eye, EyeOff, Download, Printer, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

interface MemberData {
  name: string;
  nim: string;
}

export default function MemberAccountSettings({ member }: { member: MemberData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);
  const [editName, setEditName] = useState(member.name);
  const [editNim, setEditNim] = useState(member.nim);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const router = useRouter();

  const handleDownloadQR = () => {
    const svg = document.querySelector("#member-qr-wrapper svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${member.nim}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrintQR = () => {
    const svg = document.querySelector("#member-qr-wrapper svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Cetak QR Code ${member.name}</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${pngFile}" style="max-width: 100%; width: 400px;" />
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 250);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    if (!editName.trim() || !editNim.trim()) {
      setStatus({ type: 'error', msg: 'NAMA DAN NIM TIDAK BOLEH KOSONG' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, nim: editNim })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'PROFIL DIPERBARUI' });
        setTimeout(() => {
          setIsEditing(false);
          setStatus(null);
          router.refresh();
        }, 1500);
      } else {
        setStatus({ type: 'error', msg: data.error?.toUpperCase() || 'GAGAL MEMPERBARUI' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'ERROR JARINGAN' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 mt-8 mb-8">
      {/* Box Identitas Anda / QR Code Member */}
      <div className="p-px bg-slate-200 dark:bg-slate-700/50" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
        <div className="bg-white dark:bg-[#12141C] p-6 md:p-8 flex flex-col items-center justify-center text-center" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
          <h2 className="font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#7F56FF] rounded-full"></div>
            Identitas Anda (QR Code Absensi)
          </h2>
          
          {!showMyQR ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 bg-slate-100 dark:bg-[#090A0F] border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center opacity-60 mb-6 relative" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                 <QrCode size={40} className="text-slate-500 dark:text-slate-500 mb-2" />
                 <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold tracking-widest">TERKUNCI</span>
              </div>
              <button 
                onClick={() => setShowMyQR(true)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-[#1A1C23] hover:bg-[#252836] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-5 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
              >
                <Eye size={16} /> Buka QR Code
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-xs">
              <div id="member-qr-wrapper" className="bg-white p-3 mb-6" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                <QRCode value={member.nim} size={160} />
              </div>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <button onClick={handleDownloadQR} title="Unduh Gambar QR" className="p-2.5 bg-slate-100 dark:bg-[#1A1C23] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252836] transition-colors"><Download size={16} /></button>
                <button onClick={handlePrintQR} title="Cetak QR" className="p-2.5 bg-slate-100 dark:bg-[#1A1C23] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#252836] transition-colors"><Printer size={16} /></button>
                <button onClick={() => setShowMyQR(false)} className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <EyeOff size={16} /> Tutup
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                Tunjukkan ke admin saat pemindaian manual
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pengaturan Akun */}
      <div className="p-px bg-slate-200 dark:bg-slate-700/50" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
        <div className="bg-white dark:bg-[#12141C] p-6 md:p-8" style={{ clipPath: "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)" }}>
          
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <UserCog className="text-[#80FF56] w-6 h-6" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest">Pengaturan Akun</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] font-bold tracking-widest uppercase text-[#7F56FF] hover:text-[#80FF56] transition-colors border border-transparent hover:border-[#80FF56]/30 px-3 py-1.5 bg-transparent hover:bg-[#80FF56]/10"
                style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
              >
                [ EDIT PROFIL ]
              </button>
            )}
          </div>

          {status && (
            <div className={`mb-6 p-4 flex items-start gap-3 text-xs font-bold tracking-widest uppercase border ${status.type === 'success' ? 'bg-[#80FF56]/10 text-[#80FF56] border-[#80FF56]/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`} style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
              {status.type === 'success' ? <CheckCircle2 className="shrink-0 text-[#80FF56] mt-0.5" size={16} /> : <AlertCircle className="shrink-0 text-red-400 mt-0.5" size={16} />}
              <p>{status.msg}</p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-slate-200 dark:bg-[#090A0F] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#7F56FF] transition-colors font-mono appearance-none"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">Kata Sandi (NIM)</label>
                <input
                  type="text"
                  value={editNim}
                  onChange={(e) => setEditNim(e.target.value)}
                  className="w-full p-3 bg-slate-200 dark:bg-[#090A0F] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#7F56FF] transition-colors font-mono appearance-none"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                  placeholder="NIM / Kata Sandi"
                  required
                />
                <p className="text-[10px] font-bold text-red-400 mt-2 uppercase tracking-widest">PERINGATAN: Mengubah Sandi (NIM) akan me-reset QR Code Anda.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-[#7F56FF] text-slate-900 dark:text-white font-bold py-3 px-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(127,86,255,0.3)] disabled:opacity-50 text-xs tracking-widest uppercase"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                >
                  <Save size={16} className={isLoading ? "animate-spin" : ""} />
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(member.name);
                    setEditNim(member.nim);
                    setStatus(null);
                  }}
                  className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-[#1A1C23] hover:bg-[#252836] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 transition-colors w-full sm:w-auto text-xs tracking-widest uppercase"
                  style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                >
                  <X size={16} />
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-200 dark:bg-[#090A0F] border border-slate-200 dark:border-slate-800 p-4" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Nama Lengkap</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</p>
              </div>
              <div className="bg-slate-200 dark:bg-[#090A0F] border border-slate-200 dark:border-slate-800 p-4" style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Kata Sandi (NIM)</p>
                <p className="font-mono font-bold text-slate-900 dark:text-white tracking-[0.3em] text-sm">••••••••</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
