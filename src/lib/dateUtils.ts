/**
 * Utility to format dates with Hari (Day), Tanggal (Date number), Bulan (Month), and Tahun (Year) in Indonesian locale.
 */

export interface IndonesianDateInfo {
  dayName: string;    // Hari (e.g. Senin)
  dateNum: string;    // Tanggal (e.g. 10)
  monthName: string;  // Bulan (e.g. Agustus)
  monthShort: string; // Bulan pendek (e.g. Agt)
  yearNum: string;    // Tahun (e.g. 2026)
  fullFormatted: string;  // e.g. "Senin, 10 Agustus 2026"
  shortFormatted: string; // e.g. "Sen, 10 Agt 2026"
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
