import { getDashboardStats, getSetoranList } from "@/lib/queries";
import { Scale, Wallet, Users, Recycle } from "lucide-react";
import WeeklyChart from "@/components/WeeklyChart";
import Link from "next/link";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recent = (await getSetoranList(6));

  // Serialize data to plain objects (Turso rows may contain non-serializable values)
  const mingguan = stats.mingguan.map((d) => ({
    hari: String(d.hari),
    berat: Number(d.berat),
  }));

  const cards = [
    { icon: Users, label: "Nasabah Terdaftar", value: stats.totalWarga },
    { icon: Scale, label: "Total Sampah Tertimbang", value: `${stats.totalBerat.toFixed(1)} kg` },
    { icon: Wallet, label: "Saldo Beredar", value: rupiah(stats.totalRupiah) },
    { icon: Recycle, label: "Jumlah Setoran", value: stats.totalSetoran },
  ];

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Halaman Ringkasan
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
        Buku besar bank sampah.
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-paper-soft border border-rule rounded-xl p-5"
          >
            <Icon size={18} className="text-leaf-deep mb-3" strokeWidth={1.8} />
            <div className="font-display text-2xl">{value}</div>
            <div className="text-xs text-ink-soft mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl p-6">
          <h2 className="font-display text-lg mb-4">Berat Setoran 7 Hari Terakhir</h2>
          <WeeklyChart data={mingguan} />
        </div>

        <div className="lg:col-span-2 bg-paper-soft border border-rule rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Setoran Terbaru</h2>
            <Link href="/dashboard/setoran" className="text-xs text-leaf-deep font-mono hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-ink-soft">Belum ada setoran.</p>
            )}
            {recent.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm border-b border-rule/60 pb-2 last:border-0">
                <div>
                  <div className="font-medium">{s.warga_nama}</div>
                  <div className="text-xs text-ink-soft font-mono">{s.jenis_nama}</div>
                </div>
                <div className="text-right font-mono">
                  <div>{Number(s.berat_kg).toFixed(1)} kg</div>
                  <div className="text-xs text-leaf-deep">{rupiah(s.total_rupiah)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
