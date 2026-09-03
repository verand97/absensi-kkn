import { prisma } from "@/lib/prisma";
import { getTodayIndonesianDate, getCurrentDayFromStartDate } from "@/lib/dateUtils";
import HomePageClient from "@/components/HomePageClient";
import MemoriesPage from "@/components/MemoriesPage";

export const dynamic = 'force-dynamic';

// Target date harus sama dengan HomePageClient & CountdownTimer
const TARGET_DATE = "2026-09-04T23:59:59+07:00";

export default async function Home() {
  // Server-side: cek apakah countdown sudah selesai
  const isCountdownFinished = new Date().getTime() >= new Date(TARGET_DATE).getTime();

  // Jika sudah selesai, langsung tampilkan halaman kenang-kenangan
  if (isCountdownFinished) {
    return <MemoriesPage />;
  }

  // Jika belum, fetch data untuk tampilan absensi
  const totalMembers = await prisma.member.count();
  const autoDay = getCurrentDayFromStartDate();
  let setting = await prisma.setting.findUnique({ where: { id: "global" } });

  if (!setting) {
    setting = await prisma.setting.create({
      data: { id: "global", startTime: "07:00", endTime: "09:00", isActive: false, currentDay: autoDay }
    });
  } else if (setting.currentDay !== autoDay) {
    setting = await prisma.setting.update({
      where: { id: "global" },
      data: { currentDay: autoDay, isActive: false }
    });
  }

  const currentDay = setting.currentDay;
  const todayInfo = getTodayIndonesianDate();
  const progressPercent = Math.min(Math.round((currentDay / 40) * 100), 100);

  return (
    <HomePageClient
      totalMembers={totalMembers}
      currentDay={currentDay}
      progressPercent={progressPercent}
      isActive={setting.isActive}
      todayFullFormatted={todayInfo.fullFormatted}
      todayDayName={todayInfo.dayName}
    />
  );
}