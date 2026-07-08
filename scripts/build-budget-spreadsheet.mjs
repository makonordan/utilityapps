/**
 * Generates the "Simple Monthly Budget Spreadsheet" product file.
 *
 *   node scripts/build-budget-spreadsheet.mjs
 *
 * Output: product-files/budget-spreadsheet.xlsx  (upload to Supabase Storage)
 */
import ExcelJS from "exceljs";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "product-files", "budget-spreadsheet.xlsx");

const BLUE = "FF0066FF";
const LIGHT = "FFEBF2FF";
const GREY = "FFF1F5F9";
const MONEY = '"$"#,##0.00';
const PERCENT = "0.0%";

const wb = new ExcelJS.Workbook();
wb.creator = "UtilityApps";
wb.created = new Date();

function sectionHeader(ws, row, span, text) {
  ws.mergeCells(`A${row}:${span}${row}`);
  const c = ws.getCell(`A${row}`);
  c.value = text;
  c.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
  c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BLUE } };
  c.alignment = { vertical: "middle" };
  ws.getRow(row).height = 22;
}

function colHeader(cell, text) {
  cell.value = text;
  cell.font = { bold: true, size: 10, color: { argb: "FF334155" } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREY } };
}

function input(cell) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT } };
  cell.numFmt = MONEY;
  cell.border = { bottom: { style: "thin", color: { argb: "FFCBD5E1" } } };
}

// ---------------------------------------------------------------- Sheet 1 --
const ws = wb.addWorksheet("Monthly Budget", {
  views: [{ showGridLines: false }],
});
ws.getColumn(1).width = 32;
ws.getColumn(2).width = 18;
ws.getColumn(3).width = 18;

ws.mergeCells("A1:C1");
ws.getCell("A1").value = "Monthly Budget";
ws.getCell("A1").font = { bold: true, size: 20, color: { argb: BLUE } };
ws.getRow(1).height = 28;

ws.mergeCells("A2:C2");
ws.getCell("A2").value = "Type your numbers into the shaded cells — every total updates itself.";
ws.getCell("A2").font = { size: 10, italic: true, color: { argb: "FF64748B" } };

// Income
sectionHeader(ws, 4, "C", "INCOME");
colHeader(ws.getCell("A5"), "Source");
colHeader(ws.getCell("B5"), "Monthly amount");
const incomeRows = ["Salary / wages", "Side income", "Other income", "Other income"];
incomeRows.forEach((label, i) => {
  const r = 6 + i;
  ws.getCell(`A${r}`).value = label;
  input(ws.getCell(`B${r}`));
});
ws.getCell("A10").value = "Total income";
ws.getCell("A10").font = { bold: true };
ws.getCell("B10").value = { formula: "SUM(B6:B9)" };
ws.getCell("B10").font = { bold: true };
ws.getCell("B10").numFmt = MONEY;

// Expenses
sectionHeader(ws, 12, "C", "EXPENSES");
colHeader(ws.getCell("A13"), "Category");
colHeader(ws.getCell("B13"), "Budgeted");
colHeader(ws.getCell("C13"), "Actual");
const expenses = [
  "Rent / mortgage",
  "Utilities (power, water, gas)",
  "Internet & phone",
  "Groceries",
  "Dining out & takeout",
  "Transport & fuel",
  "Insurance",
  "Health & medical",
  "Subscriptions",
  "Entertainment & leisure",
  "Shopping & clothing",
  "Personal care",
  "Education & learning",
  "Gifts & donations",
  "Debt repayment",
  "Savings & investments",
];
expenses.forEach((label, i) => {
  const r = 14 + i; // rows 14..29
  ws.getCell(`A${r}`).value = label;
  input(ws.getCell(`B${r}`));
  input(ws.getCell(`C${r}`));
});
const totalRow = 30;
ws.getCell(`A${totalRow}`).value = "Total expenses";
ws.getCell(`A${totalRow}`).font = { bold: true };
ws.getCell(`B${totalRow}`).value = { formula: "SUM(B14:B29)" };
ws.getCell(`C${totalRow}`).value = { formula: "SUM(C14:C29)" };
["B", "C"].forEach((col) => {
  const c = ws.getCell(`${col}${totalRow}`);
  c.font = { bold: true };
  c.numFmt = MONEY;
  c.border = { top: { style: "thin", color: { argb: "FF94A3B8" } } };
});

