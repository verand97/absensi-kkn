/**
 * Utility to format dates with Hari (Day), Tanggal (Date number), Bulan (Month), and Tahun (Year) in Indonesian locale.
 * Tanggal Mulai Absensi KKN: 27 Juli 2026
 */

export interface IndonesianDateInfo {
  dayName: string;    // Hari (e.g. Senin)
  dateNum: string;    // Tanggal (e.g. 27)
  monthName: string;  // Bulan (e.g. Juli)
  monthShort: string; // Bulan pendek (e.g. Jul)
  yearNum: string;    // Tahun (e.g. 2026)
  fullFormatted: string;  // e.g. "Senin, 27 Juli 2026"
  shortFormatted: string; // e.g. "Sen, 27 Jul 2026"
}

// Tanggal awal dimulainya absensi KKN: 27 Juli 2026 (Month index 6 = Juli)
export const KKN_START_DATE = new Date(2026, 6, 27);

/**
 * Helper to extract WIB (Asia/Jakarta, UTC+7) date components.
 */
export function getWibDateComponents(targetDate?: Date | string | number | null) {
  const now = targetDate ? new Date(targetDate) : new Date();
  const validDate = isNaN(now.getTime()) ? new Date() : now;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(validDate);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = parseInt(part.value, 10);
    }
  }

  return {
    year: map.year,
    month: map.month - 1, // 0-indexed month
    day: map.day,
    hour: map.hour === 24 ? 0 : map.hour,
    minute: map.minute,
    second: map.second,
  };
}

export function getIndonesianDateDetails(dateInput?: Date | string | number | null): IndonesianDateInfo {
  const date = dateInput ? new Date(dateInput) : new Date();

  if (isNaN(date.getTime())) {
    return {
      dayName: "-",
      dateNum: "-",
      monthName: "-",
      monthShort: "-",
      yearNum: "-",
      fullFormatted: "-",
      shortFormatted: "-"
    };
  }

  const dayName = date.toLocaleDateString("id-ID", { weekday: "long", timeZone: "Asia/Jakarta" });
  const dateNum = date.toLocaleDateString("id-ID", { day: "2-digit", timeZone: "Asia/Jakarta" });
  const monthName = date.toLocaleDateString("id-ID", { month: "long", timeZone: "Asia/Jakarta" });
  const monthShort = date.toLocaleDateString("id-ID", { month: "short", timeZone: "Asia/Jakarta" });
  const yearNum = date.toLocaleDateString("id-ID", { year: "numeric", timeZone: "Asia/Jakarta" });

  return {
    dayName,
    dateNum,
    monthName,
    monthShort,
    yearNum,
    fullFormatted: `${dayName}, ${dateNum} ${monthName} ${yearNum}`,
    shortFormatted: `${dayName.slice(0, 3)}, ${dateNum} ${monthShort} ${yearNum}`
  };
}

export function getTodayIndonesianDate(): IndonesianDateInfo {
  return getIndonesianDateDetails(new Date());
}

/**
 * Menghitung tanggal resmi KKN untuk Hari Ke-N berdasarkan tanggal mulai (27 Juli 2026).
 */
export function getScheduledDateForDay(dayNum: number): IndonesianDateInfo {
  const date = new Date(2026, 6, 27);
  date.setDate(date.getDate() + (dayNum - 1));
  return getIndonesianDateDetails(date);
}

/**
 * Menghitung Hari Ke-N KKN berdasarkan tanggal hari ini secara otomatis dalam WIB (dimulai 27 Juli 2026 = Hari 1).
 */
export function getCurrentDayFromStartDate(targetDate?: Date): number {
  const wib = getWibDateComponents(targetDate);

  const startMidnight = Date.UTC(2026, 6, 27);
  const targetMidnight = Date.UTC(wib.year, wib.month, wib.day);

  const diffTime = targetMidnight - startMidnight;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.min(Math.max(diffDays, 1), 40);
}
