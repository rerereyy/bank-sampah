import { getSession } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { getWargaList } from "@/lib/queries";
import { hapusWarga } from "@/lib/actions";
import NasabahForm from "@/components/NasabahForm";
import DeleteButton from "@/components/DeleteButton";
import EditWargaButton from "@/components/EditWargaButton";
import { Wallet, Trophy, Recycle, TrendingUp } from "lucide-react";
import Link from "next/link";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default async function NasabahPage() {
  const session = await getSession();
  await ensureSchema();

  // Nasabah dashboard view
  if (session?.role === "nasabah") {
    const c = db();
    
    // Get warga data
    const wargaResult = await c.execute({
      sql: "SELECT * FROM warga WHERE id = ?",
      args: [session.warga_id],
    });
    const warga = wargaResult.rows[0];

    // Get recent setoran
    const setoranResult = await c.execute({
      sql: `SELECT s.*, js.nama as jenis_nama 
            FROM setoran s 
            JOIN jenis_sampah js ON s.jenis_sampah_id = js.id 
            WHERE s.warga_id = ? 
            ORDER BY s.tanggal DESC LIMIT 5`,
      args: [session.warga_id],
    });
    const recentSetoran = setoranResult.rows;

    // Get rank
    const rankResult = await c.execute({
      sql: "SELECT COUNT(*) as rank FROM warga WHERE total_poin > ?",
      args: [warga?.total_poin || 0],
    });
    const rank = Number(rankResult.rows[0].rank) + 1;

    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl italic text-leaf-deep">
            Selamat datang, {session.nama}
          </h1>
          <p className="text-sm text-ink-soft mt-1">Ringkasan akun nasabah Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-paper-soft rounded-xl p-5 border border-gold/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-leaf/10 rounded-lg">
                <Wallet size={20} className="text-leaf-deep" />
              </div>
              <span className="text-xs font-mono uppercase text-ink-soft">Saldo</span>
            </div>
            <p className="text-2xl font-bold text-leaf-deep">
              Rp {(warga?.saldo || 0).toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-paper-soft rounded-xl p-5 border border-gold/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Trophy size={20} className="text-gold-deep" />
              </div>
              <span className="text-xs font-mono uppercase text-ink-soft">Poin</span>
            </div>
            <p className="text-2xl font-bold text-gold-deep">
              {warga?.total_poin || 0}
            </p>
          </div>

          <div className="bg-paper-soft rounded-xl p-5 border border-gold/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-earth/10 rounded-lg">
                <Recycle size={20} className="text-earth-deep" />
              </div>
              <span className="text-xs font-mono uppercase text-ink-soft">Total Setor</span>
            </div>
            <p className="text-2xl font-bold text-earth-deep">
              {warga?.total_berat || 0} kg
            </p>
          </div>

          <div className="bg-paper-soft rounded-xl p-5 border border-gold/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-leaf/10 rounded-lg">
                <TrendingUp size={20} className="text-leaf-deep" />
              </div>
              <span className="text-xs font-mono uppercase text-ink-soft">Peringkat</span>
            </div>
            <p className="text-2xl font-bold text-leaf-deep">
              #{rank}
            </p>
          </div>
        </div>

        {/* Recent Setoran */}
        <div className="bg-paper-soft rounded-xl p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg italic text-ink">Setoran Terakhir</h2>
            <Link
              href="/dashboard/riwayat"
              className="text-sm text-leaf-deep hover:text-leaf font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          {recentSetoran.length === 0 ? (
            <p className="text-ink-soft text-center py-8">
              Belum ada setoran. Mulai setor sampah sekarang!
            </p>
          ) : (
            <div className="space-y-3">
              {recentSetoran.map((setoran) => (
                <div
                  key={setoran.id}
                  className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-ink">{setoran.jenis_nama}</p>
                    <p className="text-xs text-ink-soft">
                      {new Date(setoran.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-leaf-deep">
                      +Rp {setoran.total_rupiah.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gold-deep">
                      +{setoran.total_poin} poin
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin view - manage nasabah
  const warga = await getWargaList();

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Data Nasabah
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8">
        Daftar warga penabung.
      </h1>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <NasabahForm />
        </div>

        <div className="lg:col-span-3 bg-paper-soft border border-rule rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cover text-paper-soft text-left font-mono text-xs uppercase">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">RT</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">Poin</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {warga.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                    Belum ada nasabah.
                  </td>
                </tr>
              )}
              {warga.map((w) => (
                <tr key={w.id} className="border-t border-rule">
                  <td className="px-4 py-3">
                    <div className="font-medium">{w.nama}</div>
                    <div className="text-xs text-ink-soft">{w.no_hp}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{w.rt || "-"}</td>
                  <td className="px-4 py-3 font-mono">{rupiah(w.saldo)}</td>
                  <td className="px-4 py-3 font-mono">{w.total_poin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <EditWargaButton warga={w} />
                      <DeleteButton
                        action={hapusWarga.bind(null, w.id)}
                        confirmText={`Hapus nasabah "${w.nama}" beserta riwayat transaksinya?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