// Summary
sectionHeader(ws, 32, "C", "SUMMARY");
const summary = [
  ["Total income", "B10"],
  ["Total expenses (actual)", "C30"],
  ["Money left over", null],
  ["Savings rate", null],
];
summary.forEach(([label], i) => {
  const r = 33 + i;
  ws.getCell(`A${r}`).value = label;
  ws.getCell(`A${r}`).font = { bold: i >= 2 };
});
ws.getCell("B33").value = { formula: "B10" };
ws.getCell("B34").value = { formula: "C30" };
ws.getCell("B35").value = { formula: "B33-B34" };
ws.getCell("B36").value = { formula: "IF(B33=0,0,C29/B33)" };
["B33", "B34", "B35"].forEach((a) => (ws.getCell(a).numFmt = MONEY));
ws.getCell("B35").font = { bold: true, color: { argb: BLUE } };
ws.getCell("B36").numFmt = PERCENT;
ws.getCell("B36").font = { bold: true, color: { argb: BLUE } };

// ---------------------------------------------------------------- Sheet 2 --
const yr = wb.addWorksheet("12-Month Tracker", { views: [{ showGridLines: false }] });
yr.getColumn(1).width = 16;
[2, 3, 4, 5].forEach((c) => (yr.getColumn(c).width = 16));

yr.mergeCells("A1:E1");
yr.getCell("A1").value = "12-Month Tracker";
yr.getCell("A1").font = { bold: true, size: 20, color: { argb: BLUE } };
yr.getRow(1).height = 28;
yr.mergeCells("A2:E2");
yr.getCell("A2").value = "Fill in Income and Expenses each month — Saved and Savings rate calculate themselves.";
yr.getCell("A2").font = { size: 10, italic: true, color: { argb: "FF64748B" } };

["A", "B", "C", "D", "E"].forEach((col, i) =>
  colHeader(yr.getCell(`${col}4`), ["Month", "Income", "Expenses", "Saved", "Savings rate"][i])
);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
months.forEach((m, i) => {
  const r = 5 + i; // 5..16
  yr.getCell(`A${r}`).value = m;
  input(yr.getCell(`B${r}`));
  input(yr.getCell(`C${r}`));
  yr.getCell(`D${r}`).value = { formula: `B${r}-C${r}` };
  yr.getCell(`D${r}`).numFmt = MONEY;
  yr.getCell(`E${r}`).value = { formula: `IF(B${r}=0,0,D${r}/B${r})` };
  yr.getCell(`E${r}`).numFmt = PERCENT;
});
const tr = 17;
yr.getCell(`A${tr}`).value = "Total / Average";
yr.getCell(`A${tr}`).font = { bold: true };
yr.getCell(`B${tr}`).value = { formula: "SUM(B5:B16)" };
yr.getCell(`C${tr}`).value = { formula: "SUM(C5:C16)" };
yr.getCell(`D${tr}`).value = { formula: "SUM(D5:D16)" };
yr.getCell(`E${tr}`).value = { formula: `IF(B${tr}=0,0,D${tr}/B${tr})` };
["B", "C", "D"].forEach((c) => {
  yr.getCell(`${c}${tr}`).numFmt = MONEY;
  yr.getCell(`${c}${tr}`).font = { bold: true };
  yr.getCell(`${c}${tr}`).border = { top: { style: "thin", color: { argb: "FF94A3B8" } } };
});
yr.getCell(`E${tr}`).numFmt = PERCENT;
yr.getCell(`E${tr}`).font = { bold: true };
yr.getCell(`E${tr}`).border = { top: { style: "thin", color: { argb: "FF94A3B8" } } };

// ---------------------------------------------------------------- Sheet 3 --
const help = wb.addWorksheet("Start Here", { views: [{ showGridLines: false }] });
help.getColumn(1).width = 96;
const helpLines = [
  ["Simple Monthly Budget Spreadsheet", 18, BLUE, true],
  ["", 10, null, false],
  ["How to use this spreadsheet", 13, "FF0F172A", true],
  ["1. Open the 'Monthly Budget' tab. Type your income and expenses into the shaded cells.", 11, "FF334155", false],
  ["2. 'Budgeted' is your plan for the month; 'Actual' is what you really spent.", 11, "FF334155", false],
  ["3. The Summary shows what you have left over and your savings rate automatically.", 11, "FF334155", false],
  ["4. Each month, copy your totals into the '12-Month Tracker' tab to watch the trend.", 11, "FF334155", false],
  ["", 10, null, false],
  ["A healthy target is a savings rate of 20% or more — but any positive number is progress.", 11, "FF64748B", false],
  ["", 10, null, false],
  ["Only the shaded cells need your input. Every total and percentage is a formula.", 11, "FF64748B", false],
  ["Works in Microsoft Excel, Google Sheets and Apple Numbers.", 11, "FF64748B", false],
  ["", 10, null, false],
  ["UtilityApps  ·  utilityapps.site", 10, "FF94A3B8", false],
];
helpLines.forEach((line, i) => {
  const [text, size, color, bold] = line;
  const c = help.getCell(`A${i + 1}`);
  c.value = text;
  c.font = { size, bold, ...(color ? { color: { argb: color } } : {}) };
});

mkdirSync(dirname(OUT), { recursive: true });
await wb.xlsx.writeFile(OUT);
console.log("Wrote", OUT);
