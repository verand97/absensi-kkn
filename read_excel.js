const xlsx = require('xlsx');
const fs = require('fs');

try {
  const workbook = xlsx.readFile('Absensi_Kehadiran_40_Hari.xlsx');
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  fs.writeFileSync('parsed_data.json', JSON.stringify(data, null, 2));
  console.log('Parsed data successfully');
} catch (error) {
  console.error('Error parsing xlsx:', error);
}
