import Link from "next/link";
import {
  Trees,
  PawPrint,
  ShieldCheck,
  Binoculars,
  Leaf,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
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
              <Leaf size={16} className="text-lime-300" />
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

              <Link href="/register" className="landing-btn-secondary">
                Daftar Petugas
              </Link>
            </div>

            <div className="landing-stats-row">
              <div>
                <h2 className="landing-stat-number">42</h2>
                <p className="landing-stat-label">Pos Pengamatan</p>
              </div>

              <div>
                <h2 className="landing-stat-number">1.256</h2>
                <p className="landing-stat-label">Observasi</p>
              </div>

              <div>
                <h2 className="landing-stat-number">87</h2>
                <p className="landing-stat-label">Spesies</p>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="landing-features-column">
            <div className="landing-feature-card">
              <div className="landing-feature-flex">
                <div className="landing-feature-icon-wrapper">
                  <Binoculars className="text-lime-300" />
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
                  <Trees className="text-lime-300" />
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
                  <ShieldCheck className="text-lime-300" />
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
                <PawPrint className="text-lime-300" />
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