"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import {
  Film,
  Camera,
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Plus,
  Eye,
  Info,
} from "lucide-react";

export interface MemoryPhotoItem {
  id: string;
  src: string;
  caption: string;
  week: number;
  tall: boolean;
  order?: number;
  createdAt?: string;
}

const WEEK_NAMES: Record<number, string> = {
  1: "Minggu 1 — Kedatangan & Orientasi",
  2: "Minggu 2 — Program Kerja Dimulai",
  3: "Minggu 3 — Kegiatan Inti",
  4: "Minggu 4 — Bakti Sosial",
  5: "Minggu 5 — Menuju Penutupan",
  6: "Penutupan — Perpisahan",
};

export default function MemoriesManager() {
  // Video state
  const [videoInput, setVideoInput] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Photos state
  const [photos, setPhotos] = useState<MemoryPhotoItem[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [filterWeek, setFilterWeek] = useState<number | null>(null);

  // Form state
  const [photoSourceType, setPhotoSourceType] = useState<"upload" | "url">("upload");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [captionInput, setCaptionInput] = useState("");
  const [weekInput, setWeekInput] = useState<number>(1);
  const [isTallInput, setIsTallInput] = useState<boolean>(false);
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [photoStatus, setPhotoStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial data without triggering synchronous setState in effect
  useEffect(() => {
    let isMounted = true;
    fetch("/api/memories")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.videoId) {
          setCurrentVideoId(data.videoId);
          setVideoInput(`https://www.youtube.com/watch?v=${data.videoId}`);
        }
        if (Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data kenangan:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingPhotos(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual refresh handler for user interaction
  const refreshMemories = async () => {
    try {
      setLoadingPhotos(true);
      const res = await fetch("/api/memories");
      const data = await res.json();
      if (res.ok) {
        if (data.videoId) {
          setCurrentVideoId(data.videoId);
          setVideoInput(`https://www.youtube.com/watch?v=${data.videoId}`);
        }
        if (Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data kenangan:", err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  // Save video ID
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVideo(true);
    setVideoStatus(null);

    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_video",
          videoId: videoInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentVideoId(data.videoId);
        setVideoStatus({ type: "success", text: "Link video YouTube berhasil disimpan!" });
      } else {
        setVideoStatus({ type: "error", text: data.error || "Gagal menyimpan video" });
      }
    } catch {
      setVideoStatus({ type: "error", text: "Kesalahan jaringan saat menyimpan video" });
    } finally {
      setSavingVideo(false);
    }
  };

  // Convert uploaded image file to compressed Base64 Data URL
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB raw)
    if (file.size > 10 * 1024 * 1024) {
      setPhotoStatus({ type: "error", text: "Ukuran file terlalu besar (maksimal 10MB)" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress using HTML5 canvas to max 1400px width/height for fast DB saving & loading
        const canvas = document.createElement("canvas");
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          setPreviewSrc(compressedDataUrl);

          // Auto detect orientation (if height > width, set as tall/portrait)
          if (height > width) {
            setIsTallInput(true);
          } else {
            setIsTallInput(false);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle URL change
  const handleUrlChange = (url: string) => {
    setImageUrlInput(url);
    setPreviewSrc(url.trim());
  };

  // Add photo
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = photoSourceType === "upload" ? previewSrc : imageUrlInput.trim();

    if (!finalSrc) {
      setPhotoStatus({ type: "error", text: "Pilih file foto atau masukkan link gambar terlebih dahulu" });
      return;
    }

    if (!captionInput.trim()) {
      setPhotoStatus({ type: "error", text: "Keterangan/caption foto wajib diisi" });
      return;
    }

    setAddingPhoto(true);
    setPhotoStatus(null);

    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_photo",
          src: finalSrc,
          caption: captionInput.trim(),
          week: weekInput,
          tall: isTallInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPhotoStatus({ type: "success", text: "Foto kenangan berhasil ditambahkan ke galeri!" });
        setPhotos((prev) => [...prev, data.photo]);
        // Reset form
        setPreviewSrc("");
        setImageUrlInput("");
        setCaptionInput("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setPhotoStatus({ type: "error", text: data.error || "Gagal menambahkan foto" });
      }
    } catch {
      setPhotoStatus({ type: "error", text: "Kesalahan koneksi saat menambahkan foto" });
    } finally {
      setAddingPhoto(false);
    }
  };

  // Delete photo
  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto kenangan ini?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/memories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Gagal menghapus foto");
      }
    } catch {
      alert("Kesalahan koneksi saat menghapus foto");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPhotos = filterWeek
    ? photos.filter((p) => p.week === filterWeek)
    : photos;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner info */}
      <div
        className="p-px bg-slate-200 dark:bg-forest-700 shadow-md"
        style={{ clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)" }}
      >
        <div
          className="bg-white dark:bg-forest-800 p-5 md:p-6"
          style={{ clipPath: "polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sprout-400/15 border border-sprout-400/30 flex items-center justify-center shrink-0">
                <Sparkles className="text-sprout-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white">
                  Kelola Kenangan KKN XXI Sumanding
                </h2>
                <p className="text-xs text-slate-600 dark:text-mist-400">
                  Foto dan video yang Anda simpan di sini akan langsung tampil pada website kenangan setelah countdown selesai.
                </p>
              </div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-forest-700 hover:bg-slate-200 dark:hover:bg-forest-600 border border-slate-300 dark:border-forest-600 text-slate-700 dark:text-mist-200 text-xs font-bold tracking-widest uppercase transition-colors"
              style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
            >
              <Eye size={14} className="text-sprout-400" />
              <span>Lihat Web</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: VIDEO YOUTUBE HIGHLIGHT
      ========================================================= */}
      <div
        className="p-px bg-slate-200 dark:bg-forest-700 shadow-xl"
        style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
      >
        <div
          className="bg-white dark:bg-forest-800 p-6 md:p-8"
          style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
        >
          <div className="flex items-center gap-2 text-sprout-400 mb-2">
            <Film size={18} />
            <span className="text-xs font-bold tracking-widest uppercase font-display">
              1. Video Highlight 5 Menit
            </span>
          </div>
          <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white mb-2">
            Link Video YouTube
          </h3>
          <p className="text-xs text-slate-600 dark:text-mist-400 mb-6">
            Masukkan link video YouTube Anda. Sistem akan otomatis mendeteksi ID videonya.
          </p>

          <form onSubmit={handleSaveVideo} className="space-y-4 max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau dQw4w9WgXcQ"
                  className="w-full p-3.5 bg-slate-100 dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-slate-900 dark:text-white focus:outline-none focus:border-pine-500 transition-colors font-mono text-xs"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                />
              </div>
              <button
                type="submit"
                disabled={savingVideo}
                className="px-6 py-3.5 bg-pine-600 hover:bg-pine-500 disabled:opacity-50 text-white font-bold tracking-widest uppercase text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
              >
                {savingVideo ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                <span>{savingVideo ? "Menyimpan..." : "Simpan Video"}</span>
              </button>
            </div>

            {videoStatus && (
              <div
                className={`p-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                  videoStatus.type === "success"
                    ? "bg-sprout-400/15 border border-sprout-400/40 text-sprout-400"
                    : "bg-rose-500/15 border border-rose-500/40 text-rose-400"
                }`}
              >
                {videoStatus.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{videoStatus.text}</span>
              </div>
            )}
          </form>

          {/* Video Preview */}
          {currentVideoId ? (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-forest-700">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-mist-500 block mb-2">
                Preview Video yang Aktif (ID: {currentVideoId}):
              </span>
              <div className="relative w-full max-w-xl aspect-video bg-forest-900 border border-forest-700 overflow-hidden shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideoId}?rel=0`}
                  title="Preview Video Highlight KKN"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-amber-400/10 border border-amber-400/30 text-amber-500 dark:text-amber-400 text-xs flex items-center gap-2">
              <Info size={14} />
              <span>Belum ada link video YouTube yang disimpan. Video masih menggunakan placeholder default.</span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          SECTION 2: TAMBAH FOTO KENANGAN (20-30 FOTO)
      ========================================================= */}
      <div
        className="p-px bg-slate-200 dark:bg-forest-700 shadow-xl"
        style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
      >
        <div
          className="bg-white dark:bg-forest-800 p-6 md:p-8"
          style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
        >
          <div className="flex items-center gap-2 text-sprout-400 mb-2">
            <Camera size={18} />
            <span className="text-xs font-bold tracking-widest uppercase font-display">
              2. Form Tambah Foto Kenangan
            </span>
          </div>
          <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white mb-2">
            Unggah / Tambahkan Foto Baru
          </h3>
          <p className="text-xs text-slate-600 dark:text-mist-400 mb-6">
            Bisa langsung upload file foto dari HP/laptop Anda, atau memasukkan link URL gambar.
          </p>

          <form onSubmit={handleAddPhoto} className="space-y-6">
            {/* Source Type Selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhotoSourceType("upload")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                  photoSourceType === "upload"
                    ? "bg-pine-600 text-white border-pine-500 shadow-md"
                    : "bg-slate-100 dark:bg-forest-900 text-slate-600 dark:text-mist-400 border-slate-300 dark:border-forest-700"
                }`}
                style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
              >
                <Upload size={14} /> Upload dari File
              </button>
              <button
                type="button"
                onClick={() => setPhotoSourceType("url")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                  photoSourceType === "url"
                    ? "bg-pine-600 text-white border-pine-500 shadow-md"
                    : "bg-slate-100 dark:bg-forest-900 text-slate-600 dark:text-mist-400 border-slate-300 dark:border-forest-700"
                }`}
                style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
              >
                <LinkIcon size={14} /> Masukkan Link URL
              </button>
            </div>

            {/* Input by Source Type */}
            {photoSourceType === "upload" ? (
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-mist-500 uppercase tracking-widest mb-2">
                  Pilih Foto dari Galeri / File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-slate-100 dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-slate-900 dark:text-white font-mono text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-pine-600 file:text-white hover:file:bg-pine-500 cursor-pointer"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                />
                <span className="text-[10px] text-slate-500 dark:text-mist-500 mt-1 block">
                  Format gambar JPG, PNG, WEBP. Gambar otomatis dikompres secara optimal untuk tampilan website.
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-mist-500 uppercase tracking-widest mb-2">
                  URL / Link Gambar Langsung
                </label>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau https://i.imgur.com/..."
                  className="w-full p-3.5 bg-slate-100 dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-pine-500"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                />
              </div>
            )}

            {/* Photo Preview if available */}
            {previewSrc && (
              <div className="p-3 bg-slate-100 dark:bg-forest-900 border border-slate-300 dark:border-forest-700 flex items-center gap-4">
                <div className="relative w-24 h-24 shrink-0 bg-slate-200 dark:bg-forest-800 border border-pine-500/40 overflow-hidden">
                  <Image src={previewSrc} alt="Preview" fill unoptimized className="object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    Preview Foto Terpilih
                  </span>
                  <span className="text-[10px] font-mono text-sprout-400 block">
                    Orientasi: {isTallInput ? "Portrait (Tegak)" : "Landscape (Mendatar)"}
                  </span>
                </div>
              </div>
            )}

            {/* Caption & Category Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-mist-500 uppercase tracking-widest mb-2">
                  Keterangan / Caption Foto *
                </label>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Contoh: Kerja Bakti Bersama Warga Dusun 2"
                  required
                  className="w-full p-3.5 bg-slate-100 dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-pine-500"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-mist-500 uppercase tracking-widest mb-2">
                  Kategori Minggu Kegiatan
                </label>
                <select
                  value={weekInput}
                  onChange={(e) => setWeekInput(Number(e.target.value))}
                  className="w-full p-3.5 bg-slate-100 dark:bg-forest-900 border border-slate-300 dark:border-forest-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-pine-500 font-sans"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  <option value={1}>Minggu 1 — Kedatangan & Orientasi</option>
                  <option value={2}>Minggu 2 — Program Kerja Dimulai</option>
                  <option value={3}>Minggu 3 — Kegiatan Inti</option>
                  <option value={4}>Minggu 4 — Bakti Sosial</option>
                  <option value={5}>Minggu 5 — Menuju Penutupan</option>
                  <option value={6}>Penutupan — Perpisahan</option>
                </select>
              </div>
            </div>

            {/* Orientation choice */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-600 dark:text-mist-500 uppercase tracking-widest">
                Orientasi Tampilan:
              </span>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-800 dark:text-mist-200">
                <input
                  type="radio"
                  name="orientation"
                  checked={!isTallInput}
                  onChange={() => setIsTallInput(false)}
                  className="accent-sprout-400"
                />
                <span>Landscape (Mendatar)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-800 dark:text-mist-200">
                <input
                  type="radio"
                  name="orientation"
                  checked={isTallInput}
                  onChange={() => setIsTallInput(true)}
                  className="accent-sprout-400"
                />
                <span>Portrait (Tegak)</span>
              </label>
            </div>

            {/* Status notification */}
            {photoStatus && (
              <div
                className={`p-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                  photoStatus.type === "success"
                    ? "bg-sprout-400/15 border border-sprout-400/40 text-sprout-400"
                    : "bg-rose-500/15 border border-rose-500/40 text-rose-400"
                }`}
              >
                {photoStatus.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{photoStatus.text}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={addingPhoto}
              className="px-8 py-3.5 bg-linear-to-r from-pine-600 to-sprout-500 hover:from-pine-500 hover:to-sprout-400 disabled:opacity-50 text-slate-950 font-black tracking-widest uppercase text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
            >
              {addingPhoto ? <RefreshCw className="animate-spin" size={16} /> : <Plus size={16} />}
              <span>{addingPhoto ? "Menyimpan ke Galeri..." : "Tambahkan ke Galeri Kenangan"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================
          SECTION 3: DAFTAR FOTO YANG SUDAH TERSIMPAN DI DATABASE
      ========================================================= */}
      <div
        className="p-px bg-slate-200 dark:bg-forest-700 shadow-xl"
        style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
      >
        <div
          className="bg-white dark:bg-forest-800 p-6 md:p-8"
          style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-forest-700">
            <div>
              <div className="flex items-center gap-2 text-sprout-400 mb-1">
                <Camera size={18} />
                <span className="text-xs font-bold tracking-widest uppercase font-display">
                  3. Galeri Foto Tersimpan di Sistem
                </span>
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white">
                Daftar Foto ({photos.length} Foto)
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-sprout-400 bg-sprout-400/10 px-3 py-1 border border-sprout-400/30">
                Rekomendasi: 20–30 Foto
              </span>
              <button
                type="button"
                onClick={refreshMemories}
                title="Refresh Daftar Foto"
                className="p-2 bg-slate-100 dark:bg-forest-700 hover:bg-slate-200 dark:hover:bg-forest-600 text-slate-700 dark:text-mist-200 border border-slate-300 dark:border-forest-600 transition-colors"
              >
                <RefreshCw size={14} className={loadingPhotos ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Week Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterWeek(null)}
              className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border transition-colors cursor-pointer ${
                filterWeek === null
                  ? "bg-sprout-400 text-forest-900 border-sprout-400"
                  : "bg-transparent text-slate-600 dark:text-mist-400 border-slate-300 dark:border-forest-600"
              }`}
            >
              Semua ({photos.length})
            </button>
            {[1, 2, 3, 4, 5, 6].map((w) => {
              const count = photos.filter((p) => p.week === w).length;
              return (
                <button
                  key={w}
                  onClick={() => setFilterWeek(w)}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border transition-colors cursor-pointer ${
                    filterWeek === w
                      ? "bg-sprout-400 text-forest-900 border-sprout-400"
                      : "bg-transparent text-slate-600 dark:text-mist-400 border-slate-300 dark:border-forest-600"
                  }`}
                >
                  Minggu {w} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid of uploaded photos */}
          {loadingPhotos ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500 dark:text-mist-500 flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={16} />
              <span>Memuat galeri kenangan...</span>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-forest-700 p-8">
              <Camera className="mx-auto text-slate-400 dark:text-mist-600 mb-3" size={36} />
              <p className="text-xs font-bold text-slate-700 dark:text-mist-300 uppercase tracking-wider mb-1">
                {photos.length === 0
                  ? "Belum ada foto yang diunggah ke database"
                  : "Tidak ada foto di minggu ini"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-mist-500 max-w-sm mx-auto">
                {photos.length === 0
                  ? "Tambahkan foto kenangan pertama Anda menggunakan form di atas. Ketika belum ada foto di database, web kenangan otomatis menggunakan set foto default."
                  : "Gunakan tombol filter 'Semua' untuk melihat seluruh foto yang tersimpan."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative bg-slate-100 dark:bg-forest-900 border border-slate-200 dark:border-forest-700 flex flex-col justify-between overflow-hidden shadow-sm hover:border-sprout-400/50 transition-all"
                  style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                >
                  {/* Image container */}
                  <div className={`relative w-full ${photo.tall ? "aspect-3/4" : "aspect-4/3"} bg-slate-200 dark:bg-forest-950 overflow-hidden`}>
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-forest-950/80 px-1.5 py-0.5 text-[8px] font-mono font-bold text-sprout-400">
                      #{index + 1}
                    </div>
                    <div
                      className="absolute top-1.5 right-1.5 bg-forest-950/80 px-1.5 py-0.5 text-[8px] font-bold uppercase text-mist-300"
                      title={WEEK_NAMES[photo.week] || `Minggu ${photo.week}`}
                    >
                      M-{photo.week}
                    </div>
                  </div>

                  {/* Caption & Actions */}
                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <p className="text-[11px] font-medium text-slate-800 dark:text-mist-200 line-clamp-2 mb-2" title={photo.caption}>
                      {photo.caption}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-forest-700/60 mt-auto">
                      <span className="text-[8px] font-mono text-slate-400 dark:text-mist-500">
                        {photo.tall ? "Portrait" : "Landscape"}
                      </span>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        disabled={deletingId === photo.id}
                        title="Hapus foto ini"
                        className="text-rose-400 hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300 p-1 transition-colors cursor-pointer"
                      >
                        {deletingId === photo.id ? (
                          <RefreshCw size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
