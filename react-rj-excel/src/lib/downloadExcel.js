const THEMES = {
  blue:    { headBg: "FF2563EB", headText: "FFFFFFFF", stripe: "FFEFF6FF", border: "FFBFDBFE" },
  green:   { headBg: "FF059669", headText: "FFFFFFFF", stripe: "FFECFDF5", border: "FFA7F3D0" },
  dark:    { headBg: "FF1F2937", headText: "FFFFFFFF", stripe: "FFF3F4F6", border: "FFD1D5DB" },
  minimal: { headBg: "FFF3F4F6", headText: "FF111827", stripe: null,       border: "FFE5E7EB" },
};

const isEmpty = (v) => v === null || v === undefined || v === "";

// One row (array, sparse array, or object) -> full list of cells
function toCells(row, headers) {
  const cells = new Array(headers.length).fill(null);
  if (Array.isArray(row)) {
    row.forEach((v, i) => {
      if (i < headers.length) cells[i] = v;
    });
  } else if (row && typeof row === "object") {
    for (const [key, v] of Object.entries(row)) {
      const idx = /^\d+$/.test(key) ? Number(key) : headers.indexOf(key);
      if (idx >= 0 && idx < headers.length) cells[idx] = v;
    }
  }
  return cells;
}

// Row numbers are the keys; an array of rows uses position + 1
function toMatrix(rows, headers) {
  const entries = Array.isArray(rows)
    ? rows.map((r, i) => [i + 1, r])
    : Object.entries(rows).map(([k, r]) => [Number(k), r]);
  entries.sort((a, b) => a[0] - b[0]);

  const matrix = [];
  let last = 0;
  for (const [num, row] of entries) {
    while (last + 1 < num) {
      matrix.push(new Array(headers.length).fill(null)); // keep gaps
      last++;
    }
    matrix.push(toCells(row, headers));
    last = num;
  }
  return matrix;
}

// Merge a filled cell with the empty cells directly below it
function mergeCellsDown(ws, matrix, columns) {
  columns.forEach((c) => {
    let start = null;
    for (let i = 0; i <= matrix.length; i++) {
      const filled = i < matrix.length && !isEmpty(matrix[i][c]);
      const blank = i < matrix.length && !filled;
      if (blank && start !== null) continue; // group keeps growing
      if (start !== null && i - 1 > start) {
        ws.mergeCells(start + 2, c + 1, i + 1, c + 1); // +2 because header is row 1
      }
      start = filled ? i : null;
    }
  });
}

export async function downloadExcel({
  headers,
  rows,
  fileName = "export.xlsx",
  sheetName = "Sheet1",
  theme = "blue",
  mergeDown = [],
  freezeHeader = true,
}) {
  if (!Array.isArray(headers) || headers.length === 0) {
    throw new Error("react-rj-excel: `headers` must be a non-empty array");
  }
  if (!rows) rows = {};
  if (!/\.xlsx$/i.test(fileName)) fileName += ".xlsx";

  const mod = await import("exceljs"); // loaded only when the user clicks
  const ExcelJS = mod.default ?? mod;

  const t = THEMES[theme] ?? THEMES.blue;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  const line = { style: "thin", color: { argb: t.border } };
  const borders = { top: line, left: line, bottom: line, right: line };

  // Header row
  const head = ws.addRow(headers);
  head.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: t.headText } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: t.headBg } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = borders;
  });
  head.height = 24;

  // Body rows
  const matrix = toMatrix(rows, headers);
  matrix.forEach((cells, i) => {
    const row = ws.addRow(cells);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = borders;
      cell.alignment = { vertical: "middle" };
      if (t.stripe && i % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: t.stripe } };
      }
    });
  });

  mergeCellsDown(ws, matrix, mergeDown);

  // Auto column width (loop, so very large data does not crash)
  headers.forEach((h, c) => {
    let longest = String(h).length;
    for (const r of matrix) {
      const len = String(r[c] ?? "").length;
      if (len > longest) longest = len;
    }
    ws.getColumn(c + 1).width = Math.min(Math.max(longest + 4, 10), 50);
  });

  if (freezeHeader) ws.views = [{ state: "frozen", ySplit: 1 }];

  // Download in the browser
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}