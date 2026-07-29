import * as XLSX from "xlsx";

export interface MemberDataForExport {
  id: string;
  name: string;
  nim?: string;
  isAdmin?: boolean;
  attendances: { day: number }[];
}

export function exportToXLSX(members: MemberDataForExport[], totalDays: number = 40) {
  const headers = [
    "No",
    "NIM",
    "Nama Lengkap",
    "Role",
    "Total Hadir",
    "Persentase Kehadiran",
    ...Array.from({ length: totalDays }, (_, i) => `H${i + 1}`),
  ];

  const rows = members.map((member, index) => {
    const presentSet = new Set(member.attendances.map((a) => a.day));
    const totalPresent = presentSet.size;
    const percentage = `${((totalPresent / totalDays) * 100).toFixed(1)}%`;
    const role = member.isAdmin ? "Admin" : "Anggota";

    const dayStatuses = Array.from({ length: totalDays }, (_, i) =>
      presentSet.has(i + 1) ? "Hadir" : "Tidak Hadir"
    );

    return [
      index + 1,
      member.nim || "-",
      member.name,
      role,
      totalPresent,
      percentage,
      ...dayStatuses,
    ];
  });

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto column widths
  const colWidths = [
    { wch: 6 },   // No
    { wch: 18 },  // NIM
    { wch: 28 },  // Nama
    { wch: 12 },  // Role
    { wch: 14 },  // Total Hadir
    { wch: 20 },  // Persentase Kehadiran
    ...Array.from({ length: totalDays }, () => ({ wch: 11 })),
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Kehadiran");

  XLSX.writeFile(workbook, `Rekap_Absensi_KKN_Sumanding_2026.xlsx`);
}

export function exportToCSV(members: MemberDataForExport[], totalDays: number = 40) {
  const headers = [
    "No",
    "NIM",
    "Nama Lengkap",
    "Role",
    "Total Hadir",
    "Persentase Kehadiran",
    ...Array.from({ length: totalDays }, (_, i) => `H${i + 1}`),
  ];

  const escapeCSV = (val: string | number) => {
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = members.map((member, index) => {
    const presentSet = new Set(member.attendances.map((a) => a.day));
    const totalPresent = presentSet.size;
    const percentage = `${((totalPresent / totalDays) * 100).toFixed(1)}%`;
    const role = member.isAdmin ? "Admin" : "Anggota";

    const dayStatuses = Array.from({ length: totalDays }, (_, i) =>
      presentSet.has(i + 1) ? "Hadir" : "Tidak Hadir"
    );

    const row = [
      index + 1,
      member.nim || "-",
      member.name,
      role,
      totalPresent,
      percentage,
      ...dayStatuses,
    ];

    return row.map(escapeCSV).join(",");
  });

  // Adding UTF-8 BOM (\uFEFF) to ensure Microsoft Excel opens UTF-8 encoded CSV files correctly
  const csvContent = "\uFEFF" + [headers.map(escapeCSV).join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Rekap_Absensi_KKN_Sumanding_2026.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
