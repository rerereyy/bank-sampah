import Link from "next/link";
import { Leaf, Recycle, Wallet, TrendingUp, Scale } from "lucide-react";
import { getDashboardStats, getLeaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function Home() {
  const stats = await getDashboardStats();
  const leaderboard = (await getLeaderboard()).slice(0, 3);

  return (
    <main className="flex-1">
      {/* COVER — sampul buku tabungan */}
      <section className="relative bg-cover text-paper-soft min-h-[92vh] flex flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-3 bg-cover-deep" />
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-14 py-7">
          <div className="flex items-center gap-2 font-display italic text-lg text-gold-soft">
            <Recycle size={20} strokeWidth={2.2} />
            Bank Sampah Digital
          </div>
          <Link
            href="/login"
            className="text-sm border border-gold/50 rounded-full px-5 py-2 hover:bg-gold hover:text-cover-deep transition-colors"
          >
            Masuk Petugas
          </Link>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-14 max-w-4xl">
          <span className="font-mono text-xs tracking-[0.3em] text-gold-soft/80 uppercase mb-6">
            No. Rekening Lingkungan — RT 01 / RT 02
          </span>
          <h1 className="font-display font-900 text-[13vw] md:text-8xl leading-[0.95] text-gold-soft">
            Buku
            <br />
            <span className="italic text-paper-soft">Tabungan</span>
            <br />
            Sampah
          </h1>
          <p className="mt-8 max-w-lg text-paper-soft/80 leading-relaxed">
            Setiap kantong sampah terpilah yang warga setorkan, dicatat di sini
            sebagai saldo — bisa ditarik jadi uang, bisa dipantau lewat
            peringkat warga paling rajin.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="bg-gold text-cover-deep font-semibold px-7 py-3 rounded-full hover:bg-gold-soft transition-colors"
            >
              Buka Halaman Petugas
            </Link>
            <a
              href="#buku"
              className="border border-paper-soft/30 px-7 py-3 rounded-full hover:border-gold-soft transition-colors"
            >
              Lihat Isi Buku ↓
            </a>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-gold/20 font-mono text-sm">
          {[
            ["Nasabah Terdaftar", stats.totalWarga],
            ["Sampah Tertimbang", `${stats.totalBerat.toFixed(1)} kg`],
            ["Saldo Dibagikan", rupiah(stats.totalRupiah)],
            ["Total Setoran", stats.totalSetoran],
          ].map(([label, val]) => (
            <div key={label} className="px-6 md:px-14 py-6 border-r border-gold/10 last:border-r-0">
              <div className="text-gold-soft text-lg md:text-xl">{val}</div>
              <div className="text-paper-soft/50 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* fold shadow */}
      <div className="h-4 bg-gradient-to-b from-black/25 to-transparent" />

      {/* PAGE 1 — ledger ruled paper */}
      <section id="buku" className="bg-paper-soft px-6 md:px-14 py-20 ruled">
        <div className="max-w-3xl">
          <span className="font-mono text-xs tracking-widest text-leaf-deep uppercase">
            Halaman 1 — Cara Kerja
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-14">
            Tiga baris, satu buku tabungan.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl">
          {[
            {
              icon: Scale,
              title: "Timbang & Pilah",
              text: "Warga setor sampah terpilah ke petugas. Berat dan jenisnya dicatat langsung di sistem.",
            },
            {
              icon: TrendingUp,
              title: "Poin & Saldo Bertambah",
              text: "Setiap kilogram dikonversi otomatis jadi rupiah dan poin, tercatat di buku tabungan warga.",
            },
            {
              icon: Wallet,
              title: "Tarik atau Kumpulkan",
              text: "Saldo bisa dicairkan kapan saja, atau dikumpulkan untuk naik peringkat warga paling rajin.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative pl-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-ink-soft">
                  0{i + 1}
                </span>
                <Icon size={22} className="text-leaf-deep" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-xl mb-2">{title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAGE 2 — leaderboard preview */}
      <section className="bg-paper px-6 md:px-14 py-20 border-t border-rule">
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-xs tracking-widest text-leaf-deep uppercase">
            Halaman 2 — Papan Nasabah Teladan
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-3">
            Warga paling rajin setor.
          </h2>
        </div>

        <div className="max-w-2xl space-y-3">
          {leaderboard.length === 0 && (
            <p className="text-ink-soft text-sm">Belum ada data setoran.</p>
          )}
          {leaderboard.map((w, i) => (
            <div
              key={w.id}
              className="flex items-center justify-between bg-paper-soft border border-rule rounded-lg px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-display italic text-2xl text-gold w-8">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium">{w.nama}</div>
                  <div className="text-xs text-ink-soft font-mono">
                    RT {w.rt || "-"} · {w.jumlah_setor} kali setor
                  </div>
                </div>
              </div>
              <div className="font-mono text-sm text-leaf-deep">
                {Number(w.total_berat).toFixed(1)} kg
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 mt-10 text-sm font-medium text-leaf-deep hover:underline"
        >
          <Leaf size={16} /> Kelola sebagai petugas
        </Link>
      </section>

      {/* BACK COVER */}
      <footer className="bg-cover-deep text-paper-soft/60 px-6 md:px-14 py-10 flex flex-col md:flex-row justify-between gap-3 text-sm">
        <span className="font-display italic text-gold-soft">
          Bank Sampah Digital
        </span>
        <span className="font-mono">
          Proyek UAS · Pemrograman Web · {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
