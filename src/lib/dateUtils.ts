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

  const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });
  const dateNum = date.getDate().toString().padStart(2, "0");
  const monthName = date.toLocaleDateString("id-ID", { month: "long" });
  const monthShort = date.toLocaleDateString("id-ID", { month: "short" });
  const yearNum = date.getFullYear().toString();

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
  const date = new Date(KKN_START_DATE);
  date.setDate(date.getDate() + (dayNum - 1));
  return getIndonesianDateDetails(date);
}
