import XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { FieldReport } from "./ReportUtils";

export const exportToExcel = async (
  dataToExport: FieldReport[], 
  exportScope: string, 
  setIsExporting: (val: boolean) => void
) => {
  if (dataToExport.length === 0) {
    toast.error("Tidak ada data untuk diekspor.");
    return;
  }

  const toastId = toast.loading("Sedang menyiapkan file Excel...");
  try {
    setIsExporting(true);
    const totalIndividu = dataToExport.reduce((sum, item) => sum + item.jumlah, 0);

    const headerMeta = [
      ["KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN"],
      ["BALAI TAMAN NASIONAL ALAS PURWO"],
      ["LAPORAN OBSERVASI DAN REKAPITULASI SATWA LIAR"],
      [`Cakupan Export: ${exportScope.toUpperCase()}`],
      [],
      ["Tanggal Cetak", ":", new Date().toLocaleDateString("id-ID", { dateStyle: "full" })],
      ["Satuan Kerja", ":", "Balai Taman Nasional Alas Purwo"],
      ["Total Temuan Satwa", ":", `${totalIndividu} Ekor (${dataToExport.length} Laporan/Kasus)`],
      [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerMeta);

    const tableHeader = [["NO", "NAMA SATWA", "KATEGORI", "JUMLAH (EKOR)", "POS / LOKASI PENGAMATAN", "WAKTU OBSERVASI", "PETUGAS", "CUACA", "CATATAN"]];
    const tableBody = dataToExport.map((rep, idx) => [
      idx + 1,
      rep.namaSatwa,
      rep.kategori,
      rep.jumlah,
      rep.posPengamatan || rep.lokasi,
      `${new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID")} (Shift ${rep.shift})`,
      rep.namaPetugas,
      rep.kondisiCuaca || "Cerah",
      rep.aktivitasSatwa || rep.catatan || "-"
    ]);

    XLSX.utils.sheet_add_aoa(worksheet, tableHeader, { origin: "A10" });
    XLSX.utils.sheet_add_aoa(worksheet, tableBody, { origin: "A11" });

    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    const thinBorder = {
      top: { style: "thin", color: { rgb: "D1D5DB" } },
      bottom: { style: "thin", color: { rgb: "D1D5DB" } },
      left: { style: "thin", color: { rgb: "D1D5DB" } },
      right: { style: "thin", color: { rgb: "D1D5DB" } },
    };

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!worksheet[addr]) continue;

        worksheet[addr].s = {
          font: { name: "Calibri", sz: 10 },
          alignment: { vertical: "center", horizontal: "left" },
        };

        if (r === 9) {
          worksheet[addr].s = {
            fill: { fgColor: { rgb: "065F46" } },
            font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "medium", color: { rgb: "064E3B" } },
              bottom: { style: "medium", color: { rgb: "064E3B" } },
              left: { style: "thin", color: { rgb: "064E3B" } },
              right: { style: "thin", color: { rgb: "064E3B" } },
            }
          };
        }

        if (r >= 10) {
          worksheet[addr].s.border = thinBorder;
          if (r % 2 === 1) {
            worksheet[addr].s.fill = { fgColor: { rgb: "F0FDF4" } };
          }
          if (c === 0 || c === 3 || c === 7) {
            worksheet[addr].s.alignment.horizontal = "center";
          }
        }
      }
    }

    worksheet["A1"].s = { font: { name: "Calibri", sz: 13, bold: true, color: { rgb: "064E3B" } }, alignment: { horizontal: "center" } };
    worksheet["A2"].s = { font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "047857" } }, alignment: { horizontal: "center" } };
    worksheet["A3"].s = { font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "111827" } }, alignment: { horizontal: "center" } };

    worksheet["!cols"] = [{ wch: 6 }, { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 30 }, { wch: 22 }, { wch: 20 }, { wch: 15 }, { wch: 35 }];
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Laporan Observasi");
    XLSX.writeFile(wb, `Rekap_Observasi_${exportScope}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    toast.success("Ekspor Excel Berhasil", { id: toastId });
  } catch (err) {
    console.error(err);
    toast.error("Gagal Ekspor Excel", { id: toastId });
  } finally {
    setIsExporting(false);
  }
};

export const exportToPDF = (dataToExport: FieldReport[], exportScope: string) => {
  if (dataToExport.length === 0) {
    toast.error("Tidak ada data untuk dicetak.");
    return;
  }

  const doc = new jsPDF();
  const totalIndividu = dataToExport.reduce((sum, item) => sum + item.jumlah, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(6, 78, 59);
  doc.text("KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN", 105, 15, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text("BALAI TAMAN NASIONAL ALAS PURWO", 105, 21, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Seksi Pengelolaan Taman Nasional Wilayah I - Semanjung", 105, 26, { align: "center" });

  doc.setDrawColor(6, 95, 70);
  doc.setLineWidth(0.8);
  doc.line(14, 29, 196, 29);
  doc.setLineWidth(0.2);
  doc.line(14, 30.2, 196, 30.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text("LAPORAN OBSERVASI LAPANGAN SATWA LIAR", 105, 38, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(`Cakupan Data: ${exportScope.toUpperCase()}`, 105, 43, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(31, 41, 55);
  doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}`, 14, 52);
  doc.text(`Total Temuan   : ${totalIndividu} Ekor (${dataToExport.length} Laporan/Kasus)`, 14, 57);

  autoTable(doc, {
    startY: 62,
    head: [["No", "Nama Satwa", "Jumlah", "Pos / Lokasi", "Petugas", "Waktu", "Catatan"]],
    body: dataToExport.map((rep, idx) => [
      idx + 1,
      rep.namaSatwa,
      `${rep.jumlah} Ekor`,
      rep.posPengamatan || rep.lokasi,
      rep.namaPetugas,
      new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID"),
      rep.aktivitasSatwa || rep.catatan || "-"
    ]),
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center"
    },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    styles: { fontSize: 8, cellPadding: 3, valign: "middle" },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "center", cellWidth: 22 },
      5: { halign: "center", cellWidth: 25 },
    },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 120;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(31, 41, 55);
  doc.text("Mengetahui,", 140, finalY + 15);
  doc.text("Petugas Penanggung Jawab,", 140, finalY + 20);
  doc.setFont("helvetica", "bold");
  doc.text("( _______________________ )", 140, finalY + 40);

  doc.save(`Laporan_Observasi_${exportScope}_${new Date().toISOString().slice(0, 10)}.pdf`);
};