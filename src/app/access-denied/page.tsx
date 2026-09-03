import Link from "next/link";
import Image from "next/image";
import { ShieldX, ArrowLeft, Lock } from "lucide-react";
import { logout } from "@/lib/auth";

export const metadata = {
  title: "Akses Ditolak — KKN Sumanding 2026",
  description: "Anda tidak memiliki akses ke sistem absensi KKN Sumanding 2026.",
};

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-forest-900 text-mist-200 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pine-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(143,227,152,1)_1px,transparent_1px),linear-gradient(90deg,rgba(143,227,152,1)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center justify-center mb-8 group">
          <Image
            src="/newlogokkn.png"
            alt="Logo KKN Sumanding 2026"
            width={64}
            height={64}
            className="object-contain opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(143,227,152,0.2)]"
          />
        </Link>

        {/* Card */}
        <div
          className="p-px bg-rose-500/30 shadow-2xl"
          style={{
            clipPath:
              "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
          }}
        >
          <div
            className="bg-forest-800 p-8 sm:p-10"
            style={{
              clipPath:
                "polygon(17px 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%, 0 17px)",
            }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <ShieldX size={32} className="text-rose-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-forest-800 border border-rose-500/30 flex items-center justify-center">
                  <Lock size={10} className="text-rose-400" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold tracking-widest uppercase mb-5">
              <span>Akses Ditolak</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              Sistem Absensi
              <br />
              <span className="text-rose-400">Ditutup.</span>
            </h1>

            {/* Message */}
            <p className="text-mist-500 text-sm leading-relaxed mb-8">
              Sistem absensi KKN Sumanding 2026 ini hanya dapat diakses oleh{" "}
              <span className="text-mist-300 font-semibold">
                Muhammad Verri Andika Pratama
              </span>{" "}
              selaku penanggung jawab sistem.
            </p>

            {/* Divider */}
            <div className="h-px bg-forest-700 mb-8" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Kembali ke Kenang-kenangan */}
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-forest-600 text-mist-400 hover:border-sprout-400/50 hover:text-mist-200 transition-all text-xs font-bold tracking-widest uppercase"
                style={{
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                <ArrowLeft size={14} />
                Halaman Utama
              </Link>

              {/* Logout */}
              <form
                action={async () => {
                  "use server";
                  await logout();
                }}
                className="flex-1"
              >
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-bold tracking-widest uppercase cursor-pointer"
                  style={{
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <ShieldX size={14} />
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-[10px] font-mono text-mist-600">
          KKN Sumanding 2026 · Sistem Absensi Eksklusif
        </p>
      </div>
    </div>
  );
}
