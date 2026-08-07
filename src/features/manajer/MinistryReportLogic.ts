
import { useState, useEffect, useMemo, useCallback } from "react";
import { formatDateFull } from "@/lib/date";
import { FieldReport } from "@/features/manajer/ReportUtils";
import { ReportPayload, MonthlySummaryReport } from "@/types/ministry";

export function useMinistryReportLogic(initialReports: FieldReport[]) {
  const [reports] = useState<FieldReport[]>(initialReports);
  const [documentType, setDocumentType] = useState<"BULANAN" | "BAP">("BULANAN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"draft" | "sent">("draft");
  const [newCount, setNewCount] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [protectedKeywords, setProtectedKeywords] = useState<string[]>([]);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);

  // Fetch Master Satwa Dilindungi
  useEffect(() => {
    const fetchProtectedSpecies = async () => {
      try {
        const res = await fetch("/api/satwa?protected=true");
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const keywords = result.data.flatMap(
            (spesies: { keywords: string[]; namaSpesies: string }) =>
              spesies.keywords || [spesies.namaSpesies.toLowerCase()]
          );
          setProtectedKeywords(keywords);
        }
      } catch (error) {
        console.error("Gagal memuat master satwa dilindungi:", error);
      } finally {
        setIsLoadingSpecies(false);
      }
    };

    fetchProtectedSpecies();
  }, []);

  // Fetch Status Sinkronisasi
  const fetchDocumentStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/manajer/observation/sync?tipeDokumen=${documentType}`);
      if (res.ok) {
        const data = await res.json();
        setSubmitStatus(data.isSynced ? "sent" : "draft");
        setNewCount(data.newCount || 0);
      }
    } catch (error) {
      console.error("Gagal mengecek status sinkronisasi:", error);
    }
  }, [documentType]);

  useEffect(() => {
    fetchDocumentStatus();
  }, [fetchDocumentStatus]);

  // Filter Laporan Satwa Dilindungi
  const protectedAnimalReports = useMemo(() => {
    if (protectedKeywords.length === 0) return [];
    return reports.filter((rep) =>
      protectedKeywords.some((keyword) =>
        rep.namaSatwa.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [reports, protectedKeywords]);

  const totalProtectedEkor = useMemo(() => {
    return protectedAnimalReports.reduce((sum, item) => sum + item.jumlah, 0);
  }, [protectedAnimalReports]);

  // Akumulasi Data Bulanan
  const monthlySummary: MonthlySummaryReport[] = useMemo(() => {
    const summaryMap: { [key: string]: { namaSatwa: string; totalJumlah: number; lokasiList: string[] } } = {};

    protectedAnimalReports.forEach((item) => {
      const key = item.namaSatwa.toLowerCase();
      const pos = item.posPengamatan || item.lokasi || "Sadengan";

      if (!summaryMap[key]) {
        summaryMap[key] = {
          namaSatwa: item.namaSatwa,
          totalJumlah: 0,
          lokasiList: [],
        };
      }
      summaryMap[key].totalJumlah += item.jumlah;
      if (!summaryMap[key].lokasiList.includes(pos)) {
        summaryMap[key].lokasiList.push(pos);
      }
    });

    return Object.values(summaryMap);
  }, [protectedAnimalReports]);

  // Current Payload
  const currentPayload: ReportPayload = useMemo(() => ({
    nomorSurat: `KLHK/TN-AP/${documentType}/${new Date().getFullYear()}/001`,
    tipeDokumen: documentType,
    tanggalDibuat: formatDateFull(new Date()),
    totalKasus: protectedAnimalReports.length,
    totalIndividu: totalProtectedEkor,
    data: documentType === "BULANAN" ? monthlySummary : protectedAnimalReports,
  }), [documentType, protectedAnimalReports, totalProtectedEkor, monthlySummary]);

  // Handle Kirim
  const handleSendToMinistry = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/manajer/observation/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipeDokumen: documentType,
          nomorSurat: currentPayload.nomorSurat,
          totalKasus: currentPayload.totalKasus,
          totalIndividu: currentPayload.totalIndividu,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal melakukan sinkronisasi data.");

      setSubmitStatus("sent");
      setIsPreviewOpen(false);
      alert(`Berhasil mengirimkan ${currentPayload.tipeDokumen} ke Server Pusat Kementerian LHK!`);
      await fetchDocumentStatus();
    } catch (error: unknown) {
      console.error("Gagal mengirim laporan:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal menghubungi server";
      alert(`Terjadi kesalahan: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    documentType,
    setDocumentType,
    isSubmitting,
    submitStatus,
    newCount,
    isPreviewOpen,
    setIsPreviewOpen,
    isLoadingSpecies,
    protectedAnimalReports,
    totalProtectedEkor,
    monthlySummary,
    currentPayload,
    handleSendToMinistry,
  };
}
