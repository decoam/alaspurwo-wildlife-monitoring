import Link from "next/link";
import {
  Trees,
  PawPrint,
  ShieldCheck,
  Binoculars,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";

async function getLandingStats() {
  try {
    await connectDB();

    const [observations, species, locations] = await Promise.all([
      Observation.countDocuments({ deletedAt: null }),
      Observation.distinct("namaSatwa", { deletedAt: null }),
      Observation.distinct("lokasi", { deletedAt: null }),
    ]);

    return {
      observations: Number.isFinite(observations) ? observations : 0,
      species: Array.isArray(species) ? species.length : 0,
      locations: Array.isArray(locations) ? locations.length : 0,
    };
  } catch (error) {
    console.error("Failed to load landing page statistics", error);
    return { observations: 0, species: 0, locations: 0 };
  }
}

export default async function HomePage() {
  const stats = await getLandingStats();

  return (
    <main className="landing-main">
      {/* Background Image */}
      <div
        className="landing-bg-image"
        style={{
          backgroundImage: "url('/forest-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="landing-overlay" />

      <div className="landing-hero-container">
        <div className="landing-grid-layout">
          
          {/* LEFT SECTION */}
          <div>
            <div className="landing-tag">
              <Leaf size={16} className="text-accent-text" />
              Taman Nasional Alas Purwo
            </div>

            <h1 className="landing-title">
              Wildlife
              <span className="landing-title-highlight">
                Monitoring System
              </span>
            </h1>

            <p className="landing-description">
              Platform digital untuk membantu petugas konservasi
              mencatat aktivitas pengamatan satwa liar secara cepat,
              akurat, dan terintegrasi langsung dari lapangan.
            </p>

            <div className="landing-actions">
              <Link href="/login" className="landing-btn-primary">
                Masuk
                <ArrowRight size={18} />
              </Link>

              {/* <Link href="/register" className="landing-btn-secondary">
                Daftar Petugas
              </Link> */}
            </div>

            <div className="landing-stats-row">
              <div>
                <h2 className="landing-stat-number">{stats.locations.toLocaleString("id-ID")}</h2>
                <p className="landing-stat-label">Pos Pengamatan</p>
              </div>

              <div>
                <h2 className="landing-stat-number">{stats.observations.toLocaleString("id-ID")}</h2>
                <p className="landing-stat-label">Observasi</p>
              </div>

              <div>
                <h2 className="landing-stat-number">{stats.species.toLocaleString("id-ID")}</h2>
                <p className="landing-stat-label">Spesies</p>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="landing-features-column">
            <div className="landing-feature-card">
              <div className="landing-feature-flex">
                <div className="landing-feature-icon-wrapper">
                  <Binoculars className="text-accent-text" />
                </div>
                <div>
                  <h3 className="landing-feature-title">Monitoring Satwa</h3>
                  <p className="landing-stat-label">
                    Catat hasil observasi pagi dan sore secara realtime.
                  </p>
                </div>
              </div>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-flex">
                <div className="landing-feature-icon-wrapper">
                  <Trees className="text-accent-text" />
                </div>
                <div>
                  <h3 className="landing-feature-title">Konservasi Alam</h3>
                  <p className="landing-stat-label">
                    Data terpusat untuk mendukung pengelolaan kawasan konservasi.
                  </p>
                </div>
              </div>
            </div>

            <div className="landing-feature-card">
              <div className="landing-feature-flex">
                <div className="landing-feature-icon-wrapper">
                  <ShieldCheck className="text-accent-text" />
                </div>
                <div>
                  <h3 className="landing-feature-title">Akses Aman</h3>
                  <p className="landing-stat-label">
                    Sistem autentikasi petugas dengan keamanan berbasis session.
                  </p>
                </div>
              </div>
            </div>

            <div className="landing-quote-card">
              <div className="landing-quote-flex">
                <PawPrint className="text-accent-text" />
                <p className="landing-quote-text">
                  "Menjaga satwa liar hari ini adalah menjaga keseimbangan alam untuk generasi mendatang."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}