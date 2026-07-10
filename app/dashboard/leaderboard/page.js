import { getLeaderboard } from "@/lib/queries";
import { Trophy } from "lucide-react";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-widest text-leaf-deep">
        Apresiasi Warga
      </span>
      <h1 className="font-display text-3xl md:text-4xl mt-2 mb-8 flex items-center gap-3">
        <Trophy size={30} className="text-gold" /> Peringkat nasabah teladan.
      </h1>

      <div className="max-w-2xl space-y-3">
        {leaderboard.length === 0 && (
          <p className="text-sm text-ink-soft">Belum ada data setoran.</p>
        )}
        {leaderboard.map((w, i) => (
          <div
            key={w.id}
            className={`flex items-center justify-between border rounded-xl px-6 py-4 ${
              i === 0
                ? "bg-gold/10 border-gold"
                : "bg-paper-soft border-rule"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`font-display italic text-2xl w-8 ${
                  i === 0 ? "text-gold" : "text-ink-soft"
                }`}
              >
                {i + 1}
              </span>
              <div>
                <div className="font-medium">{w.nama}</div>
                <div className="text-xs text-ink-soft font-mono">
                  RT {w.rt || "-"} · {w.jumlah_setor} kali setor · {w.total_poin} poin
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-medium text-leaf-deep">
                {Number(w.total_berat).toFixed(1)} kg
              </div>
              <div className="text-xs text-ink-soft font-mono">total setor</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
