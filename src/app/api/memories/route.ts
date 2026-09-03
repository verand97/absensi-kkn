import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Reference to prisma client that bypasses IDE in-memory type caching
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = prisma;

// Helper untuk mengekstrak Video ID YouTube dari berbagai jenis link
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const clean = urlOrId.trim();

  // Pola URL YouTube umum
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/
  );
  if (match && match[1]) {
    return match[1];
  }

  // Jika user memasukkan langsung 11 karakter ID YouTube
  if (/^[\w-]{11}$/.test(clean)) {
    return clean;
  }

  return clean;
}

// GET: Ambil video ID & seluruh foto kenangan
export async function GET() {
  try {
    const setting = await db.setting.findUnique({
      where: { id: "global" },
      select: { youtubeVideoId: true },
    });

    const photos = await db.memoryPhoto.findMany({
      orderBy: [
        { week: "asc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      videoId: setting?.youtubeVideoId || "",
      photos: photos || [],
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kenangan" },
      { status: 500 }
    );
  }
}

// POST: Tambah foto, update foto, atau update video
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Harus login terlebih dahulu" }, { status: 401 });
    }

    const userName = session.user.name;
    const isAdmin = session.user.isAdmin;
    const isVerri = userName === "Muhammad Verri Andika Pratama";

    if (!isAdmin && !isVerri) {
      return NextResponse.json(
        { error: "Hanya Verri / Admin yang dapat mengelola kenangan" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;

    // Aksi 1: Update Link Video YouTube
    if (action === "update_video") {
      const rawVideo = body.videoId || "";
      const videoId = extractYouTubeId(rawVideo);

      const updatedSetting = await db.setting.upsert({
        where: { id: "global" },
        update: { youtubeVideoId: videoId },
        create: {
          id: "global",
          youtubeVideoId: videoId,
          isActive: false,
          currentDay: 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Link video berhasil disimpan",
        videoId: updatedSetting.youtubeVideoId,
      });
    }

    // Aksi 2: Tambah Foto Baru
    if (action === "add_photo") {
      const { src, caption, week = 1, tall = false, order = 0 } = body;

      if (!src || !src.trim()) {
        return NextResponse.json(
          { error: "Foto atau link gambar wajib diisi" },
          { status: 400 }
        );
      }

      const photo = await db.memoryPhoto.create({
        data: {
          src: src.trim(),
          caption: (caption || "Momen KKN Sumanding").trim(),
          week: Math.min(Math.max(Number(week) || 1, 1), 6),
          tall: Boolean(tall),
          order: Number(order) || 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Foto berhasil ditambahkan",
        photo,
      });
    }

    // Aksi 3: Update Foto yang Sudah Ada
    if (action === "update_photo") {
      const { id, caption, week, tall, order } = body;

      if (!id) {
        return NextResponse.json({ error: "ID foto diperlukan" }, { status: 400 });
      }

      const updated = await db.memoryPhoto.update({
        where: { id },
        data: {
          ...(caption !== undefined && { caption: String(caption).trim() }),
          ...(week !== undefined && { week: Math.min(Math.max(Number(week), 1), 6) }),
          ...(tall !== undefined && { tall: Boolean(tall) }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Foto berhasil diperbarui",
        photo: updated,
      });
    }

    // Aksi 4: Hapus Foto
    if (action === "delete_photo") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "ID foto diperlukan" }, { status: 400 });
      }

      await db.memoryPhoto.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Foto berhasil dihapus",
      });
    }

    return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Error updating memories:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses data" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus foto lewat query parameter ?id=...
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Harus login terlebih dahulu" }, { status: 401 });
    }

    const isVerri = session.user.name === "Muhammad Verri Andika Pratama";
    if (!session.user.isAdmin && !isVerri) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parameter ID diperlukan" }, { status: 400 });
    }

    await db.memoryPhoto.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Foto berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}
