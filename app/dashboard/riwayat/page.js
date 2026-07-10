import { getSession } from "@/lib/auth";
import { db, ensureSchema } from "@/lib/db";
import { redirect } from "next/navigation";
import { History, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const statusBadge = (status) => {
  const config = {
    pending: {
      style: "bg-gold/20 text-gold-deep border border-gold/30",
      icon: Clock,
      label: "Menunggu",
    },
    approved: {
      style: "bg-leaf/20 text-leaf-deep border border-leaf/30",
      icon: CheckCircle,
      label: "Disetujui",
    },
    rejected: {
      style: "bg-stamp/20 text-stamp border border-stamp/30",
      icon: XCircle,
      label: "Ditolak",
    },
  };
  const { style, icon: Icon, label } = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${style}`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

export default async function RiwayatPage() {
  const session = await getSession();
  
  if (session?.role !== "nasabah") {
    redirect("/dashboard");
  }

  await ensureSchema();
  const c = db();

  const setoranResult = await c.execute({
    sql: `SELECT s.*, js.nama as jenis_nama 
          FROM setoran s 
          JOIN jenis_sampah js ON s.jenis_sampah_id = js.id 
          WHERE s.warga_id = ? 
          ORDER BY s.tanggal DESC`,
    args: [session.warga_id],
  });
  const setoranList = setoranResult.rows;

  const penarikanResult = await c.execute({
    sql: `SELECT * FROM penarikan WHERE warga_id = ? ORDER BY tanggal DESC`,
    args: [session.warga_id],
  });
  const penarikanList = penarikanResult.rows;

  // Count pending withdrawals
  const pendingCount = penarikanList.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/nasabah"
          className="p-2 hover:bg-paper-soft rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-ink-soft" />
        </Link>
        <div>
          <h1 className="font-display text-2xl italic text-leaf-deep">
            Riwayat Aktivitas
          </h1>
          <p className="text-sm text-ink-soft mt-1">Semua setoran dan penarikan Anda</p>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-center gap-3">
          <Clock size={20} className="text-gold-deep" />
          <div>
            <p className="font-medium text-gold-deep">
              {pendingCount} penarikan menunggu konfirmasi
            </p>
            <p className="text-xs text-ink-soft">
              Saldo Anda dikurangi sementara hingga admin memproses
            </p>
          </div>
        </div>
      )}

      {/* Setoran */}
      <div className="bg-paper-soft rounded-xl p-6 border border-gold/20">
        <h2 className="font-display text-lg italic text-ink mb-4 flex items-center gap-2">
          <History size={18} />
          Riwayat Setoran
        </h2>

        {setoranList.length === 0 ? (
          <p className="text-ink-soft text-center py-6">Belum ada setoran</p>
        ) : (
          <div className="space-y-3">
            {setoranList.map((setoran) => (
              <div
                key={setoran.id}
                className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
              >
                <div>
                  <p className="font-medium text-ink">{setoran.jenis_nama}</p>
                  <p className="text-xs text-ink-soft">
                    {setoran.berat_kg} kg • {new Date(setoran.tanggal).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-leaf-deep">
                    +Rp {setoran.total_rupiah.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gold-deep">+{setoran.total_poin} poin</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Penarikan */}
      <div className="bg-paper-soft rounded-xl p-6 border border-gold/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg italic text-ink flex items-center gap-2">
            <History size={18} />
            Riwayat Penarikan
          </h2>
          <Link
            href="/dashboard/penarikan-saya"
            className="text-sm text-leaf-deep hover:text-leaf font-medium"
          >
            + Tarik Saldo
          </Link>
        </div>

        {penarikanList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ink-soft mb-3">Belum ada penarikan</p>
            <Link
              href="/dashboard/penarikan-saya"
              className="text-sm text-leaf-deep hover:underline"
            >
              Ajukan penarikan sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {penarikanList.map((penarikan) => (
              <div
                key={penarikan.id}
                className="bg-paper rounded-lg p-4 border border-rule/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-ink">
                        {penarikan.keterangan || "Penarikan Saldo"}
                      </p>
                      {statusBadge(penarikan.status)}
                    </div>
                    <p className="text-xs text-ink-soft">
                      {new Date(penarikan.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {penarikan.status === "rejected" && (
                      <p className="text-xs text-leaf-deep mt-1">
                        Saldo telah dikembalikan
                      </p>
                    )}
                    {penarikan.petugas && (
                      <p className="text-xs text-ink-soft mt-1">
                        Diproses oleh: {penarikan.petugas}
                      </p>
                    )}
                  </div>
                  <p className={`font-mono font-medium ${penarikan.status === 'rejected' ? 'text-leaf-deep' : 'text-stamp'}`}>
                    {penarikan.status === 'rejected' ? '+' : '-'}Rp {penarikan.jumlah.toLocaleString("id-ID")}
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
