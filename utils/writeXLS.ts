import fs from "fs";
import XLSX from 'xlsx-style'; 

const red = "f3cccb";



interface Options {
  filePath: string;
  outPath?: string;
  sheetName?: string;
  searchColumn: string | number; // "A" or 1
  searchValue: string | number;
  fillColorRgb?: string; // "FFC000" or "FFFFC000" (RGB or AARRGGBB)
}

function letterToColumn(letter: string) {
  let col = 0;
  const s = letter.toUpperCase();
  for (let i = 0; i < s.length; i++) col = col * 26 + (s.charCodeAt(i) - 64);
  return col;
}

export function highlightRowNonEmptyCells(opts: Options) {
  const {
    filePath,
    outPath,
    sheetName,
    searchColumn,
    searchValue,
    fillColorRgb = 'FFFFEB9C', // default ARGB
  } = opts;

  if (!fs.existsSync(filePath)) throw new Error('File not found: ' + filePath);

  const wb = XLSX.readFile(filePath, { cellStyles: true }); // read with styles
  const wsName = sheetName ?? wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  if (!ws) throw new Error('Worksheet not found: ' + wsName);

  // Determine column index (1-based)
  const colIndex = typeof searchColumn === 'string' ? letterToColumn(searchColumn) : searchColumn;

  // Convert worksheet to range to iterate rows
  const range = XLSX.utils.decode_range(ws['!ref'] as string);
  let foundRowIdx: number | null = null;
}