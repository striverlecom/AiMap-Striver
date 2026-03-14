const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const filePath = path.resolve('../1 Kiem_Toan_AI_7Ngay_Workbook (1) (2).xlsx');
const workbook = xlsx.readFile(filePath);

const sheetName = workbook.SheetNames.find(s => s.includes('Báo cáo') || s.includes('7.'));
if (!sheetName) {
  console.log('Sheet not found');
} else {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, {header: 1});
  data.forEach((row, i) => {
    const clean = row.filter(cell => cell !== undefined && cell !== null && cell !== '');
    if (clean.length > 0) {
      console.log(`Row ${i}: `, clean);
    }
  });
}
