import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "Repozitar_otazek.xlsx");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Excel file not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
  }

  const header = data[0] as string[];
  const questionsByRole: Record<string, string[]> = {};

  header.forEach((role, colIndex) => {
    // 💡 preskočíme pomocné stĺpce „Dát do dokumentu?“
    if (!role || typeof role !== "string" || role.toLowerCase().includes("dát do dokumentu")) return;

    const questions = data.slice(1)
      .map(row => row[colIndex])
      .filter(q => typeof q === "string" && q.trim() !== "") as string[];

    if (questions.length > 0) {
      questionsByRole[role] = questions;
    }
  });

  return NextResponse.json(questionsByRole);
}

