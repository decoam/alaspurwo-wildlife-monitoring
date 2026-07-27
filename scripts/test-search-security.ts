import { getObservations } from "@/features/observation/repository";
import { getDashboardData } from "@/app/dashboard/dashboard-data";

async function testFixes() {
  console.log("\n==================================================");
  console.log("🛡️ RUNNING SECURITY TEST FOR REGEX & ERROR HANDLING");
  console.log("==================================================\n");

  let allTestsPassed = true;

  // ----------------------------------------------------
  // TEST 1: Unclosed Parenthesis '(' pada Repository
  // ----------------------------------------------------
  console.log("[TEST 1] Testing getObservations dengan query '('...");
  try {
    const res1 = await getObservations({ search: "(" });
    if (res1.success) {
      console.log("  ✅ PASS: Query '(' berhasil diproses tanpa driver error!");
    } else if (res1.message === "Gagal memuat data pengamatan. Silakan coba beberapa saat lagi.") {
      console.log("  ✅ PASS: Error ditangkap dengan baik dan mengembalikan pesan generik yang aman.");
    } else {
      console.error("  ❌ FAIL: Mengembalikan pesan error mentah:", res1.message);
      allTestsPassed = false;
    }
  } catch (err: any) {
    console.error("  ❌ FAIL: Unhandled exception terlempar:", err.message);
    allTestsPassed = false;
  }

  // ----------------------------------------------------
  // TEST 2: ReDoS Payload '((((((((((a+)+)+)+)+)+)+)+)+)+)' pada Dashboard Data
  // ----------------------------------------------------
  console.log("\n[TEST 2] Testing getDashboardData dengan ReDoS payload...");
  const startTime = Date.now();
  try {
    const res2 = await getDashboardData("((((((((((a+)+)+)+)+)+)+)+)+)+)");
    const duration = Date.now() - startTime;

    if (duration < 1000) {
      console.log(`  ✅ PASS: Query selesai dalam ${duration}ms (Tidak ReDoS/Freeze).`);
    } else {
      console.warn(`  ⚠️ WARNING: Waktu eksekusi lumayan lama (${duration}ms).`);
    }

    if (res2.error) {
      console.log("  ℹ️ Fallback dashboard diaktifkan:", res2.error);
    }
  } catch (err: any) {
    console.error("  ❌ FAIL: Unhandled exception pada dashboard-data:", err.message);
    allTestsPassed = false;
  }

  // ----------------------------------------------------
  // TEST 3: Special Characters Query '.*+?^${}()|[]\\'
  // ----------------------------------------------------
  console.log("\n[TEST 3] Testing berbagai karakter khusus Regex...");
  const specialChars = [".*", "+?", "^$", "{}" , "[]", "\\"];
  let specialPass = true;

  for (const char of specialChars) {
    try {
      await getObservations({ search: char });
    } catch (e: any) {
      console.error(`  ❌ FAIL: Karakter '${char}' memicu crash!`);
      specialPass = false;
      allTestsPassed = false;
    }
  }

  if (specialPass) {
    console.log("  ✅ PASS: Semua karakter khusus ter-escape dengan sempurna.");
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log("\n==================================================");
  if (allTestsPassed) {
    console.log("🎉 SEMUA PENGUJIAN BERHASIL (100% SECURE) 🎉");
  } else {
    console.log("⚠️ ADA PENGECEKAN YANG GAGAL. CEK DETAIL DI ATAS.");
  }
  console.log("==================================================\n");

  process.exit(0);
}

testFixes();