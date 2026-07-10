import { db, ensureSchema } from "./db";

export async function getWargaList() {
  await ensureSchema();
  const r = await db().execute(
    "SELECT * FROM warga ORDER BY nama ASC"
  );
  return r.rows;
}

export async function getJenisSampahList() {
  await ensureSchema();
  const r = await db().execute(
    "SELECT * FROM jenis_sampah ORDER BY nama ASC"
  );
  return r.rows;
}

export async function getSetoranList(limit = 50) {
  await ensureSchema();
  const r = await db().execute({
    sql: `SELECT s.*, w.nama as warga_nama, j.nama as jenis_nama, j.satuan
          FROM setoran s
          JOIN warga w ON w.id = s.warga_id
          JOIN jenis_sampah j ON j.id = s.jenis_sampah_id
          ORDER BY s.tanggal DESC, s.id DESC
          LIMIT ?`,
    args: [limit],
  });
  return r.rows;
}

export async function getSetoranById(id) {
  await ensureSchema();
  const r = await db().execute({
    sql: `SELECT s.*, w.nama as warga_nama, w.rt, j.nama as jenis_nama, j.satuan
          FROM setoran s
          JOIN warga w ON w.id = s.warga_id
          JOIN jenis_sampah j ON j.id = s.jenis_sampah_id
          WHERE s.id = ?`,
    args: [id],
  });
  return r.rows[0] || null;
}

export async function getPenarikanList(limit = 50) {
  await ensureSchema();
  const r = await db().execute({
    sql: `SELECT p.*, w.nama as warga_nama
          FROM penarikan p
          JOIN warga w ON w.id = p.warga_id
          ORDER BY p.tanggal DESC, p.id DESC
          LIMIT ?`,
    args: [limit],
  });
  return r.rows;
}

export async function getDashboardStats() {
  await ensureSchema();
  const c = db();
  const [wargaCount, totalBerat, totalRupiah, totalPoin, setoranCount] = await Promise.all([
    c.execute("SELECT COUNT(*) as n FROM warga"),
    c.execute("SELECT COALESCE(SUM(berat_kg),0) as n FROM setoran"),
    c.execute("SELECT COALESCE(SUM(total_rupiah),0) as n FROM setoran"),
    c.execute("SELECT COALESCE(SUM(total_poin),0) as n FROM setoran"),
    c.execute("SELECT COUNT(*) as n FROM setoran"),
  ]);

  const mingguan = await c.execute(`
    SELECT strftime('%Y-%m-%d', tanggal) as hari, SUM(berat_kg) as berat
    FROM setoran
    WHERE tanggal >= datetime('now', '-6 days')
    GROUP BY hari ORDER BY hari ASC
  `);

  return {
    totalWarga: Number(wargaCount.rows[0].n),
    totalBerat: Number(totalBerat.rows[0].n),
    totalRupiah: Number(totalRupiah.rows[0].n),
    totalPoin: Number(totalPoin.rows[0].n),
    totalSetoran: Number(setoranCount.rows[0].n),
    mingguan: mingguan.rows,
  };
}

export async function getLeaderboard() {
  await ensureSchema();
  const r = await db().execute(`
    SELECT w.*, COUNT(s.id) as jumlah_setor
    FROM warga w
    LEFT JOIN setoran s ON s.warga_id = w.id
    GROUP BY w.id
    ORDER BY w.total_berat DESC, w.total_poin DESC
    LIMIT 20
  `);
  return r.rows;
}
