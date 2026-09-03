import { getScheduledDateForDay } from "./dateUtils";

export interface MemberDataForExport {
  id: string;
  name: string;
  nim?: string;
  isAdmin?: boolean;
  attendances: { day: number }[];
}

export function exportToXLSX(members: MemberDataForExport[], totalDays: number = 40) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dailyTotals = Array.from({ length: totalDays }, () => 0);

  let rowsHtml = "";
  members.forEach((member, index) => {
    const presentSet = new Set(member.attendances.map((a) => a.day));
    const totalPresent = presentSet.size;
    const percentage = `${((totalPresent / totalDays) * 100).toFixed(1)}%`;
    const role = member.isAdmin ? "Admin" : "Anggota";

    let daysHtml = "";
    for (let i = 1; i <= totalDays; i++) {
      if (presentSet.has(i)) {
        dailyTotals[i - 1]++;
        daysHtml += `<td style="background-color: #DCFCE7; color: #15803D; text-align: center; font-weight: bold; border: 1px solid #CBD5E1;">✓</td>`;
      } else {
        daysHtml += `<td style="background-color: #F8FAFC; color: #94A3B8; text-align: center; border: 1px solid #CBD5E1;">-</td>`;
      }
    }

    rowsHtml += `
      <tr>
        <td style="text-align: center; border: 1px solid #CBD5E1; background-color: #FFFFFF;">${index + 1}</td>
        <td style="text-align: left; font-family: monospace; border: 1px solid #CBD5E1; background-color: #FFFFFF;">'${member.nim || "-"}</td>
        <td style="text-align: left; font-weight: bold; border: 1px solid #CBD5E1; background-color: #FFFFFF;">${member.name}</td>
        <td style="text-align: center; border: 1px solid #CBD5E1; background-color: #FFFFFF;">${role}</td>
        <td style="text-align: center; font-weight: bold; color: #15803D; border: 1px solid #CBD5E1; background-color: #F0FDF4;">${totalPresent}</td>
        <td style="text-align: center; font-weight: bold; border: 1px solid #CBD5E1; background-color: #FFFFFF;">${percentage}</td>
        ${daysHtml}
      </tr>
    `;
  });

  let dayHeaderHtml = "";
  for (let i = 1; i <= totalDays; i++) {
    const d = getScheduledDateForDay(i);
    dayHeaderHtml += `<th style="background-color: #1E293B; color: #FFFFFF; text-align: center; font-weight: bold; border: 1px solid #475569; padding: 6px; min-width: 45px;">H${i}<br/><span style="font-size: 9px; font-weight: normal;">${d.dateNum}/${d.monthShort}</span></th>`;
  }

  let totalSummaryDaysHtml = "";
  let percentageSummaryDaysHtml = "";
  for (let i = 0; i < totalDays; i++) {
    const count = dailyTotals[i];
    const pct = members.length > 0 ? `${((count / members.length) * 100).toFixed(0)}%` : "0%";
    totalSummaryDaysHtml += `<td style="text-align: center; font-weight: bold; color: #15803D; border: 1px solid #CBD5E1; background-color: #F1F5F9;">${count}</td>`;
    percentageSummaryDaysHtml += `<td style="text-align: center; font-weight: bold; border: 1px solid #CBD5E1; background-color: #F1F5F9;">${pct}</td>`;
  }

  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Rekap Kehadiran</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 6px 8px; font-size: 11px; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colSpan="${totalDays + 6}" style="font-size: 16px; font-weight: bold; text-align: center; color: #0F172A; padding: 12px 0 4px 0;">
            REKAPITULASI KEHADIRAN ANGGOTA KKN XXI SUMANDING 2026
          </td>
        </tr>
        <tr>
          <td colSpan="${totalDays + 6}" style="font-size: 11px; text-align: center; color: #475569; padding-bottom: 12px;">
            Tanggal Unduh: ${currentDate} &nbsp;|&nbsp; Total Anggota: ${members.length} Orang &nbsp;|&nbsp; Target Sesi: ${totalDays} Hari
          </td>
        </tr>
        <tr></tr>
        <thead>
          <tr>
            <th style="background-color: #1E293B; color: #FFFFFF; text-align: center; font-weight: bold; border: 1px solid #475569;">No</th>
            <th style="background-color: #1E293B; color: #FFFFFF; text-align: left; font-weight: bold; border: 1px solid #475569;">NIM</th>
            <th style="background-color: #1E293B; color: #FFFFFF; text-align: left; font-weight: bold; border: 1px solid #475569;">Nama Lengkap</th>
            <th style="background-color: #1E293B; color: #FFFFFF; text-align: center; font-weight: bold; border: 1px solid #475569;">Role</th>
            <th style="background-color: #1E293B; color: #FFFFFF; text-align: center; font-weight: bold; border: 1px solid #475569;">Total Hadir</th>
            <th style="background-color: #1E293B; color: #FFFFFF; text-align: center; font-weight: bold; border: 1px solid #475569;">Persentase</th>
            ${dayHeaderHtml}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" style="background-color: #F1F5F9; font-weight: bold; text-align: left; border: 1px solid #CBD5E1; color: #0F172A;">
              TOTAL HADIR PER HARI
            </td>
            ${totalSummaryDaysHtml}
          </tr>
          <tr>
            <td colSpan="6" style="background-color: #F1F5F9; font-weight: bold; text-align: left; border: 1px solid #CBD5E1; color: #0F172A;">
              PERSENTASE KEHADIRAN PER HARI (%)
            </td>
            ${percentageSummaryDaysHtml}
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Rekap_Absensi_KKN_Sumanding_2026.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(members: MemberDataForExport[], totalDays: number = 40) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const escapeCSV = (val: string | number) => {
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const titleRow = [`REKAPITULASI KEHADIRAN ANGGOTA KKN XXI SUMANDING 2026`];
  const infoRow = [`Tanggal Unduh: ${currentDate} | Total Anggota: ${members.length} Orang | Target Sesi: ${totalDays} Hari`];
  const emptyRow = [""];

  const headers = [
    "No",
    "NIM",
    "Nama Lengkap",
    "Role",
    "Total Hadir",
    "Persentase",
    ...Array.from({ length: totalDays }, (_, i) => {
      const d = getScheduledDateForDay(i + 1);
      return `H${i + 1} (${d.dateNum}/${d.monthShort})`;
    }),
  ];

  const dailyTotalAttendance = Array.from({ length: totalDays }, () => 0);

  const rows = members.map((member, index) => {
    const presentSet = new Set(member.attendances.map((a) => a.day));
    const totalPresent = presentSet.size;
    const percentage = `${((totalPresent / totalDays) * 100).toFixed(1)}%`;
    const role = member.isAdmin ? "Admin" : "Anggota";

    const dayStatuses = Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + 1;
      if (presentSet.has(dayNum)) {
        dailyTotalAttendance[i]++;
        return "✓";
      }
      return "-";
    });

    const row = [
      index + 1,
      member.nim ? `'${member.nim}` : "-",
      member.name,
      role,
      totalPresent,
      percentage,
      ...dayStatuses,
    ];

    return row.map(escapeCSV).join(",");
  });

  const totalSummaryRow = [
    "",
    "",
    "TOTAL HADIR PER HARI",
    "",
    "",
    "",
    ...dailyTotalAttendance,
  ].map(escapeCSV).join(",");

  const percentageSummaryRow = [
    "",
    "",
    "PERSENTASE KEHADIRAN PER HARI (%)",
    "",
    "",
    "",
    ...dailyTotalAttendance.map(count => 
      members.length > 0 ? `${((count / members.length) * 100).toFixed(0)}%` : "0%"
    ),
  ].map(escapeCSV).join(",");

  const csvLines = [
    titleRow.map(escapeCSV).join(","),
    infoRow.map(escapeCSV).join(","),
    emptyRow.join(","),
    headers.map(escapeCSV).join(","),
    ...rows,
    emptyRow.join(","),
    totalSummaryRow,
    percentageSummaryRow,
  ];

  const csvContent = "\uFEFF" + csvLines.join("\n");
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


