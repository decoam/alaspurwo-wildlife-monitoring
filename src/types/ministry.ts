
import { FieldReport } from "@/features/manajer/ReportUtils";

export type BAPFieldReport = FieldReport;

export interface MonthlySummaryReport {
  namaSatwa: string;
  totalJumlah: number;
  lokasiList: string[];
}

export type MinistryReportData = BAPFieldReport | MonthlySummaryReport;

export interface ReportPayload {
  nomorSurat: string;
  tipeDokumen: "BULANAN" | "BAP";
  tanggalDibuat: string;
  totalIndividu: number;
  totalKasus: number;
  data: MinistryReportData[];
}
